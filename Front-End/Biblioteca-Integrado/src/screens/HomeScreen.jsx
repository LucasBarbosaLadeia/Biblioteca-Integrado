import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Text,
} from "react-native";

import MenuButton from "../components/Botao";
import ProfileHeader from "../components/Profile";
import TabBar from "../components/TagBar";
import { useEffect, useState } from "react";
import BackgroundImage from "../assets/background.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_HOST } from "@env";
import getFirstAndLast from "../utils/name";

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  // Utilitário de nome movido para src/utils/name.jsx

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      const API = API_HOST;
      const response = await fetch(`${API}/api/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handPesquisar = () => {
    navigation.navigate("Pesquisa");
  };
  const handFavoritos = () => {
    navigation.navigate("Favoritos");
  };
  const handMeusDados = () => {
    navigation.navigate("YourDetails");
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.profileRow}>
              <ProfileHeader />
              <Text
                style={styles.userName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Olá, {user ? getFirstAndLast(user.nome) : "Carregando..."}
              </Text>
            </View>
          </View>
          <View style={styles.menuContainer}>
            <MenuButton
              title="Buscar Livros"
              iconName="search"
              onPress={() => handPesquisar("Pesquisa")}
              style={{ marginBottom: 30 }}
            />
            <MenuButton
              title="Favoritos"
              iconName="book"
              onPress={() => handFavoritos("Favoritos")}
              style={{ marginBottom: 30 }}
            />
            <MenuButton
              title="Meus Dados"
              iconName="profile"
              onPress={() => handMeusDados("Meus Dados")}
              style={{ marginBottom: 330 }}
            />
          </View>
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
    flex: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 50,
  },
  headerContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: "100%",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    maxWidth: "70%",
    flexShrink: 1,
  },
  menuContainer: {
    width: 350,
    height: 600,
    marginBottom: 40,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Fundo branco com transparência
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)", // Borda branca com transparência
  },
});

export default HomeScreen;
