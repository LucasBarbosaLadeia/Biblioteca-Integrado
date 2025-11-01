import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBarWithFilter = ({
  placeholder = "Pesquisar livro",
  value,
  onChangeText,
  onSearch,
  onFilterPress,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.inputWrap}>
        <Ionicons
          name="search"
          size={18}
          color="#b7b8c2"
          style={{ marginRight: 8 }}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#b7b8c2"
          onSubmitEditing={onSearch}
          style={styles.input}
          returnKeyType="search"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111933ff",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
});

export default SearchBarWithFilter;
