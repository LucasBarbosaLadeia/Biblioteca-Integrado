import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  FlatList,
  RefreshControl,
} from "react-native";
import ProfileHeader from "../components/Profile";
import TabBar from "../components/TagBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundImage from "../assets/background.png";
import FavoriteCard from "../components/FavoriteCard";
import { API_HOST } from "@env";

const FavoritesScreen = ({ navigation }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarFavoritos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("userId");
      const API = API_HOST;

      const response = await fetch(
        `${API}/api/favoritos/usuario/${usuarioId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setFavoritos(data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarFavoritos();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <ProfileHeader />
            <Text style={styles.headerTitle}>Favoritos</Text>
          </View>

          <View style={styles.containerLista}>
            <Text style={styles.listTitle}>Meus Livros Favoritos</Text>
            <FlatList
              data={favoritos}
              renderItem={({ item }) => (
                <FavoriteCard favorito={item} navigation={navigation} />
              )}
              keyExtractor={(item) => item.id_favorito.toString()}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
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
  containerLista: {
    width: 350,
    height: 600,
    marginBottom: 40,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default FavoritesScreen;
