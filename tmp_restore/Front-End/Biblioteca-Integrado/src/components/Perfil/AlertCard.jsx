import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AlertCard = ({ message }) => {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons
          name="time-outline"
          size={20}
          color="#E06666"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.title}>Aten├º├úo!</Text>
      </View>

      <Text style={styles.body}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#340E1E", // vermelho escuro transparente
    borderWidth: 1,
    borderColor: "rgba(255, 80, 80, 0.25)", // borda suave
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: "#E06666",
    fontWeight: "700",
    fontSize: 15,
  },
  body: {
    color: "#DCD7D7",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AlertCard;
