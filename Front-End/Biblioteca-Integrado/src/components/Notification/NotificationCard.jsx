import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ICONS = {
  warning: "time-outline",
  error: "alert-circle-outline",
  success: "checkmark-circle-outline",
  info: "notifications-outline",
};

const COLORS = {
  warning: "#eab31cff",
  error: "#cc3939ff",
  success: "#23c441ff",
  info: "#2f9cff",
};

const NotificationCard = ({
  id,
  type = "info",
  title,
  message,
  date,
  seen = false,
  onMarkSeen,
  onPress,
}) => {
  const color = COLORS[type] || COLORS.info;
  const icon = ICONS[type] || ICONS.info;

  const handlePress = () => {
    // inform parent that this notification was opened/marked seen
    if (!seen && onMarkSeen) onMarkSeen(id);
    if (onPress) onPress(id);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[styles.card, !seen && styles.unseenCard]}
    >
      <View style={[styles.iconWrap, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.message} numberOfLines={3} ellipsizeMode="tail">
          {message}
        </Text>
      </View>

      {!seen ? <View style={styles.unseenDot} /> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  unseenCard: {
    borderColor: "#2f9cff",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  date: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  message: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 18,
  },
  unseenDot: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#2f9cff",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.08)",
  },
});

export default NotificationCard;
