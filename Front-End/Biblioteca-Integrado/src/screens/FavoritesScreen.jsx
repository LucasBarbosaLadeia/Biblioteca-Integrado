import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BackgroundImage from "../assets/background.png";
import ProfileHeader from "../components/Profile";
import BookInfoCard from "../components/BookInfoCard"; // seu componente aqui
import TabBar from "../components/TagBar";

// Lista de favoritos fake (simulando livros)
const favoriteBooks = [
  {
    title: "Clean Code",
    author_name: ["Robert C. Martin"],
    first_publish_year: 2008,
    subject: ["Software Engineering"],
    number_of_pages_median: 464,
    coverImage: require("../assets/Clean-Code.jpg"), // imagem local
  },
  {
    title: "Design Patterns",
    author_name: ["Erich Gamma"],
    first_publish_year: 1994,
    subject: ["Architecture"],
    number_of_pages_median: 395,
    coverImage: require("../assets/Clean-Code.jpg"),
  },
  {
    title: "The Pragmatic Programmer",
    author_name: ["Andrew Hunt"],
    first_publish_year: 1999,
    subject: ["Programming"],
    number_of_pages_median: 352,
    coverImage: require("../assets/Clean-Code.jpg"),
  },
];

const FavoritesScreen = ({ navigation }) => {
  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <ProfileHeader />
            <Text style={styles.headerTitle}>Favoritos</Text>
          </View>

          {/* Lista de favoritos */}
          <ScrollView contentContainerStyle={styles.listContainer}>
            {favoriteBooks.map((book, index) => (
              <BookInfoCard
                key={index}
                book={book}
                onPress={() => navigation.navigate("BookDetails", { book })}
              />
            ))}
          </ScrollView>
        </View>
        <TabBar />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 50,
    paddingBottom: 75,
  },
  headerContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 20,
  },
  listContainer: {
    width: "100%",
    paddingBottom: 100,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "600",
  },
});

export default FavoritesScreen;
