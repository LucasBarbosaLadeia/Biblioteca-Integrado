import React from "react";
import { View, Text, StyleSheet } from "react-native";

const InsightCard = ({ color = "#4CAF50", title, subtitle, emoji = "ℹ️" }) => {
  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0b2a44",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 6,
    marginVertical: 6,
  },
  emoji: {
    fontSize: 22,
    marginRight: 10,
  },
  texts: {
    flex: 1,
  },
  title: {
    color: "#e6eef8",
    fontWeight: "700",
    fontSize: 14,
  },
  subtitle: {
    color: "#cfe8ff",
    marginTop: 2,
    fontSize: 12,
  },
});

export default InsightCard;
