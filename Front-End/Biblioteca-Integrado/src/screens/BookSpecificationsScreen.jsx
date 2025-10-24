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
import TabBar from "../components/home/TagBar";
import { toggleFavorito as toggleFavoritoAPI } from "../utils/favoritos";

import HeaderDetalhes from "../components/DetalhesDoLivro/HeaderDetalhes";
import CoverImage from "../components/DetalhesDoLivro/CoverImage";
import AvailabilityBadge from "../components/DetalhesDoLivro/AvailabilityBadge";
import InfoRowCards from "../components/DetalhesDoLivro/InfoRowCards";
import DetailsCard from "../components/DetalhesDoLivro/DetailsCard";
import AboutSection from "../components/DetalhesDoLivro/AboutSection";
import ReserveButton from "../components/DetalhesDoLivro/ReserveButton";

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

  // Normalizar campos do book com fallbacks
  const cover = book?.coverImage || book?.capa || book?.cover || null;
  const title = book?.title || book?.titulo || book?.nome || "";
  const author = book?.autor || book?.author || book?.autor_nome || "";
  const isAvailable = book?.isAvailable ?? book?.qt_atual > 0;
  const copies = book?.qt_atual || book?.copies || 0;
  const pages = book?.number_pags || book?.paginas || book?.pages;
  const year = book?.first_publish_year || book?.ano || book?.year;
  const editora = book?.editora || book?.publisher;
  const isbn = book?.isbn || book?.ISBN || book?.isbn_13 || book?.codigo_isbn;
  const localizacao =
    book?.localizacao ||
    (book?.prateleira
      ? `Seção A - Prateleira ${book.prateleira}`
      : book?.shelf);
  const description =
    book?.sinopse || book?.description || book?.descricao || book?.about;

  return (
    <View style={styles.Backgroundcontainer}>
      <SafeAreaView style={styles.safeArea}>
        <HeaderDetalhes
          title="Detalhes do Livro"
          onBack={() => navigation.goBack()}
          onToggleFavorite={handleToggleFavorito}
          isFavorited={isFavorited}
          disabled={loadingFavorite}
        />

        <ScrollView contentContainerStyle={styles.container}>
          <CoverImage cover={cover} />
          <Text style={styles.bookTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.bookAuthor}>{author}</Text>
          <AvailabilityBadge isAvailable={isAvailable} copies={copies} />

          <InfoRowCards pages={pages} year={year} />

          <DetailsCard
            editora={editora}
            isbn={isbn}
            localizacao={localizacao}
          />

          <AboutSection text={description} />

          <ReserveButton
            onPress={() => {
              /* implementar reserva */
            }}
          />
        </ScrollView>

        <TabBar />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  Backgroundcontainer: { flex: 1, backgroundColor: "#020618" },
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
