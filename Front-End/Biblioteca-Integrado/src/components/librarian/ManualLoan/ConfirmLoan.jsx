import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  card: "#0b1320",
  input: "#0f1a2b",
  accent: "#2f8cff",
  muted: "#9aa0b6",
};

const ConfirmLoan = ({ book, student, onBack, onConfirm, loading = false }) => {
  const [dueDate, setDueDate] = useState("26/11/2025");
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const toDate = (str) => {
    const parts = String(str).split("/");
    if (parts.length !== 3) return new Date();
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  };

  const formatDate = (d) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatTitle = (b) => b?.titulo || b?.title || "—";
  const formatAuthor = (b) => b?.autor || b?.author || "";
  const formatName = (s) => s?.nome || s?.name || "—";
  const formatRA = (s) => s?.RA || s?.ra || s?.registration || "";

  return (
    <View style={styles.wrapper}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Livro</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{formatTitle(book)}</Text>
          <Text style={styles.cardSub}>{formatAuthor(book)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aluno</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{formatName(student)}</Text>
          <Text style={styles.cardSub}>
            {student ? `RA: ${formatRA(student)}` : ""}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data de Devolução</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setDateModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dateText}>{dueDate}</Text>
        </TouchableOpacity>

        <Modal
          visible={dateModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDateModalVisible(false)}
        >
          <View style={modalStyles.overlay}>
            <View style={modalStyles.box}>
              <Text style={modalStyles.title}>Escolha a data</Text>
              <View style={modalStyles.inlineRow}>
                <TouchableOpacity
                  style={modalStyles.iconBtn}
                  onPress={() => {
                    const d = toDate(dueDate);
                    d.setDate(d.getDate() - 1);
                    setDueDate(formatDate(d));
                  }}
                >
                  <Text style={modalStyles.iconText}>−</Text>
                </TouchableOpacity>

                <View style={modalStyles.dateDisplay}>
                  <Text style={modalStyles.dateDisplayText}>{dueDate}</Text>
                </View>

                <TouchableOpacity
                  style={modalStyles.iconBtn}
                  onPress={() => {
                    const d = toDate(dueDate);
                    d.setDate(d.getDate() + 1);
                    setDueDate(formatDate(d));
                  }}
                >
                  <Text style={modalStyles.iconText}>+</Text>
                </TouchableOpacity>
              </View>

              <View style={modalStyles.actions}>
                <TouchableOpacity
                  style={[
                    modalStyles.actionBtn,
                    { backgroundColor: "#6B7280" },
                  ]}
                  onPress={() => setDateModalVisible(false)}
                >
                  <Text style={modalStyles.actionText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    modalStyles.actionBtn,
                    { backgroundColor: "#2f8cff" },
                  ]}
                  onPress={() => setDateModalVisible(false)}
                >
                  <Text style={modalStyles.actionText}>Selecionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <TouchableOpacity
        style={[styles.confirmWrap, loading && styles.confirmBtnDisabled]}
        onPress={() => onConfirm && onConfirm({ book, student, dueDate })}
        disabled={loading}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={loading ? ["#94a3b8", "#6b7280"] : ["#4f8cff", "#2f6fff"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.confirmBtn}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="checkmark"
                size={18}
                color="#fff"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.confirmText}>Confirmar Empréstimo</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backLink} onPress={onBack}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 16, flex: 1 },
  section: { marginBottom: 16 },
  sectionTitle: { color: "#b7c0cf", marginBottom: 8 },
  card: {
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: { color: "#fff", fontWeight: "600" },
  cardSub: { color: "#90a0b3", fontSize: 12, marginTop: 4 },
  dateInput: {
    backgroundColor: COLORS.input,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1f2a3b",
  },
  dateText: { color: "#fff" },
  confirmBtn: {
    marginTop: 20,
    backgroundColor: COLORS.accent,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmText: { color: "#fff", fontWeight: "700" },
  backLink: { marginTop: 14, alignItems: "center" },
  backText: { color: "#9fb6ff" },
  confirmBtnDisabled: { opacity: 0.7 },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "92%",
    maxWidth: 420,
    backgroundColor: "#071028",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#0b1220",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: { color: "#fff", fontSize: 22, fontWeight: "700" },
  dateDisplay: { flex: 1, alignItems: "center" },
  dateDisplayText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  actionText: { color: "#fff", fontWeight: "700" },
});

export default ConfirmLoan;
