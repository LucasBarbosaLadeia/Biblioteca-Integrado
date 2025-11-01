import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const ReserveButton = ({ onPress, title = "Reservar Livro" }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },
  text: { color: "white", fontWeight: "700", fontSize: 16 },
});

export default ReserveButton;
