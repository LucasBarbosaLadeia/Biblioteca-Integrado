import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DetailRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value || "ÔÇö"}</Text>
  </View>
);

const DetailsCard = ({ editora, isbn, localizacao }) => {
  return (
    <View style={styles.card}>
      <DetailRow label="Editora" value={editora} />
      <DetailRow label="ISBN" value={isbn} />
      <DetailRow label="Localiza├º├úo" value={localizacao} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  row: { marginBottom: 10 },
  rowLabel: { color: "#9aa0aa", fontSize: 12 },
  rowValue: { color: "#fff", fontSize: 14, marginTop: 4 },
});

export default DetailsCard;
