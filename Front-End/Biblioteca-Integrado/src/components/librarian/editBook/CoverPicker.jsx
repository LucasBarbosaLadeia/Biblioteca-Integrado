import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";

const CoverPicker = ({ cover, onPick }) => {
  return (
    <View style={styles.row}>
      <Image source={cover} style={styles.cover} />
      <TouchableOpacity style={styles.btn} onPress={onPick}>
        <Text style={styles.btnText}>Alterar Capa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 6,
    backgroundColor: "#23314a",
  },
  btn: {
    marginLeft: 12,
    backgroundColor: "#1b3a75",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "600" },
});

export default CoverPicker;
