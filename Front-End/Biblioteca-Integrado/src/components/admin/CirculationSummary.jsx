import React from "react";
import { View, Text, StyleSheet } from "react-native";

const StatCard = ({ label, value, accent = "#60a5fa" }) => (
  <View style={[styles.card, { borderColor: accent + "22" }]}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const CirculationSummary = ({
  circulationRate = 5.3,
  returnRate = 84,
  inCirculation = 19,
  available = 18,
}) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>Métricas de Circulação</Text>

      <View style={styles.row}>
        <StatCard
          label="Taxa de Circulação"
          value={`${circulationRate}%`}
          accent="#60a5fa"
        />
        <StatCard
          label="Taxa de Devolução"
          value={`${returnRate}%`}
          accent="#10b981"
        />
      </View>

      <View style={styles.row}>
        <StatCard
          label="Livros em Circulação"
          value={`${inCirculation}`}
          accent="#8b5cf6"
        />
        <StatCard
          label="Livros Disponíveis"
          value={`${available}`}
          accent="#94a3b8"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },
  header: {
    color: "#cfe8ff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    backgroundColor: "#071028",
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardLabel: {
    color: "#9fb0c8",
    fontSize: 12,
    marginBottom: 6,
  },
  cardValue: {
    color: "#e6eef8",
    fontSize: 18,
    fontWeight: "800",
  },
});

export default CirculationSummary;
