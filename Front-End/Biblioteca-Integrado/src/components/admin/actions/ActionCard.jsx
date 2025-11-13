import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ActionCard = ({
  title,
  subtitle,
  iconName,
  iconColor = "#60a5fa",
  onPress,
  borderColor = "rgba(255,255,255,0.03)",
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, { borderColor }]}
      onPress={onPress}
    >
      <View style={[styles.iconBubble, { backgroundColor: iconColor + "22" }]}>
        <MaterialCommunityIcons name={iconName} size={20} color={iconColor} />
      </View>

      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            {subtitle}
          </Text>
        ) : null}
      </View>

      <MaterialCommunityIcons
        name="arrow-top-right"
        size={18}
        color="#9fb0c8"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#071028",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  texts: {
    flex: 1,
  },
  title: {
    color: "#e6eef8",
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    color: "#9fb0c8",
    fontSize: 12,
    marginTop: 4,
  },
});

export default ActionCard;
