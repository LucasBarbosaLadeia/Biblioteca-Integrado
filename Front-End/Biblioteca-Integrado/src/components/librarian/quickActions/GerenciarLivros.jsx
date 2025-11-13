import React from "react";
import { Ionicons } from "@expo/vector-icons";
import QuickAction from "./QuickAction";

const GerenciarLivros = ({ title, subtitle, onPress, color }) => {
  return (
    <QuickAction
      title={title || "Gerenciar Livros"}
      subtitle={subtitle || "Ver e editar livros"}
      onPress={onPress}
      color={color || "#16213b"}
      icon={
        <Ionicons
          name="book-outline"
          size={25}
          color="rgba(255,255,255,0.95)"
        />
      }
    />
  );
};

export default GerenciarLivros;
