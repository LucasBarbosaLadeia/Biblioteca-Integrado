import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InfoButtons = ({ loans, favorites, returned }) => {
  const items = [
    {
      label: "Empréstimos",
      value: loans,
      icon: "book-outline",
      color: "#2C6EF2",
    },
    {
      label: "Favoritos",
      value: favorites,
      icon: "heart-outline",
      color: "#9B2C2C",
    },
    {
      label: "Devolvidos",
      value: returned,
      icon: "checkmark-circle-outline",
      color: "#10B981",
    },
  ];

  return (
    <View style={styles.row}>
      {items.map(({ label, value, icon, color }) => (
        <View key={label} style={styles.card}>
          <View style={styles.iconArea}>
            <View style={[styles.iconBox, { backgroundColor: color }]}>
              <Ionicons name={icon} size={18} color="#fff" />
            </View>
          </View>
          <Text style={styles.number}>{String(value ?? 0)}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginVertical: 8,
  },
  card: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: "#0b1221",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    minHeight: 110,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
  iconArea: {
    width: "100%",
    alignItems: "center",
    marginBottom: 6,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    color: "#E6EEF8",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 6,
  },
  label: {
    color: "#9fb0d8",
    fontSize: 12,
    marginTop: 6,
  },
});

export default InfoButtons;
