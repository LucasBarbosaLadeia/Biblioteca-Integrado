import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CategorySelect = ({ categories = [], selectedId, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categoria</Text>
      <View style={styles.row}>
        {categories && categories.length > 0 ? (
          categories.map((c) => (
            <TouchableOpacity
              key={String(c.id ?? c.id_categoria ?? c)}
              style={[
                styles.chip,
                selectedId === (c.id ?? c.id_categoria ?? c)
                  ? styles.chipSelected
                  : null,
              ]}
              onPress={() => onSelect && onSelect(c.id ?? c.id_categoria ?? c)}
            >
              <Text style={styles.chipText}>
                {c.nome || c.name || c.titulo || c}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: "#9fb0c8" }}>Nenhuma categoria</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  label: { color: "#cbd5e1", marginBottom: 8 },
  row: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#0f294a",
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: "#1b3a75" },
  chipText: { color: "#cfe6ff" },
});

export default CategorySelect;
