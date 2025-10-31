import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HeaderDetalhes = ({
  title = "Detalhes do Livro",
  onBack,
  onToggleFavorite,
  isFavorited,
  disabled,
  togglingFavorite,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.leftBtn}>
        <Ionicons name="arrow-back-circle" size={38} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        onPress={onToggleFavorite}
        style={styles.rightBtn}
        disabled={disabled}
      >
        {togglingFavorite ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons
            name={
              disabled
                ? "heart-outline"
                : isFavorited
                ? "heart"
                : "heart-outline"
            }
            size={28}
            color="white"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  leftBtn: { width: 40 },
  rightBtn: { width: 40, alignItems: "flex-end" },
  title: { color: "white", fontSize: 18, fontWeight: "700" },
});

export default HeaderDetalhes;
