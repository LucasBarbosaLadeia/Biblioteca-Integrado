import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const ReserveButton = ({
  onPress,
  title,
  disabled = false,
  isAvailable = false,
  buttonText = null,
  backgroundColor = null,
}) => {
  const buttonTitle =
    buttonText ||
    title ||
    (isAvailable ? "Reservar Livro (24h)" : "Entrar na Fila de Reserva");

  const buttonStyle = backgroundColor
    ? { backgroundColor }
    : !isAvailable
    ? styles.buttonQueue
    : {};

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {disabled ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{buttonTitle}</Text>
      )}
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
  buttonDisabled: {
    backgroundColor: "#6B7280",
    opacity: 0.6,
  },
  buttonQueue: {
    backgroundColor: "#F59E0B",
  },
  text: { color: "white", fontWeight: "700", fontSize: 16 },
});

export default ReserveButton;
