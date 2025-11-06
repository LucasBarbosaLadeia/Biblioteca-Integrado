import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CategoryFilter = ({ categories = [], selectedId, onSelect }) => {
  const [open, setOpen] = useState(false);
  const selected = categories.find((c) => c.id_categoria === selectedId);

  const handleChoose = (id) => {
    setOpen(false);
    onSelect(id);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.container}
        onPress={() => setOpen(true)}
      >
        <View style={styles.left}>
          <MaterialCommunityIcons
            name="filter-variant"
            size={18}
            color="#9fb0c8"
          />
          <Text style={styles.text}>
            {selected ? selected.nome : "Todas as categorias"}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-down" size={18} color="#9fb0c8" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent={true}>
        <SafeAreaView style={styles.modalWrap}>
          <View style={styles.modalInner}>
            <Text style={styles.modalTitle}>Escolher Categoria</Text>
            <FlatList
              data={[
                { id_categoria: null, nome: "Todas as categorias" },
                ...categories,
              ]}
              keyExtractor={(item) => String(item.id_categoria ?? "all")}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleChoose(item.id_categoria ?? null)}
                >
                  <Text style={styles.modalItemText}>{item.nome}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setOpen(false)}
            >
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#071028",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    marginBottom: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#e6eef8",
    marginLeft: 10,
    fontSize: 14,
  },
  modalWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalInner: {
    backgroundColor: "#071028",
    borderRadius: 12,
    maxHeight: "80%",
    padding: 12,
  },
  modalTitle: {
    color: "#cfe8ff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.02)",
  },
  modalItemText: {
    color: "#e6eef8",
  },
  closeBtn: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#0b2540",
    alignItems: "center",
  },
  closeText: { color: "#e6eef8", fontWeight: "700" },
});

export default CategoryFilter;
