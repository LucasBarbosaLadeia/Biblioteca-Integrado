import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import TabBar from "../../components/home/TagBar";
import HomeHeader from "../../components/home/HomeHeader";
import SearchBarWithFilter from "../../components/home/SearchBarWithFilter";
import SectionHeader from "../../components/home/SectionHeader";
import BookCard from "../../components/home/BookCard";
import CleanCodeCover from "../../assets/Clean-Code.jpg";
import DrawerMenu from "../../components/home/DrawerMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toggleFavorito } from "../../utils/favoritos";
import { api } from "../../services/api";
import {
  on as onEvent,
  off as offEvent,
  emit as emitEvent,
} from "../../utils/eventBus";

const HomeScreen = ({ navigation, setRole }) => {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState({});
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [recentes, setRecentes] = useState([]);
  const [recomendados, setRecomendados] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const isFocused = useIsFocused();

  const [user, setUser] = useState({});

  const handleLogout = () => {
    (async () => {
      try {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userId");
        await AsyncStorage.removeItem("userName");
        await AsyncStorage.removeItem("userRole");
        await AsyncStorage.removeItem("userRoleNormalized");
      } catch (e) {
      } finally {
        try {
          if (typeof setRole === "function") setRole(null);
          else navigation.replace("Login");
        } catch (e) {
          // fallback
          navigation.replace("Login");
        }
      }
    })();
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const usuarioId = await AsyncStorage.getItem("userId");
        if (!usuarioId) return;
        const data = await api.get(`usuarios/${usuarioId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (data && data.success && data.data) {
          const profile = data.data;
          setUser({
            name: profile.nome || profile.name,
            role: profile.tipo || profile.role,
            avatar: profile.capa_url ? { uri: profile.capa_url } : undefined,
          });
        }
      } catch (err) {
        console.error("Erro ao buscar perfil do usuário:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const onFilter = () => navigation.navigate("Pesquisa");

  const toggleFav = async (id, book) => {
    // optimistic update
    setFavorites((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        emitEvent("favoriteChanged", { id, isFavorito: !!next[id], book });
      } catch (e) {}
      return next;
    });

    try {
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("userId");
      await toggleFavorito(usuarioId, id, token);
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      // revert on error
      setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
      try {
        emitEvent("favoriteChanged", { id, isFavorito: !!favorites[id] });
      } catch (e) {}
    }
  };

  const openBook = (book) => {
    navigation.navigate("EspecificacoesLivro", { book });
  };

  useEffect(() => {
    if (query.trim() === "") {
      setSearchResults([]);
      setLoadingSearch(false);
      return;
    }

    let mounted = true;
    setLoadingSearch(true);
    const handle = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const data = await api.get(
          `livros?search=${encodeURIComponent(query)}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );
        if (!mounted) return;
        // mark that we performed a search (kept verbally via loadingSearch)
        if (data && data.success && Array.isArray(data.data)) {
          const parsed = data.data.map((l) => ({
            id: String(l.id_livro ?? l.id),
            title: l.titulo,
            autor: l.autor,
            cover: l.capa_url ? { uri: l.capa_url } : CleanCodeCover,
            raw: l,
          }));
          setSearchResults(parsed);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Erro ao buscar livros (search):", err);
        setSearchResults([]);
      } finally {
        if (mounted) setLoadingSearch(false);
      }
    }, 350);

    return () => {
      mounted = false;
      clearTimeout(handle);
    };
  }, [query]);

  useEffect(() => {
    const fetchRecentes = async () => {
      try {
        const data = await api.get(`livros/recentes?limit=10`);
        if (data && data.success && Array.isArray(data.data)) {
          const parsed = data.data.map((l) => ({
            id: String(l.id_livro),
            title: l.titulo,
            autor: l.autor,
            cover: l.capa_url ? { uri: l.capa_url } : CleanCodeCover,
            raw: l,
          }));
          setRecentes(parsed);
        }
      } catch (err) {
        console.error("Erro ao carregar livros recentes:", err);
      }
    };

    const fetchRecomendados = async () => {
      try {
        const data = await api.get(`livros/recomendados?limit=10`);
        if (data && data.success && Array.isArray(data.data)) {
          const parsed = data.data.map((l) => ({
            id: String(l.id_livro),
            title: l.titulo,
            autor: l.autor,
            cover: l.capa_url ? { uri: l.capa_url } : CleanCodeCover,
            raw: l,
          }));
          setRecomendados(parsed);
        }
      } catch (err) {
        console.error("Erro ao carregar livros recomendados:", err);
      }
    };

    const fetchFavoritos = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const usuarioId = await AsyncStorage.getItem("userId");
        if (!usuarioId) return;
        const data = await api.get(`favoritos/usuario/${usuarioId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (data && data.success && Array.isArray(data.data)) {
          const favMap = {};
          data.data.forEach((f) => {
            const livroId = f.id_livro ?? f.livro?.id_livro ?? f.livro?.id;
            if (livroId !== undefined && livroId !== null)
              favMap[String(livroId)] = true;
          });
          setFavorites(favMap);
        }
      } catch (err) {
        console.error("Erro ao buscar favoritos do usuário:", err);
      }
    };

    fetchRecentes();
    fetchRecomendados();
    fetchFavoritos();
  }, []);

  useEffect(() => {
    if (!isFocused) return;

    const fetchFavoritosOnFocus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const usuarioId = await AsyncStorage.getItem("userId");
        if (!usuarioId) return;
        const data = await api.get(`favoritos/usuario/${usuarioId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (data && data.success && Array.isArray(data.data)) {
          const favMap = {};
          data.data.forEach((f) => {
            const livroId = f.id_livro ?? f.livro?.id_livro ?? f.livro?.id;
            if (livroId !== undefined && livroId !== null)
              favMap[String(livroId)] = true;
          });
          setFavorites(favMap);
        }
      } catch (err) {
        console.error("Erro ao buscar favoritos do usuário on focus:", err);
      }
    };

    fetchFavoritosOnFocus();
  }, [isFocused]);

  useEffect(() => {
    const handler = (payload) => {
      if (!payload || payload.id == null) return;
      const key = String(payload.id);
      setFavorites((prev) => ({ ...prev, [key]: !!payload.isFavorito }));
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
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.page}>
          <HomeHeader
            onMenuPress={() => setDrawerVisible(true)}
            onBellPress={() => navigation.navigate("Notification")}
            hasAlert
          />

          <Text style={styles.heroTitle}>
            Qual livro você{"\n"}deseja encontrar?
          </Text>

          <SearchBarWithFilter
            value={query}
            onChangeText={setQuery}
            onSearch={() => {}}
            onFilterPress={onFilter}
          />
          {query.trim() !== "" ? (
            <View
              style={{
                marginTop: 8,
                paddingBottom: 215,
              }}
            >
              {loadingSearch ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <>
                  <SectionHeader title={`Resultados para "${query}"`} />
                  {searchResults.length === 0 ? (
                    <Text style={{ color: "#BBBBBB", marginTop: 12 }}>
                      Nenhum livro encontrado para "{query}"
                    </Text>
                  ) : (
                    <FlatList
                      data={searchResults}
                      keyExtractor={(item) => item.id}
                      showsVerticalScrollIndicator={false}
                      // render as a 2-column grid
                      numColumns={2}
                      columnWrapperStyle={{ justifyContent: "space-between" }}
                      contentContainerStyle={{
                        paddingTop: 8,
                        // reserve space at bottom so TabBar doesn't overlap results
                        paddingBottom: 220,
                      }}
                      renderItem={({ item, index }) => (
                        <View
                          style={{
                            flex: 1,
                            marginRight: index % 2 === 0 ? 10 : 0,
                            marginBottom: 10,
                          }}
                        >
                          <BookCard
                            imageSource={item.cover}
                            title={item.title}
                            autor={item.autor}
                            isAvailable={!!item.raw?.qt_atual}
                            isFavorite={!!favorites[item.id]}
                            onToggleFavorite={() =>
                              toggleFav(item.id, item.raw)
                            }
                            onPress={() => openBook(item)}
                          />
                        </View>
                      )}
                    />
                  )}
                </>
              )}
            </View>
          ) : (
            <>
              <SectionHeader
                title="Adicionados recentemente"
                onPress={() => {}}
              />
              <FlatList
                data={recentes}
                horizontal
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingRight: 8 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <BookCard
                    imageSource={item.cover}
                    title={item.title}
                    autor={item.autor}
                    isAvailable={!!item.raw?.qt_atual}
                    isFavorite={!!favorites[item.id]}
                    onToggleFavorite={() => toggleFav(item.id, item.raw)}
                    onPress={() => openBook(item)}
                  />
                )}
                style={{ marginTop: 8 }}
              />

              <SectionHeader title="Recomendados" />
              <FlatList
                data={recomendados}
                horizontal
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingRight: 8 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <BookCard
                    imageSource={item.cover}
                    title={item.title}
                    autor={item.autor}
                    isAvailable={!!item.raw?.qt_atual}
                    isFavorite={!!favorites[item.id]}
                    onToggleFavorite={() => toggleFav(item.id, item.raw)}
                    onPress={() => openBook(item)}
                  />
                )}
                style={{ marginTop: 8 }}
              />
            </>
          )}
        </View>
        <TabBar />
        <DrawerMenu
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          navigation={navigation}
          user={user}
          onLogout={handleLogout}
          activeRoute={"Home"}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020618",
  },
  safeArea: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginVertical: 16,
    lineHeight: 32,
  },
  gridWrap: {
    width: "100%",
    // paddingBottom: 250,
    backgroundColor: "#ff0000ff",
  },
});

export default HomeScreen;
