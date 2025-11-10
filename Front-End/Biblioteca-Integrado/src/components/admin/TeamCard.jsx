import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SmallCard = ({ title, value, iconName, color = "#60a5fa" }) => (
  <View style={styles.smallCard}>
    <View style={[styles.row, { alignItems: "center" }]}>
      <View style={[styles.bubble, { backgroundColor: color + "22" }]}>
        <MaterialCommunityIcons name={iconName} size={18} color={color} />
      </View>
      <Text style={styles.smallTitle}>{title}</Text>
    </View>

    <Text style={styles.smallValue}>{value}</Text>
  </View>
);

const TeamCard = ({ students = 0, librarians = 0 }) => {
  return (
    <View style={styles.container}>
      <SmallCard
        title="Alunos"
        value={students}
        iconName="account-group"
        color="#60a5fa"
      />
      <SmallCard
        title="Bibliotecários"
        value={librarians}
        iconName="account-tie"
        color="#f472b6"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  smallCard: {
    backgroundColor: "#071028",
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    minHeight: 88,
    justifyContent: "space-between",
  },
  smallTitle: {
    color: "#cbd5e1",
    fontSize: 13,
    marginLeft: 8,
  },
  smallValue: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 6,
  },
  bubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
});

export default TeamCard;
