import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { on as onEvent } from "../../utils/eventBus";

const HomeHeader = ({
  title = "Biblioteca",
  onMenuPress,
  onBellPress,
  hasAlert = false,
  showBack = false,
  onBackPress,
}) => {
  const [alert, setAlert] = useState(!!hasAlert);

  useEffect(() => {
    const unsubscribe = onEvent("notificationsUpdated", (payload) => {
      if (payload && typeof payload.unreadCount === "number") {
        setAlert(payload.unreadCount > 0);
      }
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={showBack ? onBackPress : onMenuPress}
      >
        <Ionicons
          name={showBack ? "book-back" : "grid-outline"}
          size={20}
          color="#ffffffff"
        />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.iconBtn} onPress={onBellPress}>
        <Ionicons name="notifications-outline" size={20} color="#fff" />
        {alert ? <View style={styles.badge} /> : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: 5,
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
