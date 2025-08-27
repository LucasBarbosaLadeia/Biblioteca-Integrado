import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Text,
} from "react-native";

// Importe os componentes que criamos
import MenuButton from "../components/Botao";
import ProfileHeader from "../components/Profile";
import TabBar from "../components/TagBar";

// Importe a imagem de fundo
import BackgroundImage from "../assets/background.png";

const user = {
  name: "João Silva",
};

const HomeScreen = ({ navigation }) => {
  const handPesquisar = () => {
    navigation.navigate("Pesquisa");
  };
  const handMeusLivros = () => {
    console.log("Meus Livros");
  };
  const handMeusDados = () => {
    console.log("Meus Dados");
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* 1. Cabeçalho */}
          <View style={styles.headerContainer}>
            <View style={styles.profileRow}>
              <ProfileHeader />
              <Text style={styles.userName}>Olá, {user.name}</Text>
            </View>
          </View>
          {/* 2. Menu Principal */}
          <View style={styles.menuContainer}>
            <MenuButton
              title="Buscar Livros"
              iconName="search"
              onPress={() => handPesquisar("Pesquisa")}
              style={{ marginBottom: 30 }}
            />
            <MenuButton
              title="Meus Livros"
              iconName="book"
              onPress={() => console.log("Meus Livros")}
              style={{ marginBottom: 30 }}
            />
            <MenuButton
              title="Meus Dados"
              iconName="profile"
              onPress={() => console.log("Meus Dados")}
              style={{ marginBottom: 330 }}
            />
          </View>
        </View>
        {/* 3. Rodapé */}
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
    flexDirection: "row", // Adicione esta linha
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  menuContainer: {
    width: "100%",
    marginTop: 20,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
});

export default HomeScreen;
