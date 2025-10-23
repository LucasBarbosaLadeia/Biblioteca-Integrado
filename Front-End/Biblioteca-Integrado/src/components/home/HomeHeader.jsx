import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HomeHeader = ({
  title = "Biblioteca",
  onMenuPress,
  onBellPress,
  hasAlert,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconBtn} onPress={onMenuPress}>
        <Ionicons name="grid-outline" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.iconBtn} onPress={onBellPress}>
        <Ionicons name="notifications-outline" size={20} color="#fff" />
        {hasAlert ? <View style={styles.badge} /> : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginBottom: 1,
    marginTop: 2,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#1b2546ff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff5a5f",
  },
});

export default HomeHeader;
