import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export interface IFavorito {
  id_favorito?: number;
  id_usuario: number;
  id_livro: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Favorito extends Model<IFavorito> implements IFavorito {
  public id_favorito!: number;
  public id_usuario!: number;
  public id_livro!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Favorito.init(
  {
    id_favorito: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_favorito",
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
  },
  {
    sequelize,
    tableName: "favoritos",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["id_usuario", "id_livro"],
      },
    ],
  }
);

export default Favorito;
