import React from "react";
import { Ionicons } from "@expo/vector-icons";
import QuickAction from "./QuickAction";

const EmprestimoManual = ({ title, subtitle, onPress, color }) => {
  return (
    <QuickAction
      title={title || "Empréstimo Manual"}
      subtitle={subtitle || "Registrar sem solicitação"}
      onPress={onPress}
      color={color || "#0f3b2d"}
      icon={
        <Ionicons
          name="swap-vertical-outline"
          size={25}
          color="rgba(255,255,255,0.95)"
        />
      }
    />
  );
};

export default EmprestimoManual;
