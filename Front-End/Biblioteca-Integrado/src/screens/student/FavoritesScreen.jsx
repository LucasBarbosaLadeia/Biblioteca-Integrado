import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from "react-native";
import TabBar from "../../components/home/TagBar";
import BookCard from "../../components/Favorites/FavoriteBookCard";
import HeaderFavorite from "../../components/Favorites/headerFavorite";
import {
  on as onEvent,
  off as offEvent,
  emit as emitEvent,
} from "../../utils/eventBus";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_HOST } from "@env";

const FavoritesScreen = ({ navigation }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Normalize different shapes of 'livro' that may come from API or from local emits
  const normalizeLivro = (raw = {}) => {
    if (!raw) return {};
    const id = raw.id_livro ?? raw.id ?? raw.idLivro ?? raw.bookId ?? null;
    const titulo = raw.titulo ?? raw.title ?? raw.nome ?? "";
    const autor = raw.autor ?? raw.author ?? raw.autorNome ?? "";
    const capa_url =
      raw.capa_url ??
      (raw.coverImage && raw.coverImage.uri) ??
      (raw.cover && raw.cover.uri) ??
      null;
    const ano_publicacao = raw.ano_publicacao ?? raw.first_publish_year ?? null;
    const paginas = raw.paginas ?? raw.number_pags ?? null;
    const qt_atual = raw.qt_atual ?? raw.quantity ?? null;
    const prateleira = raw.prateleira ?? null;
    return {
      id,
      titulo,
      autor,
      capa_url,
      ano_publicacao,
      paginas,
      qt_atual,
      prateleira,
      raw,
    };
  };

  const toggleFav = async (livroId) => {
    // Optimistic UI: remove from favorites locally
    setFavoritos((prev) =>
      prev.filter((f) => String(f.livro?.id_livro) !== String(livroId))
    );
    try {
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("userId");
      await fetch(`${API_HOST}/api/favoritos/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_usuario: usuarioId, id_livro: livroId }),
      });
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
      // On error, reload favorites
      carregarFavoritos();
    }
    // emit event so other screens can react
    try {
      emitEvent("favoriteChanged", { id: livroId, isFavorito: false });
    } catch (e) {}
  };

  const carregarFavoritos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("userId");
      const API = API_HOST;

      const response = await fetch(
        `${API}/api/favoritos/usuario/${usuarioId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setFavoritos(data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarFavoritos();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  // listen to favorite changes emitted from other screens (e.g., HomeScreen)
  useEffect(() => {
    const handler = (payload) => {
      if (!payload || payload.id == null) return;
      const id = String(payload.id);
      if (payload.isFavorito) {
        // add book if provided and not already present
        if (payload.book) {
          setFavoritos((prev) => {
            const exists = prev.some((f) => String(f.livro?.id_livro) === id);
            if (exists) return prev;
            return [{ livro: payload.book, id_favorito: `tmp-${id}` }, ...prev];
          });
        }
      } else {
        // remove by livro id
        setFavoritos((prev) =>
          prev.filter((f) => String(f.livro?.id_livro) !== id)
        );
      }
    };

    const unsubscribe = onEvent("favoriteChanged", handler);
    return () => {
      try {
        unsubscribe();
      } catch (e) {
        offEvent("favoriteChanged", handler);
      }
    };
  }, []);

  return (
    <View style={styles.containerBackground}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <HeaderFavorite
            title="Meus Favoritos"
            count={favoritos.length}
            onBack={() => navigation.goBack()}
          />
          <View style={styles.gridWrap}>
            <FlatList
              data={favoritos}
              keyExtractor={(item) =>
                String(item.id_favorito ?? item.livro?.id_livro)
              }
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingBottom: 110, paddingTop: 8 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item, index }) => {
                const rawLivro = item.livro || item || {};
                const livro = normalizeLivro(rawLivro);
                const id = String(livro.id ?? "");
                return (
                  <View
                    style={{
                      flex: 1,
                      marginRight: index % 2 === 0 ? 15 : 0,
                      marginBottom: 12,
                    }}
                  >
                    <BookCard
                      imageSource={
                        livro.capa_url ? { uri: livro.capa_url } : undefined
                      }
                      title={livro.titulo}
                      autor={livro.autor}
                      isAvailable={(livro.qt_atual || 0) > 0}
                      isFavorite={true}
                      onToggleFavorite={() => toggleFav(id)}
                      onPress={() =>
                        navigation.navigate("EspecificacoesLivro", {
                          book: {
                            id: livro.id,
                            title: livro.titulo,
                            autor: livro.autor,
                            first_publish_year: livro.ano_publicacao,
                            subject: rawLivro.categoria ?? rawLivro.subject,
                            number_pags: livro.paginas,
                            qt_atual: livro.qt_atual,
                            prateleira: livro.prateleira,
                            coverImage: livro.capa_url
                              ? { uri: livro.capa_url }
                              : undefined,
                            isAvailable: (livro.qt_atual || 0) > 0,
                            raw: livro.raw,
                          },
                        })
                      }
                    />
                  </View>
                );
              }}
            />
          </View>
        </View>
        <TabBar />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerBackground: {
    flex: 1,
    backgroundColor: "#020618",
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 50,
    paddingBottom: 75,
  },
  gridWrap: {
    width: "100%",
  },
});

export default FavoritesScreen;
