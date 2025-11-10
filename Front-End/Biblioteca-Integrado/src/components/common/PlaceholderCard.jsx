import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PlaceholderCard = ({
  title = "Sem dados disponíveis",
  subtitle = "",
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#071028",
    borderWidth: 1,
    borderColor: "#0b3450",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  title: { color: "#e6eef8", fontWeight: "700", marginBottom: 4 },
  subtitle: { color: "#9fb0c8", fontSize: 12 },
});

export default PlaceholderCard;
