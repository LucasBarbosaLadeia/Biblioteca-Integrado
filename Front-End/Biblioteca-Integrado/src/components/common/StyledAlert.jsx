import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";

const StyledAlert = ({
  visible,
  title,
  message,
  type = "info",
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancelar",
}) => {
  if (!visible) return null;

  const bg =
    type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#2563eb";

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.wrap}>
        <View style={styles.box}>
          <View style={[styles.header, { backgroundColor: bg }]}>
            <Text style={styles.headerText}>{title}</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.msg}>{message}</Text>
          </View>

          <View style={styles.actions}>
            {onCancel ? (
              <TouchableOpacity
                style={[styles.btn, styles.btnCancel]}
                onPress={onCancel}
              >
                <Text style={styles.btnText}>{cancelText}</Text>
              </TouchableOpacity>
            ) : null}

            {onConfirm ? (
              <TouchableOpacity
                style={[styles.btn, styles.btnConfirm]}
                onPress={onConfirm}
              >
                <Text style={styles.btnText}>{confirmText}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  box: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#071028",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  header: { padding: 14 },
  headerText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    textAlign: "center",
  },
  body: { padding: 16 },
  msg: { color: "#cfe8ff", fontSize: 14, textAlign: "center" },
  actions: { flexDirection: "row", justifyContent: "flex-end", padding: 12 },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  btnConfirm: { backgroundColor: "#2563eb" },
  btnCancel: {
    backgroundColor: "#0b1220",
    borderWidth: 1,
    borderColor: "#274060",
  },
  btnText: { color: "#fff", fontWeight: "700" },
});

export default StyledAlert;
