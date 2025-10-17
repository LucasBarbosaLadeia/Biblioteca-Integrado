import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";

import CampoLupa from "../components/CampoLupa";
import BackgroundImage from "../assets/background.png";
import TabBar from "../components/TagBar";
import BookItem from "../components/BookItens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_HOST } from "@env";

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [allBooks, setAllBooks] = useState([]);
  const API = API_HOST;

  const [refreshing, setRefreshing] = useState(false);

  const fetchBooks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API}/api/livros`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const formattedBooks = data.data.map((book) => ({
          id: book.id_livro,
          title: book.titulo,
          autor: book.autor,
          first_publish_year: book.ano_publicacao,
          subject: book.categoria,
          number_pags: book.paginas,
          qt_atual: book.qt_atual,
          prateleira: book.prateleira,
          coverImage: { uri: book.capa_url },
          isAvailable: book.qt_atual > 0,
        }));
        setAllBooks(formattedBooks);
      } else {
        alert(data.message || "Erro ao buscar livros");
      }
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      alert("Erro ao buscar livros. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBooks();
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (query.trim() === "") return;
    setLoading(true);
    setSearched(true);
    setResults([]);

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${API}/api/livros?search=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        const formattedBooks = data.data.map((book) => ({
          id: book.id_livro,
          title: book.titulo,
          autor: book.autor,
          first_publish_year: book.ano_publicacao,
          subject: book.categoria,
          number_pags: book.paginas,
          qt_atual: book.qt_atual,
          prateleira: book.prateleira,
          coverImage: { uri: book.capa_url },
          isAvailable: book.qt_atual > 0,
        }));

        setResults(formattedBooks);
      } else {
        alert(data.message || "Erro ao buscar livros");
      }
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      alert("Erro ao buscar livros. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.searchBarWrapper}>
              <CampoLupa
                value={query}
                onChangeText={setQuery}
                onSearch={handleSearch}
              />
            </View>
          </View>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#FFFFFF"
              style={{ flex: 1 }}
            />
          ) : (
            <View style={styles.menuContainer}>
              <FlatList
                data={searched ? results : allBooks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <BookItem
                    title={item.title}
                    author={item.autor}
                    coverImage={item.coverImage}
                    isAvailable={item.isAvailable}
                    onPress={() =>
                      navigation.navigate("EspecificacoesLivro", { book: item })
                    }
                  />
                )}
                ListHeaderComponent={
                  searched && results.length > 0 ? (
                    <Text style={styles.resultsTitle}>Livros encontrados</Text>
                  ) : null
                }
                ListEmptyComponent={
                  searched ? (
                    <Text style={styles.emptyText}>
                      Nenhum livro encontrado para "{query}"
                    </Text>
                  ) : allBooks.length === 0 ? (
                    <Text style={styles.emptyText}>
                      Nenhum livro cadastrado.
                    </Text>
                  ) : null
                }
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
      <TabBar />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 90,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  searchBarWrapper: {
    flex: 1,
    marginLeft: 0,
  },
  menuContainer: {
    width: 350,
    height: 580,
    marginBottom: 40,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Fundo branco com transparência
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)", // Borda branca com transparência
  },
  resultsTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    color: "#BBBBBB",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});

export default SearchScreen;
