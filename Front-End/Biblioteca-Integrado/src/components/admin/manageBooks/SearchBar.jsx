import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SearchBar = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="magnify" size={20} color="#9fb0c8" />
      <TextInput
        placeholder="Buscar por título ou autor ..."
        placeholderTextColor="#6b7b8c"
        value={value}
        onChangeText={onChange}
        style={styles.input}
        returnKeyType="search"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#071028",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    marginBottom: 12,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    color: "#e6eef8",
    fontSize: 14,
  },
});

export default SearchBar;
