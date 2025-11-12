import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}) => {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6b7b8c"
        style={[styles.input, multiline ? styles.multiline : null]}
        multiline={multiline}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 10 },
  label: { color: "#9fb0c8", marginBottom: 6 },
  input: {
    backgroundColor: "#0b1220",
    borderRadius: 10,
    padding: 12,
    color: "#e6eef8",
  },
  multiline: { minHeight: 100, textAlignVertical: "top" },
});

export default TextField;
