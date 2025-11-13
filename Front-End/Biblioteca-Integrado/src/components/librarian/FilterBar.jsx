import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FilterBar = ({ value, onChange, onFilterPress, selectedCategory }) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#9fb6e6" />
        <TextInput
          placeholder="Buscar por título, autor ou ISBN..."
          placeholderTextColor="#8fa6cf"
          style={styles.input}
          value={value}
          onChangeText={onChange}
        />
      </View>

      <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
        <Text style={styles.filterText}>
          {selectedCategory || "Todas as categorias"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f1724",
    borderRadius: 12,
    padding: 10,
  },
  input: {
    marginLeft: 8,
    color: "#fff",
    flex: 1,
  },
  filterBtn: {
    marginTop: 8,
    backgroundColor: "#11203a",
    padding: 12,
    borderRadius: 12,
  },
  filterText: {
    color: "#bcd7ff",
  },
});

export default FilterBar;
