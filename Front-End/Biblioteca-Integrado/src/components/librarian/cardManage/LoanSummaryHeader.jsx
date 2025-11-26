import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LoanSummaryHeader({ counts = {} }) {
  const { todos = 0, ativos = 0, atrasados = 0, devolvidos = 0 } = counts;

  const Item = ({ label, value, colors, icon }) => (
    <View style={styles.itemWrapper}>
      <LinearGradient
        colors={colors}
        style={styles.itemGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#fff" />
        </View>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <Item
        label="Total"
        value={todos}
        colors={["#475569", "#334155"]}
        icon="albums-outline"
      />
      <Item
        label="Ativos"
        value={ativos}
        colors={["#3B82F6", "#2563EB"]}
        icon="time-outline"
      />
      <Item
        label="Atrasados"
        value={atrasados}
        colors={["#EF4444", "#DC2626"]}
        icon="alert-circle-outline"
      />
      <Item
        label="Devolvidos"
        value={devolvidos}
        colors={["#10B981", "#059669"]}
        icon="checkmark-circle-outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  itemWrapper: {
    flex: 1,
  },
  itemGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  label: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
