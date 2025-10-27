import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AboutSection = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre o livro</Text>
      <Text style={styles.body}>{text || "Descrição não disponível."}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 14 },
  title: { color: "white", fontWeight: "700", fontSize: 16, marginBottom: 8 },
  body: { color: "#cfcfcf", lineHeight: 20 },
});

export default AboutSection;
