import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ActivityItem = ({ value, label, iconName, color = "#60a5fa" }) => (
  <View style={styles.item}>
    <View style={[styles.iconBubble, { backgroundColor: color + "22" }]}>
      <MaterialCommunityIcons name={iconName} size={20} color={color} />
    </View>

    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const MonthlyActivity = ({ loans = 0, returns = 0, newUsers = 0 }) => {
  return (
    <View style={styles.container}>
      <ActivityItem
        value={loans}
        label="Novos Empréstimos"
        iconName="book-plus"
        color="#60a5fa"
      />
      <ActivityItem
        value={returns}
        label="Devoluções"
        iconName="restore"
        color="#34d399"
      />
      <ActivityItem
        value={newUsers}
        label="Novos Usuários"
        iconName="account-plus"
        color="#a78bfa"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#071028",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  item: {
    alignItems: "center",
    flex: 1,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },
  label: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 6,
  },
});

export default MonthlyActivity;
