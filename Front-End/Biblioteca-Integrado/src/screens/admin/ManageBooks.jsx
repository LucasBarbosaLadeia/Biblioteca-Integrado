import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../services/api";
import SearchBar from "../../components/admin/manageBooks/SearchBar";
import CategoryFilter from "../../components/admin/manageBooks/CategoryFilter";
import BookCard from "../../components/admin/manageBooks/BookCard";
import StyledAlert from "../../components/common/StyledAlert";

const ManageBooks = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // use centralized API helper

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      try {
        const json = await api.get("categorias");
        if (!mounted) return;
        setCategories(json?.data || []);
      } catch (e) {
        console.warn("Erro ao buscar categorias", e);
      }
    };

    fetchCategories();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadBooks = async () => {
      setLoading(true);
      try {
        const q = search ? `&search=${encodeURIComponent(search)}` : "";
        const cat = category ? `&categoria=${category}` : "";
        const json = await api.get(`livros?page=1&limit=20${q}${cat}`);
        if (!mounted) return;
        const data = json?.data || [];
        setBooks(data);
      } catch (e) {
        console.warn("Erro ao buscar livros", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // small debounce
    const t = setTimeout(loadBooks, 300);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [search, category]);

  // Reload books when screen gains focus (e.g., after returning from EditBook)
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // immediate fetch without debounce
      (async () => {
        try {
          setLoading(true);
          const q = search ? `&search=${encodeURIComponent(search)}` : "";
          const cat = category ? `&categoria=${category}` : "";
          const json = await api.get(`livros?page=1&limit=20${q}${cat}`);
          const data = json?.data || [];
          setBooks(data);
        } catch (e) {
          console.warn("Erro ao recarregar livros ao focar tela", e);
        } finally {
          setLoading(false);
        }
      })();
    });

    return unsubscribe;
  }, [navigation, search, category]);

  const handleEdit = (book) => {
    // placeholder: navigate to edit screen if exists
    if (navigation && navigation.navigate) {
      navigation.navigate("EditBook", { bookId: book.id_livro || book.id });
    } else {
      console.log("Editar livro");
    }
  };

  const handleDelete = (book) => {
    const id = book.id_livro ?? book.id;
    // show styled confirmation
    setAlertData({
      title: "Confirmar exclusão",
      message: `Excluir "${
        book.titulo || book.title || ""
      }"? Esta ação não poderá ser desfeita.`,
      type: "error",
      confirmText: "Excluir",
      cancelText: "Cancelar",
      onCancel: () => setAlertVisible(false),
      onConfirm: async () => {
        // close confirm first
        setAlertVisible(false);
        try {
          setLoading(true);
          try {
            await api.delete(`livros/${id}`);
            setBooks((prev) => prev.filter((b) => (b.id_livro ?? b.id) !== id));
          } catch (err) {
            const json = err?.body || {};
            setAlertData({
              title: "Erro",
              message: json?.message || "Falha ao excluir livro",
              type: "error",
              onConfirm: () => setAlertVisible(false),
              confirmText: "OK",
            });
            setAlertVisible(true);
          }
        } catch (e) {
          console.warn("Erro ao excluir livro", e);
          setAlertData({
            title: "Erro",
            message: "Falha ao excluir livro",
            type: "error",
            onConfirm: () => setAlertVisible(false),
            confirmText: "OK",
          });
          setAlertVisible(true);
        } finally {
          setLoading(false);
        }
      },
    });
    setAlertVisible(true);
  };

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({});

  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() =>
              navigation && navigation.goBack && navigation.goBack()
            }
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={22} color="#9fb0c8" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.title}>Gerenciar Livros</Text>
            <Text style={styles.subtitle}>{books.length} livros</Text>
          </View>
          <Ionicons name="book-outline" size={22} color="#9fb0c8" />
        </View>

        <FlatList
          data={books}
          keyExtractor={(item, idx) => String(item.id_livro ?? item.id ?? idx)}
          renderItem={({ item }) => (
            <BookCard book={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          ListEmptyComponent={
            <Text style={{ color: "#9fb0c8", marginTop: 8 }}>
              {loading ? "Carregando..." : "Nenhum livro encontrado"}
            </Text>
          }
          contentContainerStyle={[styles.container, { paddingBottom: 60 }]}
          ListHeaderComponent={() => (
            <View>
              <SearchBar value={search} onChange={setSearch} />
              <CategoryFilter
                categories={categories}
                selectedId={category}
                onSelect={(id) => setCategory(id)}
              />
            </View>
          )}
          keyboardShouldPersistTaps="handled"
        />
        <StyledAlert
          visible={alertVisible}
          title={alertData.title}
          message={alertData.message}
          type={alertData.type}
          onConfirm={alertData.onConfirm}
          onCancel={alertData.onCancel}
          confirmText={alertData.confirmText}
          cancelText={alertData.cancelText}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#020618" },
  safe: { flex: 1 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#061248ff",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "800" },
  subtitle: { color: "#9fb0c8", fontSize: 12 },
  container: { padding: 16 },
});

export default ManageBooks;
