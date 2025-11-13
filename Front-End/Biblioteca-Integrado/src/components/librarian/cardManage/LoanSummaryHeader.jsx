import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function LoanSummaryHeader({ counts = {} }) {
  const { todos = 0, ativos = 0, atrasados = 0, devolvidos = 0 } = counts;
  const Item = ({ label, value, colors }) => (
    <LinearGradient
      colors={colors}
      style={styles.itemGradient}
      start={[0, 0]}
      end={[1, 1]}
    >
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <Item label="Todos" value={todos} colors={["#0B1220", "#0F1724"]} />
      <Item label="Ativos" value={ativos} colors={["#1E3A8A", "#2563EB"]} />
      <Item
        label="Atrasados"
        value={atrasados}
        colors={["#7F1D1D", "#B91C1C"]}
      />
      <Item
        label="Devolvidos"
        value={devolvidos}
        colors={["#374151", "#6B7280"]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    marginHorizontal: 12,
  },
  itemGradient: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  value: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  label: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: 6,
  },
});
