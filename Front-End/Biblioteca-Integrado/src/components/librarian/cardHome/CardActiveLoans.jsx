import React from "react";
import DashboardCard from "./DashboardCard";
import { Ionicons } from "@expo/vector-icons";

const CardActiveLoans = ({
  value = "1",
  subtitle = "Em circulação",
  onPress,
  size,
}) => {
  return (
    <DashboardCard
      title="Empréstimos Ativos"
      value={value}
      subtitle={subtitle}
      color="#07182b"
      accent="#07182b"
      onPress={onPress}
      icon={<Ionicons name="swap-vertical-outline" color="#06ff83ff" />}
      size={size}
    />
  );
};

export default CardActiveLoans;
