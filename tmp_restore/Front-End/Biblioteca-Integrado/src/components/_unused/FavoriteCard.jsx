import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const FavoriteCard = ({ favorito }) => {
  const navigation = useNavigation(); // pega o navigation do contexto
  const { livro } = favorito;

  const handlePress = () => {
    navigation.navigate("EspecificacoesLivro", {
      book: {
        id: livro.id_livro,
        title: livro.titulo,
        autor: livro.autor,
        first_publish_year: livro.ano_publicacao,
        subject: livro.categoria,
        number_pags: livro.paginas,
        qt_atual: livro.qt_atual,
        prateleira: livro.prateleira,
        coverImage: { uri: livro.capa_url },
        isAvailable: livro.qt_atual > 0,
      },
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: livro.capa_url }} style={styles.coverImage} />
      <View style={styles.info}>
        <Text style={styles.title}>{livro.titulo}</Text>
        <Text style={styles.author}>Autor: {livro.autor}</Text>
        <Text style={styles.category}>
          Categoria: {livro.categoria?.nome || "Sem categoria"}
        </Text>
      </View>
    </TouchableOpacity>
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
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 4 },
  author: { fontSize: 14, color: "#555", marginBottom: 2 },
  category: { fontSize: 13, color: "#666" },
});

export default FavoriteCard;
