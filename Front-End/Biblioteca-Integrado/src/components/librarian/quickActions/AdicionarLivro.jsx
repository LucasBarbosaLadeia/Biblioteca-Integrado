import React from "react";
import { Ionicons } from "@expo/vector-icons";
import QuickAction from "./QuickAction";

const AdicionarLivro = ({ title, subtitle, onPress, color }) => {
  return (
    <QuickAction
      title={title || "Adicionar Livro"}
      subtitle={subtitle || "Cadastrar novo livro"}
      onPress={onPress}
      color={color || "#1f2b52"}
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

export default AdicionarLivro;
