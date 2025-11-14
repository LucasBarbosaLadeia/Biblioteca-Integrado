import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export interface IReserva {
  id_reserva?: number;
  id_usuario: number;
  id_livro: number;
  data_reserva: Date;
  data_expiracao?: Date;
  status?: "ativa" | "cancelada" | "expirada" | "concretizada";
  createdAt?: Date;
  updatedAt?: Date;
}

class Reserva extends Model<IReserva> implements IReserva {
  public id_reserva!: number;
  public id_usuario!: number;
  public id_livro!: number;
  public data_reserva!: Date;
  public data_expiracao?: Date;
  public status?: "ativa" | "cancelada" | "expirada" | "concretizada";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reserva.init(
  {
    id_reserva: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_reserva",
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
    data_reserva: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "data_reserva",
      defaultValue: DataTypes.NOW,
    },
    data_expiracao: {
      type: DataTypes.DATE,
      field: "data_expiracao",
    },
    status: {
      type: DataTypes.ENUM("ativa", "cancelada", "expirada", "concretizada"),
      defaultValue: "ativa",
      field: "status",
    },
  },
  {
    sequelize,
    tableName: "reservas",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["id_usuario", "id_livro"],
      },
    ],
  }
);

export default Reserva;
