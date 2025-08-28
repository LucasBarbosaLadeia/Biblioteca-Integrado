import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/database";

export interface IUsuario {
  id_usuario?: number;
  nome: string;
  email: string;
  senha: string;
  RA: string;
  tipo: "aluno" | "funcionario";
  createdAt?: Date;
  updatedAt?: Date;
}

class Usuario extends Model<IUsuario> implements IUsuario {
  public id_usuario!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
  public RA!: string;
  public tipo!: "aluno" | "funcionario";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Usuario.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "id_usuario",
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "nome",
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "email",
      validate: {
        isEmail: true,
      },
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "senha",
    },
    RA: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: "RA",
    },
    tipo: {
      type: DataTypes.ENUM("aluno", "funcionario"),
      allowNull: false,
      field: "tipo",
    },
  },
  {
    sequelize,
    tableName: "usuarios",
    timestamps: true,
    underscored: true,
  }
);

export default Usuario;
