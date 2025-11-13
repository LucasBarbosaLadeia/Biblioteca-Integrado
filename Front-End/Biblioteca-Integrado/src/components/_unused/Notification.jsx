import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Notification = ({ livro }) => {
  return (
    <View style={styles.notificationContainer}>
      <Text style={styles.notificationText}>
        <Text style={{ textDecorationLine: "accent" }}>
          O livro <Text style={{ fontWeight: "bold" }}>{livro}</Text> está
          disponível
        </Text>
        {"\n"}
        <Text style={{ textDecorationLine: "accent" }}>
          na Biblioteca da Universidade
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: "#ffffff2c", // Azul escuro
    padding: 16,
    borderRadius: 12,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  notificationText: {
    color: "white",
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    fontFamily: "Georgia", // funciona se a fonte estiver disponível
  },
});

export default Notification;
