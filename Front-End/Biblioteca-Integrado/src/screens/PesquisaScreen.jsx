import React, { useState } from "react";
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

const placeholderCover = require("../assets/indisponivel.jpg");

const PesquisaScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (query.trim() === "") return;
    setLoading(true);
    setSearched(true);
    setResults([]);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${query}`
      );
      const data = await response.json();
      const formattedBooks = data.docs.map((doc) => ({
        id: doc.key,
        title: doc.title,
        coverImage: doc.cover_i
          ? { uri: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` }
          : placeholderCover,
        isAvailable: doc.ebook_access === "borrowable",
      }));
      setResults(formattedBooks);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
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
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <BookItem
                    title={item.title}
                    coverImage={item.coverImage}
                    isAvailable={item.isAvailable}
                  />
                )}
                ListHeaderComponent={
                  results.length > 0 ? (
                    <Text style={styles.resultsTitle}>Livros encontrados</Text>
                  ) : null
                }
                ListEmptyComponent={
                  searched ? (
                    <Text style={styles.emptyText}>
                      Nenhum livro encontrado para "{query}"
                    </Text>
                  ) : (
                    <Text style={styles.emptyText}>
                      Faça uma busca para ver os resultados.
                    </Text>
                  )
                }
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
    marginBottom: 20,
  },
  searchBarWrapper: {
    flex: 1,
    marginLeft: 0,
  },
  menuContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(17, 16, 16, 0.01)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    padding: 2,
    marginBottom: 100,
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

export default PesquisaScreen;
