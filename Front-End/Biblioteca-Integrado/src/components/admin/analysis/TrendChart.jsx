import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TrendChart = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Tendência Mensal</Text>
      {data.map((d, i) => (
        <View key={d.label + i} style={styles.row}>
          <Text style={styles.label}>{d.label}</Text>
          <View style={styles.barContainer}>
            <View
              style={[styles.bar, { width: `${(d.value / max) * 100}%` }]}
            />
          </View>
          <Text style={styles.value}>{d.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0b2a44",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  label: {
    color: "#cfe8ff",
    width: 48,
  },
  barContainer: {
    flex: 1,
    height: 12,
    backgroundColor: "#0f2130",
    borderRadius: 6,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    backgroundColor: "#16a34a",
  },
  value: {
    color: "#e6eef8",
    width: 36,
    textAlign: "right",
  },
});

export default TrendChart;
