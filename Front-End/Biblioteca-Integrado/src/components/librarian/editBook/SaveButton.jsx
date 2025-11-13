import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const SaveButton = ({ onPress, loading }) => {
  return (
    <TouchableOpacity
      style={[styles.btn, loading ? styles.btnDisabled : null]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.text}>
        {loading ? "Salvando..." : "Salvar Alterações"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginTop: 18,
    backgroundColor: "#1b3a75",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.6 },
  text: { color: "#fff", fontWeight: "700" },
});

export default SaveButton;
