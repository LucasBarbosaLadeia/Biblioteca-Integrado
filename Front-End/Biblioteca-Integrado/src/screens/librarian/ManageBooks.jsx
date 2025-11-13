import React, { useState } from "react";
import { View, SafeAreaView, FlatList, StyleSheet, Text } from "react-native";
import FilterBar from "../../components/librarian/FilterBar";
import ManageBookCard from "../../components/librarian/ManageBookCard";
import LibrarianHeader from "../../components/librarian/HeaderLibrarian";

const ManageBooks = ({ navigation }) => {
  const [books] = useState(sampleBooks);
  const [query, setQuery] = useState("");
  const [category] = useState("Todas as categorias");

  const handleEdit = (book) => {
    if (navigation && navigation.navigate) {
      navigation.navigate("EditBook", { book });
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

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ManageBookCard {...item} onEdit={() => handleEdit(item)} />
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#071032" },
  container: { paddingHorizontal: 16, paddingTop: 8, flex: 1 },
  countText: { color: "#9fb6e6", marginVertical: 6 },
});

export default ManageBooks;
