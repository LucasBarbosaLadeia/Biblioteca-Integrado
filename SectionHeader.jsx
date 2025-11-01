import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const SectionHeader = ({ title }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginTop: 8,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: "#fff", fontSize: 16, fontWeight: "700" },
  action: { color: "#b7b8c2", fontSize: 12 },
});

export default SectionHeader;
