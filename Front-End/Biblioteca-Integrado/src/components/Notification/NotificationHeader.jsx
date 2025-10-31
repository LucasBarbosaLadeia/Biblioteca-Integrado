import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { on as onEvent } from "../../utils/eventBus";

const NotificationHeader = ({ navigation, unreadCount = 2, onBack }) => {
  const [unread, setUnread] = useState(unreadCount);

  const handleBack = () => {
    if (onBack) return onBack();
    if (navigation && navigation.goBack) return navigation.goBack();
  };

  useEffect(() => {
    // subscribe to notificationsUpdated events
    const unsubscribe = onEvent("notificationsUpdated", (payload) => {
      if (payload && typeof payload.unreadCount === "number")
        setUnread(payload.unreadCount);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconBtn} onPress={handleBack}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={styles.title}>Notificações</Text>
        <Text style={styles.subtitle}>{`${unread} não lidas`}</Text>
      </View>

      <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
        <Ionicons name="notifications-outline" size={20} color="#fff" />
        {unread > 0 ? <View style={styles.badge} /> : null}
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
    marginBottom: 20,
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
  center: { flex: 1, alignItems: "center" },
  title: { color: "#fff", fontSize: 25, fontWeight: "600" },
  subtitle: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 },
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

export default NotificationHeader;
