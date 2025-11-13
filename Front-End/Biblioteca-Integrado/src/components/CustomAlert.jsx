import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomAlert = ({
  visible,
  title,
  message,
  onClose,
  buttonText = "OK",
  type = "info", // 'success' | 'error' | 'info'
}) => {
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start();
    } else {
      scale.setValue(0.8);
    }
  }, [visible]);

  const colors = {
    success: "#10B981",
    error: "#EF4444",
    info: "#0A1931",
  };
  const accent = colors[type] || colors.info;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.content,
            { borderColor: accent, transform: [{ scale }] },
          ]}
        >
          {/* Icon */}
          {type === "success" && (
            <Ionicons
              name="checkmark-circle"
              size={48}
              color={accent}
              style={{ marginBottom: 8 }}
            />
          )}
          {title ? (
            <Text style={[styles.title, { color: accent }]}>{title}</Text>
          ) : null}
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: accent }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 260,
    maxWidth: 340,
    borderWidth: 2,
    borderColor: "#0A1931",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0A1931",
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 17,
    color: "#222",
    marginBottom: 22,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#0A1931",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5,
  },
});

export default CustomAlert;
