import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const QuickAction = ({
  title,
  subtitle,
  onPress,
  color = "#0051ffff",
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon ? <View style={styles.iconBox}>{icon}</View> : null}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    marginHorizontal: 3,
    marginEnd: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },
});

export default QuickAction;
