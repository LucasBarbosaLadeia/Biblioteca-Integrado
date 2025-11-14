import Reserva from "../models/Reserva";
import Livro from "../models/Livro";
import sequelize from "../config/database";
import { Op } from "sequelize";

/**
 * Expira reservas cuja `data_expiracao` já passou.
 * Para cada reserva expirada: marca `status = 'expirada'` e repõe `Livro.qt_atual`.
 */
export async function expireReservations(): Promise<{ expired: number }> {
  const now = new Date();
  console.log("expireReservations: now=", now.toISOString());

  // buscar reservas ativas expiradas (usar Op.lt para compatibilidade)
  const expiredList = await Reserva.findAll({
    where: {
      status: "ativa",
      data_expiracao: { [Op.lt]: now },
    },
  });
  console.log(`expireReservations: found ${expiredList.length} candidate(s)`);

  let count = 0;

  for (const reserva of expiredList) {
    try {
      await sequelize.transaction(async (t) => {
        // lock livro row
        const livro = await Livro.findByPk(reserva.id_livro, {
          transaction: t,
          lock: t.LOCK.UPDATE as any,
        });
        if (!livro) {
          // marcar reserva como expirada mesmo se livro não existir
          await reserva.update({ status: "expirada" }, { transaction: t });
          return;
        }

        await reserva.update({ status: "expirada" }, { transaction: t });
        await livro.update(
          { qt_atual: livro.qt_atual + 1 },
          { transaction: t }
        );
        count += 1;
      });
    } catch (err) {
      console.error("Erro ao expirar reserva id=", reserva.id_reserva, err);
    }
  }

  return { expired: count };
}

// Permitir execução direta via ts-node-dev (útil para testes)
if (require.main === module) {
  (async () => {
    try {
      const res = await expireReservations();
      console.log(`Reservas expiradas: ${res.expired}`);
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}
