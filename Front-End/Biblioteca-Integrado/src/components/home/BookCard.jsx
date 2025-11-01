import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Defini├º├úo das cores para manter a consist├¬ncia
const COLORS = {
  CARD_BG: "#111933ff", // Fundo principal do card (Azul Escuro)
  WRAPPER_BG: "#3a3f55", // Fundo do wrapper do cora├º├úo
  TEXT_LIGHT: "#d5d5d5ff", // Texto principal (t├¡tulo)
  TEXT_SECONDARY: "#b7b8c2", // Texto secund├írio (pre├ºo)
  SPACING: 14,
  HEART_BG: "#d2d2d2ff", // Fundo do cora├º├úo
};

const BookCard = ({
  // imageSource DEVE ser um objeto { uri: '...' } ou require('./local-image.png')
  imageSource,
  title,
  autor = "Jaon Doe",
  isAvailable,
  isFavorite,
  onToggleFavorite,
  onPress,
}) => {
  return (
    // O onPress ├® aplicado ao TouchableOpacity externo (cart├úo inteiro)
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.imageWrap}>
          {/* availability badge (optional) - positioned over the image */}
          {typeof isAvailable !== "undefined" && (
            <View
              style={
                isAvailable ? styles.badgeAvailable : styles.badgeUnavailable
              }
            >
              <Text style={styles.badgeText}>
                {isAvailable ? "Dispon├¡vel" : "Indispon├¡vel"}
              </Text>
            </View>
          )}

          <Image
            // Use um fallback para evitar erros caso a imagem n├úo seja carregada
            source={imageSource}
            style={styles.cover}
            resizeMode="cover"
          />
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          {/* O onToggleFavorite ├® aplicado apenas ao cora├º├úo */}
          <TouchableOpacity
            onPress={onToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.heartWrap}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={18}
                color={COLORS.HEART_BG} // Cor do cora├º├úo ├® branca
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
    marginRight: COLORS.SPACING, // Movi a margem para o wrapper externo
  },
  card: {
    width: 160,
    height: 230,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 18,
    padding: 12,
  },
  cover: {
    width: "100%",
    height: 150,
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
    flex: 1, // Permite que o t├¡tulo ocupe o espa├ºo restante
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
    right: 1,
    bottom: 12,
    backgroundColor: "#1abc9caa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 5,
  },
  badgeUnavailable: {
    position: "absolute",
    right: 1,
    bottom: 12,
    backgroundColor: "#e74d3cd9",
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

export default BookCard;
