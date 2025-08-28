import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export interface IEmprestimo {
  id_emprestimo?: number;
  id_usuario: number;
  id_livro: number;
  data_emprestimo: Date;
  data_devolucao_prevista: Date;
  data_devolucao_real?: Date;
  status?: "ativo" | "devolvido" | "atrasado";
  createdAt?: Date;
  updatedAt?: Date;
}

class Emprestimo extends Model<IEmprestimo> implements IEmprestimo {
  public id_emprestimo!: number;
  public id_usuario!: number;
  public id_livro!: number;
  public data_emprestimo!: Date;
  public data_devolucao_prevista!: Date;
  public data_devolucao_real?: Date;
  public status?: "ativo" | "devolvido" | "atrasado";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Emprestimo.init(
  {
    id_emprestimo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_emprestimo",
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario",
      references: {
        model: "usuarios",
        key: "id_usuario",
      },
    },
    id_livro: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_livro",
      references: {
        model: "livros",
        key: "id_livro",
      },
    },
    data_emprestimo: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "data_emprestimo",
      defaultValue: DataTypes.NOW,
    },
    data_devolucao_prevista: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "data_devolucao_prevista",
    },
    data_devolucao_real: {
      type: DataTypes.DATEONLY,
      field: "data_devolucao_real",
    },
    status: {
      type: DataTypes.ENUM("ativo", "devolvido", "atrasado"),
      defaultValue: "ativo",
      field: "status",
    },
  },
  {
    sequelize,
    tableName: "emprestimos",
    timestamps: true,
    underscored: true,
  }
);

export default Emprestimo;
