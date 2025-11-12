import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LoanCard({ loan = {}, onMarkReturned, onMarkLate }) {
  const {
    student = "Aluno Desconhecido",
    book = "Livro Desconhecido",
    loanDate,
    returnDate,
    status = "Desconhecido",
  } = loan;

  const statusColors =
    status === "Ativo"
      ? ["#0855fcff", "#344785ff"]
      : status === "Devolvido"
      ? ["#3bff0fff", "#3f5137ff"]
      : ["#EF4444", "#B91C1C"];

  return (
    <LinearGradient colors={["#0B1220", "#0F1724"]} style={styles.card}>
      <LinearGradient
        colors={["rgba(255,255,255,0.03)", "transparent"]}
        style={styles.topHighlight}
        pointerEvents="none"
      />
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name}>{student}</Text>
          <Text style={styles.book}>{book}</Text>
        </View>

        <LinearGradient colors={statusColors} style={styles.statusPill}>
          <Text style={styles.badgeText}>{status}</Text>
        </LinearGradient>
      </View>

      <View style={styles.rowSmall}>
        <Text style={styles.small}>
          Empréstimo: {loanDate || "Invalid Date"}
        </Text>
        <Text style={styles.small}>
          Devolução: {returnDate || "Invalid Date"}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onMarkReturned && onMarkReturned(loan)}
          style={{ flex: 1 }}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={[styles.btn, styles.returnBtn]}
          >
            <Ionicons
              name="checkmark-done"
              size={16}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.btnText}>Devolvido</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onMarkLate && onMarkLate(loan)}
          style={{ flex: 1 }}
        >
          <LinearGradient
            colors={["#EF4444", "#B91C1C"]}
            style={[styles.btn, styles.lateBtn]}
          >
            <Ionicons
              name="alert-circle"
              size={16}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.btnText}>Atrasado</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 17, // increased by 5px to make the card a bit larger downward
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.19)",
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { color: "#F8FAFC", fontWeight: "700", fontSize: 16 },
  book: { color: "#C7D2FE", marginTop: 2, fontSize: 13 },
  rowSmall: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  small: { color: "#9CA3AF", fontSize: 12 },
  statusPill: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 84,
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  actions: { flexDirection: "row", marginTop: 19 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 6,
    minHeight: 40,
  },
  returnBtn: {},
  lateBtn: {},
  btnText: { color: "#fff", fontWeight: "700" },
  topHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
});
