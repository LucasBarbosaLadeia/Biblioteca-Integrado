import React from "react";
import { View, Text, StyleSheet } from "react-native";

const formatDate = (iso) => {
  if (!iso) return "ÔÇö";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const badgeColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "ativo":
      return "#2563EB";
    case "devolvido":
      return "#16A34A";
    case "atrasado":
      return "#DC2626";
    default:
      return "#6B7280";
  }
};

const LoanCard = ({ item }) => {
  const color = badgeColor(item.status);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>
            Empr├®stimo: {formatDate(item.loanDate)}
          </Text>
          <Text style={styles.meta}>
            Devolu├º├úo: {formatDate(item.returnDate)}
          </Text>
          {item.returnedAt && (
            <Text style={styles.meta}>
              Devolvido em: {formatDate(item.returnedAt)}
            </Text>
          )}
        </View>
        <View style={styles.badgeWrap}>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "rgba(0, 30, 78, 1)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  info: { flex: 1, paddingRight: 8 },
  title: { color: "white", fontWeight: "700" },
  meta: { color: "#c6d1e6", fontSize: 13, marginTop: 6 },
  badgeWrap: { justifyContent: "center", alignItems: "flex-end" },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeText: { color: "white", fontWeight: "700" },
});

export default LoanCard;
