import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import BackgroundImage from "../assets/background.png";
import ProfileHeader from "../components/Profile";
import TabBar from "../components/TagBar";
import Notification from "../components/Notification";

const NotificationScreen = ({ navigator }) => {
  const book = "O Senhor dos Aneis";

  const handleClearNotifications = () => {
    Alert.alert(
      "Apagar todas?",
      "Você tem certeza que deseja apagar todas as notificações?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Apagar", onPress: () => console.log("Notificações apagadas") },
      ]
    );
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <ProfileHeader />
            <Text style={styles.headerTitle}>Notificação</Text>
          </View>

          {/* Info Block */}
          <View style={styles.infoBlock}>
            <Notification livro={book} />

            {/* Botão de apagar no canto inferior direito */}
            <TouchableOpacity
              onPress={handleClearNotifications}
              style={styles.trashButton}
            >
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 20,
  },
  infoBlock: {
    width: 350,
    height: 600,
    marginBottom: 40,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    position: "relative", // necessário para o botão absoluto funcionar dentro
  },
  trashButton: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 30,
  },
});

export default NotificationScreen;
