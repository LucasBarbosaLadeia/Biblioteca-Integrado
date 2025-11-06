import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

const MetricCard = ({
  icon,
  value,
  title,
  color = "#fff",
  backgroundColor = "#0b1220",
  borderColor = "rgba(255, 0, 0, 1)",
}) => {
  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    if (icon == null) return null;
    return <Text style={[styles.iconText, { color }]}>{icon}</Text>;
  };

  return (
    <View style={[styles.card, { backgroundColor, borderColor }]}>
      <View style={styles.iconBubble}>{renderIcon()}</View>

      <View style={styles.content}>
        <Text style={[styles.value, { color }]}>{value ?? 0}</Text>
        <Text style={styles.title}>{title ?? ""}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    padding: 14,
    minHeight: 150,
    margin: 0,
    justifyContent: "flex-start",
    borderWidth: 2,

    // shadow
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  iconBubble: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 20,
    opacity: 0.95,
  },
  content: {
    paddingTop: 6,
  },
  value: {
    fontSize: 36,
    fontWeight: "700",
    marginTop: 6,
  },
  title: {
    fontSize: 14,
    color: "#cbd5e1",
    marginTop: 25,
    fontWeight: "700",
    textAlign: "left",
  },
});

export default MetricCard;
