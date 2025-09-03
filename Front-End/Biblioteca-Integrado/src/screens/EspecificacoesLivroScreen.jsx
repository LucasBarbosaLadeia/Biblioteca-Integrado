import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BackgroundImage from "../assets/background.png";
import BookInfoCard from "../components/BookInfoCard";
import AvailabilityCard from "../components/AvailabilityCard";
import TabBar from "../components/TagBar";

const EspecificacoesLivroScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const [isFavorited, setIsFavorited] = useState(book.isFavorite || false);

  const handleFavoriteToggle = () => {
    setIsFavorited((currentValue) => !currentValue);
    console.log(
      `Livro ${!isFavorited ? "adicionado aos" : "removido dos"} favoritos!`
    );
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header customizado (BOTÃO REMOVIDO DAQUI) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-circle" size={40} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Especificações do livro</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <BookInfoCard book={book} />
          <AvailabilityCard book={book} />
        </ScrollView>

        {/* <<< NOVO LOCAL: O BOTÃO FLUTUANTE VAI AQUI >>> */}
        {/* Ele fica FORA do ScrollView para não rolar com o conteúdo */}
        <TouchableOpacity onPress={handleFavoriteToggle} style={styles.fab}>
          <Ionicons
            name={isFavorited ? "heart" : "heart-outline"}
            size={32}
            color={"white"} // Cor do ícone
          />
        </TouchableOpacity>

        <TabBar />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  safeArea: { flex: 1, paddingTop: 80 },
  container: { padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20, // Adicionado padding para alinhar com o conteúdo
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 30, // Retornamos a margem para o texto
  },
  // <<< NOVO ESTILO PARA O BOTÃO FLUTUANTE >>>
  fab: {
    position: "absolute", // Posição absoluta para flutuar
    width: 60,
    height: 60,
    borderRadius: 30, // Deixa o botão redondo
    backgroundColor: "#E74C3C", // Cor de fundo do botão
    justifyContent: "center",
    alignItems: "center",
    right: 30, // 30 pixels da direita
    bottom: 100, // 100 pixels de baixo (para não ficar em cima da TabBar)
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default EspecificacoesLivroScreen;
