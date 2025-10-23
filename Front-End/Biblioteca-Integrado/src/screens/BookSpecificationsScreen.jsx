import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_HOST } from "@env";

import BackgroundImage from "../assets/background.png";
import BookInfoCard from "../components/BookInfoCard";
import AvailabilityCard from "../components/AvailabilityCard";
import TabBar from "../components/home/TagBar";
import { toggleFavorito as toggleFavoritoAPI } from "../utils/favoritos";

const BookSpecificationsScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(true);

  const checkIfFavorited = async () => {
    try {
      setLoadingFavorite(true);
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("userId");
      const API = API_HOST;

      const response = await fetch(
        `${API}/api/favoritos/usuario/${usuarioId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const isFav = result.data.some(
          (fav) => fav.id_livro === book.id || fav.livro?.id_livro === book.id
        );
        setIsFavorited(isFav);
      } else {
        setIsFavorited(false);
      }
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
      setIsFavorited(false);
    } finally {
      setLoadingFavorite(false);
    }
  };
  useEffect(() => {
    checkIfFavorited();
  }, []);

  const handleToggleFavorito = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("userId");

      const response = await toggleFavoritoAPI(usuarioId, book.id, token);

      if (response.success) {
        setIsFavorited((prev) => !prev);
      } else {
        console.warn(
          "Erro ao favoritar:",
          response.message || "Erro desconhecido"
        );
      }
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
    }
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
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
        <TouchableOpacity
          onPress={handleToggleFavorito}
          style={styles.fab}
          disabled={loadingFavorite} // desabilita enquanto carrega
        >
          <Ionicons
            name={
              loadingFavorite
                ? "heart-outline" // enquanto carrega
                : isFavorited
                ? "heart" // já favoritado
                : "heart-outline" // não favoritado
            }
            size={32}
            color={"white"}
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
    paddingHorizontal: 20,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 30,
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E74C3C",
    justifyContent: "center",
    alignItems: "center",
    right: 30,
    bottom: 100,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default BookSpecificationsScreen;
