import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const StyledAlert = ({
  visible,
  title,
  message,
  type = "info", // 'success', 'error', 'warning', 'info', 'confirm'
  buttons = [],
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancelar",
}) => {
  if (!visible) return null;

  // Se usar props antigas (onConfirm/onCancel), converter para formato de buttons
  const finalButtons =
    buttons.length > 0
      ? buttons
      : [
          ...(onCancel
            ? [{ text: cancelText, style: "cancel", onPress: onCancel }]
            : []),
          ...(onConfirm
            ? [{ text: confirmText, onPress: onConfirm }]
            : [{ text: "OK", onPress: onConfirm || (() => {}) }]),
        ];

  const getIcon = () => {
    switch (type) {
      case "success":
        return { name: "checkmark-circle", color: "#10B981" };
      case "error":
        return { name: "close-circle", color: "#EF4444" };
      case "warning":
        return { name: "warning", color: "#F59E0B" };
      case "confirm":
        return { name: "help-circle", color: "#3B82F6" };
      default:
        return { name: "information-circle", color: "#47b3ff" };
    }
  };

  const icon = getIcon();

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${icon.color}20` },
            ]}
          >
            <Ionicons name={icon.name} size={48} color={icon.color} />
          </View>

          {/* Title */}
          {title && <Text style={styles.title}>{title}</Text>}

          {/* Message */}
          {message && <Text style={styles.message}>{message}</Text>}

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {finalButtons.map((button, index) => {
              const isDestructive = button.style === "destructive";
              const isCancel = button.style === "cancel";
              const isPrimary = !isDestructive && !isCancel;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    isPrimary && styles.buttonPrimary,
                    isDestructive && styles.buttonDestructive,
                    isCancel && styles.buttonCancel,
                    finalButtons.length === 1 && styles.buttonFull,
                  ]}
                  onPress={button.onPress}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      isPrimary && styles.buttonTextPrimary,
                      isDestructive && styles.buttonTextDestructive,
                      isCancel && styles.buttonTextCancel,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  alertContainer: {
    width: width - 60,
    maxWidth: 400,
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f1f5f9",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: "#cbd5e1",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  buttonFull: {
    flex: 1,
  },
  buttonPrimary: {
    backgroundColor: "#47b3ff",
  },
  buttonDestructive: {
    backgroundColor: "#EF4444",
  },
  buttonCancel: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#475569",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextPrimary: {
    color: "#fff",
  },
  buttonTextDestructive: {
    color: "#fff",
  },
  buttonTextCancel: {
    color: "#cbd5e1",
  },
});

export default StyledAlert;
