import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Header = ({
  title = "Adicionar Novo Livro",
  navigation,
  iconSecond = "book-outline",
}) => {
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
  return (
    <View style={[styles.container, { paddingTop: statusBarHeight + 4 }]}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => navigation && navigation.goBack && navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={18} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.iconBtn} onPress={() => {}}>
        <Ionicons name={iconSecond} size={18} color="#fff" />
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
    marginBottom: 4,
    paddingVertical: 4,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#1b2546ff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
});

export default Header;
