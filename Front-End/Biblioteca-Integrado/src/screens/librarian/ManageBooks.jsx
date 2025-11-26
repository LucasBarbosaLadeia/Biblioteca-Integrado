import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import FilterBar from "../../components/librarian/FilterBar";
import ManageBookCard from "../../components/librarian/ManageBookCard";
import LibrarianHeader from "../../components/librarian/HeaderLibrarian";
import { api } from "../../services/api";
import { getCapaUrl } from "../../utils/imageUtils";
import CleanCodeCover from "../../assets/Clean-Code.jpg";

const ManageBooks = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category] = useState("Todas as categorias");

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/livros");
      if (response.success && Array.isArray(response.data)) {
        const mapped = response.data.map((livro) => {
          const capaUrl = getCapaUrl(livro.capa_url);
          console.log(
            `[ManageBooks] Livro: ${livro.titulo}, capa_url: ${livro.capa_url}, full URL: ${capaUrl}`
          );
          return {
            id: String(livro.id_livro),
            title: livro.titulo,
            author: livro.autor,
            category: livro.categoria?.nome || "Sem categoria",
            isbn: livro.isbn || "N/A",
            total: livro.qt_total || 0,
            available: livro.qt_atual || 0,
            location: livro.prateleira || "N/A",
            cover: capaUrl ? { uri: capaUrl } : CleanCodeCover,
            bookId: livro.id_livro,
            raw: livro,
          };
        });
        setBooks(mapped);
      }
    } catch (error) {
      console.error("Erro ao carregar livros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    if (navigation && navigation.navigate) {
      navigation.navigate("EditBook", { bookId: book.bookId });
    }
  };

  const filtered = books.filter((b) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q)
    );
  });

  return (
    <SafeAreaView style={styles.safe}>
      <LibrarianHeader
        title="Gerenciar Livros"
        navigation={navigation}
        iconSecond="book-outline"
      />

      <View style={styles.container}>
        <FilterBar
          value={query}
          onChange={setQuery}
          onFilterPress={() => {}}
          selectedCategory={category}
        />

        <Text style={styles.countText}>{` ${filtered.length} livros`}</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ManageBookCard {...item} onEdit={() => handleEdit(item)} />
            )}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#071032" },
  container: { paddingHorizontal: 16, paddingTop: 8, flex: 1 },
  countText: { color: "#9fb6e6", marginVertical: 6 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ManageBooks;
