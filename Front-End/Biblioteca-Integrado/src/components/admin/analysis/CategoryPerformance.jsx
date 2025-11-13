import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CategoryPerformance = ({ categories = [] }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Performance por Categoria</Text>
      {categories.map((c, idx) => {
        const utilization =
          c.total > 0 ? Math.round((c.lent / c.total) * 100) : 0;
        return (
          <View key={c.name + idx} style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.catName}>{c.name}</Text>
              <Text
                style={styles.small}
              >{`Empr.: ${c.lent} • Disp.: ${c.available}`}</Text>
            </View>
            <View style={styles.progressBg}>
              <View
                style={[styles.progressFill, { width: `${utilization}%` }]}
              />
            </View>
            <Text
              style={styles.utilText}
            >{`Taxa de utilização: ${utilization}%`}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#0b2a44",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  catName: {
    color: "#fff",
    fontWeight: "700",
  },
  small: {
    color: "#cfe8ff",
    fontSize: 12,
  },
  progressBg: {
    height: 10,
    backgroundColor: "#0f2130",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7c3aed",
  },
  utilText: {
    color: "#cfe8ff",
    fontSize: 12,
    marginTop: 6,
  },
});

export default CategoryPerformance;
