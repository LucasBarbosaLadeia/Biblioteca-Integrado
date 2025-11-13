import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HeaderFavorite = ({ title = "Meus Favoritos", count = 0, onBack }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
        <Ionicons name="arrow-back" size={20} color="#ffffffff" />
      </TouchableOpacity>

      <View style={styles.titleBlock}>
        <Text style={styles.headerMain}>{title}</Text>
        <Text style={styles.headerSubtitle}>{count} livros</Text>
      </View>

      <Ionicons name="heart" size={26} color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    flex: 1,
    alignItems: "center",
  },
  headerMain: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#b7b8c2",
    marginTop: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#1b2546ff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HeaderFavorite;
