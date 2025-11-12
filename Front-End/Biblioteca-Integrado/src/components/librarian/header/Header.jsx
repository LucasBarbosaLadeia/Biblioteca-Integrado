import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Header = ({
  title = "Adicionar Novo Livro",
  navigation,
  iconSecond = "book-outline",
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => navigation && navigation.goBack && navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.iconBtn} onPress={() => {}}>
        <Ionicons name={iconSecond} size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: 50,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#1b2546ff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
});

export default Header;
