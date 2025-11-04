import React from "react";
import DashboardCard from "./DashboardCard";
import { Ionicons } from "@expo/vector-icons";

const CardOverdue = ({
  value = "1",
  subtitle = "Necessitam atenção",
  onPress,
  size,
}) => {
  return (
    <DashboardCard
      title="Atrasados"
      value={value}
      subtitle={subtitle}
      color="#3b0f0f"
      accent="#3b0f0f"
      onPress={onPress}
      icon={<Ionicons name="time-outline" color="#ff2a00ff" />}
      size={size}
    />
  );
};

export default CardOverdue;
