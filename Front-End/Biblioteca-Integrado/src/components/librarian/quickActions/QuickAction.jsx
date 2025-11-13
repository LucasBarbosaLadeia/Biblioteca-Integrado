import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useWindowDimensions } from "react-native";

const QuickAction = ({
  title,
  subtitle,
  onPress,
  color = "#0051ffff",
  icon,
}) => {
  const { width } = useWindowDimensions();
  const compact = width < 360;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: color },
        compact ? styles.containerCompact : null,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon ? (
        <View style={[styles.iconBox, compact ? styles.iconBoxCompact : null]}>
          {icon}
        </View>
      ) : null}

      <View style={styles.content}>
        <Text style={[styles.title, compact ? styles.titleCompact : null]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.subtitle, compact ? styles.subtitleCompact : null]}
          >
            {subtitle}
          </Text>
        ) : null}
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
  containerCompact: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  iconBox: {
    marginHorizontal: 3,
    marginEnd: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBoxCompact: {
    marginEnd: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  titleCompact: {
    fontSize: 14,
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },
  subtitleCompact: {
    fontSize: 11,
    marginTop: 2,
  },
});

export default QuickAction;
