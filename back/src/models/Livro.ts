import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export interface ILivro {
  id_livro?: number;
  titulo: string;
  autor: string;
  id_categoria: number;
  ano_publicacao?: number;
  capa_url?: string;
  sinopse?: string;
  prateleira?: string;
  isbn?: string;
  qt_atual: number;
  qt_total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Livro extends Model<ILivro> implements ILivro {
  public id_livro!: number;
  public titulo!: string;
  public autor!: string;
  public id_categoria!: number;
  public ano_publicacao?: number;
  public capa_url?: string;
  public sinopse?: string;
  public prateleira?: string;
  public isbn?: string;
  public qt_atual!: number;
  public qt_total!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Livro.init(
  {
    id_livro: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_livro",
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "titulo",
    },
    autor: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "autor",
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_categoria",
      references: {
        model: "categorias",
        key: "id_categoria",
      },
    },
    ano_publicacao: {
      type: DataTypes.INTEGER,
      field: "ano_publicacao",
      validate: {
        min: 1000,
        max: new Date().getFullYear(),
      },
    },
    capa_url: {
      type: DataTypes.TEXT,
      field: "capa_url",
    },
    sinopse: {
      type: DataTypes.TEXT,
      field: "sinopse",
    },
    prateleira: {
      type: DataTypes.STRING(50),
      field: "prateleira",
    },
    isbn: {
      type: DataTypes.STRING(20),
      unique: true,
      field: "isbn",
    },
    qt_atual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "qt_atual",
      validate: {
        min: 0,
      },
    },
    qt_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "qt_total",
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: "livros",
    timestamps: true,
    underscored: true,
  }
);

export default Livro;
