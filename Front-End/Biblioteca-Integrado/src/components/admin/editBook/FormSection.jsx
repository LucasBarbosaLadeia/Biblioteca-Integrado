import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FormSection = ({ title, children, note }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.body}>{children}</View>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#071028",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  title: {
    color: "#cfe8ff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  body: {
    marginTop: 6,
  },
  note: {
    marginTop: 10,
    backgroundColor: "#0b2540",
    color: "#cfe8ff",
    padding: 8,
    borderRadius: 8,
    fontSize: 12,
  },
});

export default FormSection;
