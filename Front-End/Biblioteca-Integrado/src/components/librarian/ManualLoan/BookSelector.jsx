import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../../services/api";
import { getCapaUrl } from "../../../utils/imageUtils";

const COLORS = {
  bg: "#071025",
  card: "#0b1320",
  accent: "#2f8cff",
  muted: "#9aa0b6",
  input: "#0f1a2b",
};

const BookSelector = ({ onSelect, selectedBook }) => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await api.get("livros/disponiveis?page=1&limit=200");
        const data = res?.data || [];
        if (!mounted) return;
        setBooks(data);
      } catch (e) {
        console.error("Erro fetching livros disponiveis", e);
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => (mounted = false);
  }, []);

  const filtered = books.filter((b) => {
    const title = (b.titulo || b.title || "").toLowerCase();
    const author = (b.autor || b.author || "").toLowerCase();
    return (
      title.includes(query.toLowerCase()) ||
      author.includes(query.toLowerCase())
    );
  });

  const renderItem = ({ item }) => {
    const id = item.id_livro || item.id || item._id;
    const active =
      selectedBook && (selectedBook.id_livro === id || selectedBook.id === id);
    const title = item.titulo || item.title || "—";
    const author = item.autor || item.author || "—";
    return (
      <TouchableOpacity
        style={[styles.card, active && styles.cardActive]}
        onPress={() => onSelect && onSelect(item)}
      >
        <View style={styles.imageWrap}>
          <Image
            source={
              item.capa_url
                ? { uri: getCapaUrl(item.capa_url) }
                : require("../../../assets/Clean-Code.jpg")
            }
            style={styles.cover}
          />
        </View>
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.author}>{author}</Text>
        </View>
        <View style={styles.iconWrap}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>1. Escolha o livro</Text>

      <View style={styles.cardWrap}>
        <TextInput
          placeholder="Digite o título ou autor..."
          placeholderTextColor={COLORS.muted}
          style={styles.input}
          value={query}
          onChangeText={setQuery}
        />

        <FlatList
          data={filtered}
          keyExtractor={(i) =>
            i.id_livro || i.id || i._id || Math.random().toString()
          }
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={() => (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                {loading ? "Carregando..." : "Nenhum livro encontrado."}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, flex: 1 },
  header: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 10 },
  cardWrap: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    flex: 1,
  },
  input: {
    backgroundColor: COLORS.input,
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f2a3b",
  },
  emptyWrap: { padding: 20, alignItems: "center" },
  emptyText: { color: COLORS.muted },
  card: {
    flexDirection: "row",
    backgroundColor: "#071028",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
  iconWrap: { marginLeft: 8 },
  cardActive: { borderColor: COLORS.accent, borderWidth: 1.5 },
  cover: { width: 56, height: 78, borderRadius: 8, backgroundColor: "#263244" },
  imageWrap: { marginRight: 12 },
  meta: { flex: 1 },
  title: { color: "#fff", fontWeight: "600" },
  author: { color: "#90a0b3", fontSize: 12, marginTop: 4 },
});

export default BookSelector;
