import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Definição das cores para manter a consistência
const COLORS = {
  CARD_BG: "#111933ff", // Fundo principal do card (Azul Escuro)
  WRAPPER_BG: "#3a3f55", // Fundo do wrapper do coração
  TEXT_LIGHT: "#d5d5d5ff", // Texto principal (título)
  TEXT_SECONDARY: "#b7b8c2", // Texto secundário (preço)
  SPACING: 14,
  HEART_BG: "#d2d2d2ff", // Fundo do coração
};

const BookCard = ({
  // imageSource DEVE ser um objeto { uri: '...' } ou require('./local-image.png')
  imageSource,
  title,
  autor = "Jaon Doe",
  isFavorite,
  onToggleFavorite,
  onPress,
}) => {
  return (
    // O onPress é aplicado ao TouchableOpacity externo (cartão inteiro)
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.card}>
        <Image
          // Use um fallback para evitar erros caso a imagem não seja carregada
          source={imageSource}
          style={styles.cover}
          resizeMode="cover"
        />

        <View style={styles.metaRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          {/* O onToggleFavorite é aplicado apenas ao coração */}
          <TouchableOpacity
            onPress={onToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.heartWrap}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={18}
                color={COLORS.HEART_BG} // Cor do coração é branca
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: "600",
    fontSize: 14,
    flex: 1, // Permite que o título ocupe o espaço restante
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
  price: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    marginTop: 1,
  },
});

export default BookCard;
