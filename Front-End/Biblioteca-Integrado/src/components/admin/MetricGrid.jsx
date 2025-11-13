import React from "react";
import { View, StyleSheet } from "react-native";
import MetricCard from "./MetricCard";

const MetricGrid = ({ metrics = [] }) => {
  return (
    <View style={styles.container}>
      {metrics.map((m, idx) => (
        <View key={idx} style={styles.cardWrapper}>
          <MetricCard
            icon={m.icon}
            value={m.value}
            title={m.title}
            subtitle={m.subtitle}
            color={m.color}
            backgroundColor={m.backgroundColor}
            borderColor={m.borderColor}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  cardWrapper: {
    width: "50%",
    padding: 5,
    marginBottom: 5,
  },
});

export default MetricGrid;
