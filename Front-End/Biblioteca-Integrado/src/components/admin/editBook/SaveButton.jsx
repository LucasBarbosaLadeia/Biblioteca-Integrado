import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const SaveButton = ({ onPress, loading = false }) => (
  <TouchableOpacity
    style={styles.btn}
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.8}
  >
    <Text style={styles.txt}>
      {loading ? "Salvando..." : "Salvar Alterações"}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  txt: { color: "#fff", fontWeight: "700" },
});

export default SaveButton;
