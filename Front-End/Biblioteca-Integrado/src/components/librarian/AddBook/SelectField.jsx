import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";

const SelectField = ({
  label,
  options = [],
  value,
  onValueChange,
  placeholder = "Selecione",
}) => {
  const [open, setOpen] = useState(false);

  const selected =
    options.find((o) => (o.id_categoria ?? o.id) === value) || null;

  return (
    <View style={{ marginBottom: 10 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity style={styles.select} onPress={() => setOpen(true)}>
        <Text style={styles.selectText}>
          {selected
            ? selected.nome || selected.label || selected.title
            : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <SafeAreaView style={styles.modalWrap}>
          <View style={styles.modalInner}>
            <FlatList
              data={options}
              keyExtractor={(item, idx) =>
                String(item.id_categoria ?? item.id ?? idx)
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    onValueChange(item.id_categoria ?? item.id);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.itemText}>
                    {item.nome || item.label || item.title}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.close}
              onPress={() => setOpen(false)}
            >
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: { color: "#9fb0c8", marginBottom: 6 },
  select: { backgroundColor: "#0b1220", padding: 12, borderRadius: 10 },
  selectText: { color: "#e6eef8" },
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
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.02)",
  },
  itemText: { color: "#e6eef8" },
  close: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#0b2540",
    alignItems: "center",
  },
  closeText: { color: "#e6eef8", fontWeight: "700" },
});

export default SelectField;
