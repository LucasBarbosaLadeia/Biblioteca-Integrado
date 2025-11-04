import React from "react";
import { Ionicons } from "@expo/vector-icons";
import QuickAction from "./QuickAction";

const SolicitacoesPendentes = ({ title, subtitle, onPress, color }) => {
  return (
    <QuickAction
      title={title || "Solicitações Pendentes"}
      subtitle={subtitle || "Aguardando aprovação"}
      onPress={onPress}
      color={color || "#111827"}
      icon={
        <Ionicons
          name="notifications-outline"
          size={25}
          color="rgba(255,255,255,0.95)"
        />
      }
    />
  );
};

export default SolicitacoesPendentes;
