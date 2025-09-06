import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import BackgroundImage from "../assets/background.png";
import ProfileHeader from "../components/Profile";
import TabBar from "../components/TagBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { maskRA } from "../utils/mask";

const SearchScreen = ({ navigation }) => {
  const [user, setUser] = useState(null); // Estado para armazenar os dados do usuário

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      const response = await fetch(
        `http://10.10.27.8:3001/api/usuarios/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate("Login");
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header com ícone e título */}
          <View style={styles.headerContainer}>
            <ProfileHeader />
            <Text style={styles.headerTitle}>Seus Dados</Text>
          </View>

          {/* Bloco de informações */}
          <View style={styles.infoBlock}>
            {[
              {
                label: "Nome",
                value: user ? user.nome || "N/A" : "Carregando...",
              },
              {
                label: "RA",
                value: user ? maskRA(user.RA) || "N/A" : "Carregando...",
              },
              {
                label: "E-Mail",
                value: user ? user.email || "N/A" : "Carregando...",
                extraPadding: true,
              },
            ].map((item, index) => (
              <View
                key={index}
                style={[styles.row, item.extraPadding && { marginBottom: 330 }]}
              >
                <View style={styles.labelBox}>
                  <Text style={styles.label}>{item.label}</Text>
                </View>
                <View style={styles.valueBox}>
                  <Text
                    style={styles.valueText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Botão de sair */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="power" size={20} color="#ff4d4d" />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 20,
  },
  infoBlock: {
    width: "100%",
    marginBottom: 40,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  labelBox: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    color: "#000",
  },
  valueBox: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
    marginBlock: 2,
    marginInline: 2,
  },
  valueText: {
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: -20,
  },
  logoutText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "600",
  },
});

export default SearchScreen;
