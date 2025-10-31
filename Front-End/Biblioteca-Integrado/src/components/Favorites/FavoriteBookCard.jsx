import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Componente copiado e adaptado de BookCard para uso na tela de Favoritos
const COLORS = {
  CARD_BG: "#111933ff",
  WRAPPER_BG: "#3a3f55",
  TEXT_LIGHT: "#d5d5d5ff",
  TEXT_SECONDARY: "#b7b8c2",
  SPACING: 14,
  HEART_BG: "#d2d2d2ff",
};

const FavoriteBookCard = ({
  imageSource,
  title,
  autor = "Autor desconhecido",
  isAvailable,
  isFavorite,
  onToggleFavorite,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.imageWrap}>
          {typeof isAvailable !== "undefined" && (
            <View
              style={
                isAvailable ? styles.badgeAvailable : styles.badgeUnavailable
              }
            >
              <Text style={styles.badgeText}>
                {isAvailable ? "Disponível" : "Indisponível"}
              </Text>
            </View>
          )}

          <Image source={imageSource} style={styles.cover} resizeMode="cover" />
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          <TouchableOpacity
            onPress={onToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.heartWrap}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={18}
                color={COLORS.HEART_BG}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.price} numberOfLines={1}>
          {autor}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: COLORS.SPACING,
  },
  card: {
    width: 165,
    height: 235,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 18,
    padding: 12,
  },
  cover: {
    width: "100%",
    height: 155,
    borderRadius: 12,
    marginBottom: 10,
  },
  imageWrap: {
    position: "relative",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  heartWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.WRAPPER_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeAvailable: {
    position: "absolute",
    right: 2,
    bottom: 12,
    backgroundColor: "#1abc9c",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 5,
  },
  badgeUnavailable: {
    position: "absolute",
    right: 2,
    bottom: 12,
    backgroundColor: "#e74c3c",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  price: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    marginTop: 1,
  },
});

export default FavoriteBookCard;
