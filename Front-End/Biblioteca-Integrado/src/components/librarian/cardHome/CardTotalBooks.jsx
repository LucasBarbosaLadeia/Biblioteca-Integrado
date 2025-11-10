import React from "react";
import DashboardCard from "./DashboardCard";
import { Ionicons } from "@expo/vector-icons";

const CardTotalBooks = ({
  value = "8",
  subtitle = "6 disponíveis",
  onPress,
  size,
}) => {
  return (
    <DashboardCard
      title="Total de Livros"
      value={value}
      subtitle={subtitle}
      color="#04163ae9"
      accent="#04163ae9"
      onPress={onPress}
      icon={<Ionicons name="book-outline" color="#60a5fa" />}
      size={size}
    />
  );
};

export default CardTotalBooks;
