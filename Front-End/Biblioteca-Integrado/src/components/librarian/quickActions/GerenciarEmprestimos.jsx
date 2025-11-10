import React from "react";
import { Ionicons } from "@expo/vector-icons";
import QuickAction from "./QuickAction";

const GerenciarEmprestimos = ({ title, subtitle, onPress, color }) => {
  return (
    <QuickAction
      title={title || "Gerenciar Empréstimos"}
      subtitle={subtitle || "Ver todos empréstimos"}
      onPress={onPress}
      color={color || "#3b1850"}
      icon={
        <Ionicons
          name="list-outline"
          size={25}
          color="rgba(255,255,255,0.95)"
        />
      }
    />
  );
};

export default GerenciarEmprestimos;
