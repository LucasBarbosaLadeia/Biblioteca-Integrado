import React from "react";
import DashboardCard from "./DashboardCard";
import { Ionicons } from "@expo/vector-icons";

const CardRequests = ({
  value = "2",
  subtitle = "Aguardando retirada",
  onPress,
  size,
}) => {
  return (
    <DashboardCard
      title="Solicitações"
      value={value}
      subtitle={subtitle}
      color="#322813"
      accent="#322813"
      onPress={onPress}
      icon={<Ionicons name="notifications-outline" color="#f6ff00ff" />}
      size={size}
    />
  );
};

export default CardRequests;
