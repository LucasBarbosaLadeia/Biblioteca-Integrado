import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BackgroundImage from "../assets/background.png";
import BookInfoCard from "../components/BookInfoCard";
import AvailabilityCard from "../components/AvailabilityCard";
import TabBar from "../components/TagBar";

const EspecificacoesLivroScreen = ({ route, navigation }) => {
  // Pega o objeto 'book' que foi passado como parâmetro na navegação
  const { book } = route.params;

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header customizado */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-circle" size={40} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Especificações do livro</Text>
          </View>

          <BookInfoCard book={book} />
          <AvailabilityCard book={book} />
        </ScrollView>
        <TabBar />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  safeArea: { flex: 1, paddingTop: 80 },
  container: { padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 30,
  },
  pdfButton: {
    backgroundColor: "#2ECC71",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },
  pdfButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default EspecificacoesLivroScreen;
