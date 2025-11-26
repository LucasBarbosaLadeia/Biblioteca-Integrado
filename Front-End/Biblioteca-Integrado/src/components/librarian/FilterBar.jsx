import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const FilterBar = ({ value, onChange, onFilterPress, selectedCategory }) => {
  return (
    <View style={styles.container}>
      {/* Barra de Busca Melhorada */}
      <View style={styles.searchWrapper}>
        <LinearGradient
          colors={["#1E293B", "#0F172A"]}
          style={styles.searchContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={20} color="#60A5FA" />
          </View>
          <TextInput
            placeholder="Buscar por título, autor ou ISBN..."
            placeholderTextColor="#64748B"
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
          {value.length > 0 && (
            <TouchableOpacity
              onPress={() => onChange("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#64748B" />
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>

      {/* Botão de Filtro (oculto por enquanto) */}
      {/* <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <LinearGradient
          colors={["#3B82F6", "#2563EB"]}
          style={styles.filterGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="filter" size={18} color="#fff" />
          <Text style={styles.filterText}>
            {selectedCategory || "Filtros"}
          </Text>
        </LinearGradient>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  searchWrapper: {
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  searchIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "500",
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  filterGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default FilterBar;
