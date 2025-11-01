import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TinyCard = ({ label, value }) => (
  <View style={styles.card}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const InfoRowCards = ({ pages, year }) => {
  return (
    <View style={styles.row}>
      <TinyCard label="P├íginas" value={pages || "ÔÇö"} />
      <TinyCard label="Ano" value={year || "ÔÇö"} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 6,
    alignItems: "center",
  },
  value: { color: "#fff", fontWeight: "700", fontSize: 16 },
  label: { color: "#cfcfcf", fontSize: 12, marginTop: 6 },
});

export default InfoRowCards;
