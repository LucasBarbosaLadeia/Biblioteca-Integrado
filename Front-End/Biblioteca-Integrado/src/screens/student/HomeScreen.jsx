import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, StyleSheet, SafeAreaView, Text, FlatList } from "react-native";
import TabBar from "../../components/home/TagBar";
import HomeHeader from "../../components/home/HomeHeader";
import SearchBarWithFilter from "../../components/home/SearchBarWithFilter";
import SectionHeader from "../../components/home/SectionHeader";
import BookCard from "../../components/home/BookCard";
import CleanCodeCover from "../../assets/Clean-Code.jpg";
import DrawerMenu from "../../components/home/DrawerMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toggleFavorito } from "../../utils/favoritos";
import { API_HOST } from "@env";
import { on as onEvent, off as offEvent } from "../../utils/eventBus";

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState({});
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [recentes, setRecentes] = useState([]);
  const [recomendados, setRecomendados] = useState([]);
  const [loadingRecents, setLoadingRecents] = useState(false);
  const [loadingRecomendados, setLoadingRecomendados] = useState(false);
  const isFocused = useIsFocused();

  const [user, setUser] = useState({});

  const handleLogout = () => {
    (async () => {
      try {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userId");
      } catch (e) {
      } finally {
        navigation.navigate("Login");
      }
    })();
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const usuarioId = await AsyncStorage.getItem("userId");
        if (!usuarioId) return;
        const API = API_HOST || "http://localhost:3001";
        const res = await fetch(`${API}/api/usuarios/${usuarioId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
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

  const onSearch = () => navigation.navigate("Pesquisa");
  const onFilter = () => navigation.navigate("Pesquisa");

  const toggleFav = async (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));

    try {
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("userId");
      await toggleFavorito(usuarioId, id, token);
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const openBook = (book) => {
    navigation.navigate("EspecificacoesLivro", { book });
  };

  useEffect(() => {
    const API = API_HOST || "http://localhost:3001";

    const fetchRecentes = async () => {
      setLoadingRecents(true);
      try {
        const res = await fetch(`${API}/api/livros/recentes?limit=10`);
        const data = await res.json();
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
      } finally {
        setLoadingRecents(false);
      }
    };

    const fetchRecomendados = async () => {
      setLoadingRecomendados(true);
      try {
        const res = await fetch(`${API}/api/livros/recomendados?limit=10`);
        const data = await res.json();
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
      } finally {
        setLoadingRecomendados(false);
      }
    };

    const fetchFavoritos = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const usuarioId = await AsyncStorage.getItem("userId");
        if (!usuarioId) return;
        const res = await fetch(`${API}/api/favoritos/usuario/${usuarioId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
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

    const API = API_HOST || "http://localhost:3001";

    const fetchFavoritosOnFocus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const usuarioId = await AsyncStorage.getItem("userId");
        if (!usuarioId) return;
        const res = await fetch(`${API}/api/favoritos/usuario/${usuarioId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
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
            onSearch={onSearch}
            onFilterPress={onFilter}
          />

          <SectionHeader title="Adicionados recentemente" onPress={() => {}} />
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
                isFavorite={!!favorites[item.id]}
                onToggleFavorite={() => toggleFav(item.id)}
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
                isFavorite={!!favorites[item.id]}
                onToggleFavorite={() => toggleFav(item.id)}
                onPress={() => openBook(item)}
              />
            )}
            style={{ marginTop: 8 }}
          />
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
});

export default HomeScreen;
