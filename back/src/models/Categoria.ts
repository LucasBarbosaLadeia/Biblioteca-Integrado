import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export interface ICategoria {
  id_categoria?: number;
  nome: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Categoria extends Model<ICategoria> implements ICategoria {
  public id_categoria!: number;
  public nome!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Categoria.init(
  {
    id_categoria: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_categoria",
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "nome",
    },
  },
  {
    sequelize,
    tableName: "categorias",
    timestamps: true,
    underscored: true,
  }
);

export default Categoria;
