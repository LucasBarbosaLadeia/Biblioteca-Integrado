import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const EditBookForm = ({ values, onChange }) => {
  return (
    <View style={styles.form}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={values.title}
        onChangeText={(t) => onChange("title", t)}
        placeholder="Título do livro"
        placeholderTextColor="#8fa6cf"
      />

      <Text style={styles.label}>Autor</Text>
      <TextInput
        style={styles.input}
        value={values.author}
        onChangeText={(t) => onChange("author", t)}
        placeholder="Nome do autor"
        placeholderTextColor="#8fa6cf"
      />

      <Text style={styles.label}>ISBN</Text>
      <TextInput
        style={styles.input}
        value={values.isbn}
        onChangeText={(t) => onChange("isbn", t)}
        placeholder="ISBN"
        placeholderTextColor="#8fa6cf"
      />

      <Text style={styles.label}>Total de cópias</Text>
      <TextInput
        style={styles.input}
        value={String(values.total ?? "")}
        onChangeText={(t) => onChange("total", t.replace(/[^0-9]/g, ""))}
        placeholder="0"
        keyboardType="numeric"
        placeholderTextColor="#8fa6cf"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: { marginTop: 8 },
  label: { color: "#cbd5e1", marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#071032",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
  },
});

export default EditBookForm;
