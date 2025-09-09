import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const FavoriteCard = ({ favorito }) => {
  const { livro } = favorito;

  // Usar a URL da imagem ou placeholder se não existir
  const imageUrl =
    livro.coverImage ||
    "https://via.placeholder.com/80x120.png?text=Sem+Imagem";

  return (
    <View style={styles.card}>
      <Image source={{ uri: livro.capa_url }} style={styles.coverImage} />

      <View style={styles.info}>
        <Text style={styles.title}>{livro.titulo}</Text>
        <Text style={styles.author}>Autor: {livro.autor}</Text>
        <Text style={styles.category}>Categoria: {livro.categoria.nome}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: "center",
  },
  coverImage: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 16,
    resizeMode: "cover",
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    color: "#666",
  },
});

export default FavoriteCard;
