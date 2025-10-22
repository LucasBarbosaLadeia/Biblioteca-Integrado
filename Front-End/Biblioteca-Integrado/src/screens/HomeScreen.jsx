import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Text, FlatList } from "react-native";
import TabBar from "../components/TagBar";
import HomeHeader from "../components/home/HomeHeader";
import SearchBarWithFilter from "../components/home/SearchBarWithFilter";
import SectionHeader from "../components/home/SectionHeader";
import BookCard from "../components/home/BookCard";
import CleanCodeCover from "../assets/Clean-Code.jpg";

const mockBooks = [
  {
    id: "1",
    title: "Harry Potter",
    autor: "J.K. Rowling",
    cover: CleanCodeCover,
  },
  {
    id: "2",
    title: "Way of Kings",
    autor: "Brandon Sanderson",
    cover: CleanCodeCover,
  },
  {
    id: "3",
    title: "Mistborn",
    autor: "Brandon Sanderson",
    cover: CleanCodeCover,
  },
];
const mockBooksRecommended = [
  {
    id: "4",
    title: "The Hobbit",
    autor: "J.R.R. Tolkien",
    cover: CleanCodeCover,
  },
  { id: "5", title: "1984", autor: "George Orwell", cover: CleanCodeCover },
  {
    id: "6",
    title: "To Kill a Mockingbird",
    autor: "Harper Lee",
    cover: CleanCodeCover,
  },
];

//

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState({});

  const onSearch = () => navigation.navigate("Pesquisa");
  const onFilter = () => navigation.navigate("Pesquisa");

  const toggleFav = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openBook = (book) => {
    navigation.navigate("EspecificacoesLivro", {
      book: { title: book.title, coverImage: book.cover },
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.page}>
          <HomeHeader
            onMenuPress={() => {}}
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

          <SectionHeader title="Popular Books" onPress={() => {}} />
          <FlatList
            data={mockBooks}
            horizontal
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingRight: 8 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <BookCard
                imageSource={item.cover}
                title={item.title}
                price={item.price}
                isFavorite={!!favorites[item.id]}
                onToggleFavorite={() => toggleFav(item.id)}
                onPress={() => openBook(item)}
              />
            )}
            style={{ marginTop: 8 }}
          />

          <SectionHeader title="Recommended Books" />
          <FlatList
            data={mockBooksRecommended}
            horizontal
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingRight: 8 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <BookCard
                imageSource={item.cover}
                title={item.title}
                price={item.price}
                isFavorite={!!favorites[item.id]}
                onToggleFavorite={() => toggleFav(item.id)}
                onPress={() => openBook(item)}
              />
            )}
            style={{ marginTop: 8 }}
          />
        </View>
        <TabBar />
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
