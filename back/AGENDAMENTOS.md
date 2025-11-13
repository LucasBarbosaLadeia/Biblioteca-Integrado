# Rotas de Agendamentos (design e exemplos)

Este documento descreve como criar um recurso de `agendamentos` no backend (Node + Express + Sequelize) para gerenciar solicitações/agendações de retirada de livros. O requisito principal que você pediu:

- Quando o bibliotecário confirmar um agendamento, o sistema deve criar um `emprestimo` e automaticamente remover (excluir) o `agendamento` para aquele usuário/livro. Tudo isso deve ocorrer dentro de uma transação para evitar inconsistências (concorrência/quantidade de livros).

As instruções abaixo incluem: modelo (Sequelize), controller (handlers), rotas e exemplo de SQL para criar a tabela (caso você prefira migrations manuais).

---

## 1) Modelo Sequelize (src/models/Agendamento.ts)

Exemplo de model TypeScript compatível com o padrão do projeto:

```ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export interface IAgendamento {
  id_agendamento?: number;
  id_usuario: number;
  id_livro: number;
  data_agendada?: Date | string; // quando o usuário marcou a retirada
  local_retirada?: string;
  quantidade?: number;
  status?: "pendente" | "confirmado" | "retirado" | "recusado" | "expirado";
  createdAt?: Date;
  updatedAt?: Date;
}

class Agendamento extends Model<IAgendamento> implements IAgendamento {
  public id_agendamento!: number;
  public id_usuario!: number;
  public id_livro!: number;
  public data_agendada?: Date | string;
  public local_retirada?: string;
  public quantidade?: number;
  public status?:
    | "pendente"
    | "confirmado"
    | "retirado"
    | "recusado"
    | "expirado";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Agendamento.init(
  {
    id_agendamento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_agendamento",
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario",
      references: { model: "usuarios", key: "id_usuario" },
    },
    id_livro: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_livro",
      references: { model: "livros", key: "id_livro" },
    },
    data_agendada: { type: DataTypes.DATE, field: "data_agendada" },
    local_retirada: { type: DataTypes.STRING(200), field: "local_retirada" },
    quantidade: {
      type: DataTypes.INTEGER,
      field: "quantidade",
      defaultValue: 1,
    },
    status: {
      type: DataTypes.ENUM(
        "pendente",
        "confirmado",
        "retirado",
        "recusado",
        "expirado"
      ),
      defaultValue: "pendente",
      field: "status",
    },
  },
  {
    sequelize,
    tableName: "agendamentos",
    timestamps: true,
    underscored: true,
  }
);

export default Agendamento;
```

Após criar o model, importe-o em `src/models/index.ts` (como os outros modelos) e defina as associações:

```ts
import Agendamento from "./Agendamento";

// Usuário <-> Agendamento
Usuario.hasMany(Agendamento, { foreignKey: "id_usuario", as: "agendamentos" });
Agendamento.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

// Livro <-> Agendamento
Livro.hasMany(Agendamento, { foreignKey: "id_livro", as: "agendamentos" });
Agendamento.belongsTo(Livro, { foreignKey: "id_livro", as: "livro" });
```

---

## 2) Tabela SQL (opcional)

Se preferir criar manualmente a tabela no MySQL:

```sql
CREATE TABLE agendamentos (
  id_agendamento INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_livro INT NOT NULL,
  data_agendada DATETIME NULL,
  local_retirada VARCHAR(200) NULL,
  quantidade INT DEFAULT 1,
  status ENUM('pendente','confirmado','retirado','recusado','expirado') DEFAULT 'pendente',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_livro) REFERENCES livros(id_livro)
);
```

---

## 3) Controller (src/controller/AgendamentoController.ts)

Exemplo com endpoints principais e lógica de `confirm` que cria um empréstimo e exclui o agendamento dentro de uma transação.

```ts
import { Request, Response } from "express";
import sequelize from "../config/database";
import Agendamento from "../models/Agendamento";
import Emprestimo from "../models/Emprestimo";
import Livro from "../models/Livro";

class AgendamentoController {
  // Listar (com filtros/paginação simples)
  async index(req: Request, res: Response) {
    const { page = 1, limit = 20, status } = req.query;
    const where: any = {};
    if (status) where.status = status;

    const offset = (Number(page) - 1) * Number(limit);
    const { rows, count } = await Agendamento.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
    });
    return res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: Number(page), limit: Number(limit) },
    });
  }

  // Criar agendamento
  async create(req: Request, res: Response) {
    const {
      id_usuario,
      id_livro,
      data_agendada,
      local_retirada,
      quantidade = 1,
    } = req.body;
    const ag = await Agendamento.create({
      id_usuario,
      id_livro,
      data_agendada,
      local_retirada,
      quantidade,
    });
    return res
      .status(201)
      .json({ success: true, data: ag, message: "Agendamento criado" });
  }

  // Confirmar: criar empréstimo + decrementar qt_atual + excluir agendamento (tudo em transação)
  async confirm(req: Request, res: Response) {
    const { id } = req.params; // id do agendamento

    const t = await sequelize.transaction();
    try {
      // obter agendamento com lock
      const ag = await Agendamento.findByPk(Number(id), {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!ag) {
        await t.rollback();
        return res
          .status(404)
          .json({ success: false, message: "Agendamento não encontrado" });
      }

      if (ag.status !== "pendente") {
        await t.rollback();
        return res
          .status(400)
          .json({ success: false, message: "Agendamento não está pendente" });
      }

      // verificar disponibilidade do livro
      const livro = await Livro.findByPk(ag.id_livro, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!livro) {
        await t.rollback();
        return res
          .status(404)
          .json({ success: false, message: "Livro não encontrado" });
      }

      const quantidade = ag.quantidade || 1;
      if (livro.qt_atual < quantidade) {
        await t.rollback();
        return res
          .status(400)
          .json({
            success: false,
            message: "Não há cópias suficientes disponíveis",
          });
      }

      // criar empréstimo (ajuste datas conforme sua regra de negócio)
      const hoje = new Date();
      const prazo = new Date();
      prazo.setDate(hoje.getDate() + 7); // exemplo: 7 dias de prazo

      const emprestimo = await Emprestimo.create(
        {
          id_usuario: ag.id_usuario,
          id_livro: ag.id_livro,
          data_emprestimo: hoje,
          data_devolucao_prevista: prazo,
          status: "ativo",
        },
        { transaction: t }
      );

      // decrementar quantidade do livro
      livro.qt_atual = livro.qt_atual - quantidade;
      await livro.save({ transaction: t });

      // opcional: marcar agendamento como confirmado ou simplesmente removê-lo
      await Agendamento.destroy({
        where: { id_agendamento: ag.id_agendamento },
        transaction: t,
      });

      await t.commit();
      return res
        .status(201)
        .json({
          success: true,
          data: emprestimo,
          message: "Agendamento confirmado e empréstimo criado",
        });
    } catch (err) {
      await t.rollback();
      console.error(err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Erro ao confirmar agendamento",
          error: err.message,
        });
    }
  }

  // Recusar (marcar recusado ou deletar)
  async reject(req: Request, res: Response) {
    const { id } = req.params;
    const ag = await Agendamento.findByPk(Number(id));
    if (!ag)
      return res
        .status(404)
        .json({ success: false, message: "Agendamento não encontrado" });
    ag.status = "recusado";
    await ag.save();
    return res.json({ success: true, message: "Agendamento recusado" });
  }
}

export default new AgendamentoController();
```

> Observações:

- No exemplo eu removo o agendamento com `Agendamento.destroy(...)` após criar o empréstimo; alternativamente você pode apenas marcar `status = 'confirmado'` e manter o registro para histórico. Como pediu para excluir, o código remove.
- Uso `transaction` e `lock` para evitar race conditions quando múltiplos bibliotecários confirmem ao mesmo tempo.

---

## 4) Rotas (src/routes/agendamentoRoutes.ts)

```ts
import { Router } from "express";
import AgendamentoController from "../controller/AgendamentoController";

const router = Router();

router.get("/", AgendamentoController.index);
router.post("/", AgendamentoController.create);
router.put("/:id/confirm", AgendamentoController.confirm);
router.put("/:id/reject", AgendamentoController.reject);
router.delete("/:id", async (req, res) => {
  // opcional: permitir remoção direta
  const { id } = req.params;
  const { default: Agendamento } = await import("../models/Agendamento");
  await Agendamento.destroy({ where: { id_agendamento: Number(id) } });
  res.json({ success: true, message: "Agendamento removido" });
});

export default router;
```

E registre essa rota no `src/routes/index.ts`:

```ts
import agendamentoRoutes from "./agendamentoRoutes";
// ...
router.use("/agendamentos", agendamentoRoutes);
```

---

## 5) Exemplos de chamadas do frontend (usando `src/services/api.js`)

- Listar agendamentos pendentes:

```js
const res = await api.get("agendamentos?status=pendente&page=1&limit=20", {
  headers: { Authorization: `Bearer ${token}` },
});
// res.data -> array de agendamentos
```

- Confirmar agendamento (bibliotecário):

```js
await api.put(`agendamentos/${agendamentoId}/confirm`, null, {
  headers: { Authorization: `Bearer ${token}` },
});
```

- Criar agendamento (aluno):

```js
await api.post(
  "agendamentos",
  { id_usuario, id_livro, data_agendada, local_retirada, quantidade },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

---

## 6) Testes e validações

- Teste com Postman/Insomnia os endpoints:

  - POST /api/agendamentos
  - GET /api/agendamentos?status=pendente
  - PUT /api/agendamentos/:id/confirm

- Verifique logs e behavior de transação: tente confirmar duas vezes quase simultaneamente (ou escreva um teste) e confirme que não foi criado mais de um empréstimo e que `qt_atual` do livro não ficou negativa.

---

## 7) Próximos passos (opções que eu posso implementar)

- Criar os arquivos TypeScript automaticamente no repositório (`models/Agendamento.ts`, `controller/AgendamentoController.ts`, `routes/agendamentoRoutes.ts`) e registrar a rota.
- Implementar testes que simulam confirmação concorrente.

Diga qual opção prefere e eu implemento os arquivos ou apenas deixo esse guia para você implementar manualmente.
