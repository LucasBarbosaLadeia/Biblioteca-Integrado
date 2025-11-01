import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

const iconMapping = {
  search: <FontAwesome name="search" size={24} color="black" />,
  book: (
    <MaterialCommunityIcons name="notebook-multiple" size={24} color="black" />
  ),
  profile: <FontAwesome name="id-card-o" size={24} color="black" />,
};

const MenuButton = ({ title, iconName, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.buttonContainer, style]} onPress={onPress}>
      <View style={styles.iconContainer}>{iconMapping[iconName] || null}</View>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 20,
    width: "100%",
    elevation: 3, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    marginRight: 20,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MenuButton;
