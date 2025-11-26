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

        {/* Header com contagem */}
        <View style={styles.headerRow}>
          <View style={styles.countContainer}>
            <Text style={styles.countNumber}>{filtered.length}</Text>
            <Text style={styles.countLabel}>
              {filtered.length === 1 ? "Livro" : "Livros"}
            </Text>
          </View>

          {query.length > 0 && (
            <View style={styles.searchBadge}>
              <Text style={styles.searchBadgeText}>
                Resultados para "{query}"
              </Text>
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Carregando livros...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>📚</Text>
            </View>
            <Text style={styles.emptyTitle}>
              {query ? "Nenhum livro encontrado" : "Nenhum livro cadastrado"}
            </Text>
            <Text style={styles.emptyText}>
              {query
                ? "Tente buscar por outro termo"
                : "Adicione livros ao acervo para começar"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ManageBookCard {...item} onEdit={() => handleEdit(item)} />
            )}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B1220" },
  container: { paddingHorizontal: 16, paddingTop: 12, flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  countNumber: {
    fontSize: 32,
    fontWeight: "900",
    color: "#3B82F6",
    textShadowColor: "rgba(59, 130, 246, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  countLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94A3B8",
  },
  searchBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  searchBadgeText: {
    color: "#60A5FA",
    fontSize: 12,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#94A3B8",
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E2E8F0",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default ManageBooks;
