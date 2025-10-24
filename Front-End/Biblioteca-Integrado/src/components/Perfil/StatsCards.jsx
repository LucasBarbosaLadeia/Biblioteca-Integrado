import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const StatsCards = ({ loans = 0, favorites = 0, returned = 0 }) => {
  const navigation = useNavigation();

  const items = [
    {
      label: "Empréstimos",
      value: loans,
      icon: "book-outline",
      color: "#2C6EF2",
      clickable: false,
    },
    {
      label: "Favoritos",
      value: favorites,
      icon: "heart-outline",
      color: "#9B2C2C",
      clickable: true,
    },
    {
      label: "Devolvidos",
      value: returned,
      icon: "checkmark-circle-outline",
      color: "#10B981",
      clickable: false,
    },
  ];

  const handlePress = (label) => {
    if (label === "Favoritos") {
      navigation.navigate("Favoritos"); // Altere para o nome correto da sua tela
    }
  };

  return (
    <View style={styles.container}>
      {items.map(({ label, value, icon, color, clickable }) => {
        const CardContent = (
          <>
            <View style={styles.iconWrap}>
              <View style={[styles.iconBox, { backgroundColor: color }]}>
                <Ionicons name={icon} size={18} color="#fff" />
              </View>
            </View>
            <Text style={styles.number}>{String(value ?? 0)}</Text>
            <Text style={styles.label}>{label}</Text>
          </>
        );

        return clickable ? (
          <TouchableOpacity
            key={label}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => handlePress(label)}
          >
            {CardContent}
          </TouchableOpacity>
        ) : (
          <View key={label} style={styles.card}>
            {CardContent}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginVertical: 8,
  },
  card: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: "#111A2E", // 🔹 cor mais clara que o #0B1221
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    minHeight: 110,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  iconWrap: {
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
    elevation: 2,
  },
  number: {
    color: "#E6EEF8",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 6,
  },
  label: {
    color: "#9FB0D8",
    fontSize: 12,
    marginTop: 6,
  },
});

export default StatsCards;
