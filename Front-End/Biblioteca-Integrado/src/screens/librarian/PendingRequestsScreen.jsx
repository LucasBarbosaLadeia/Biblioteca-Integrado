import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PendingRequestsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Tela de Solicitações Pendentes (em desenvolvimento)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 16, color: "#333" },
});
