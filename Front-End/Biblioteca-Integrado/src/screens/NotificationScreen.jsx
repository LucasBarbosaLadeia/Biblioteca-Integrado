import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import BackgroundImage from "../assets/background.png";
import ProfileHeader from "../components/Profile";
import TabBar from "../components/TagBar";
import Notification from "../components/Notification";
import CustomAlert from "../components/CustomAlert";

const NotificationScreen = ({ navigation }) => {
  const [showTelaDesenvolvimento, setShowTelaDesenvolvimento] =
    React.useState(true);
  const [showModelLixeira, setShowModelLixeira] = React.useState(false);
  const book = "O Senhor dos Aneis";

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <CustomAlert
            visible={showTelaDesenvolvimento}
            title="Aviso"
            message={
              "🚧 Tela em Desenvolvimento\nEsta página está em fase de construção. Ela foi adicionada para que você possa visualizar onde a funcionalidade ficará no futuro."
            }
            onClose={() => setShowTelaDesenvolvimento(false)}
            buttonText="OK"
          />
          <CustomAlert
            visible={showModelLixeira}
            title="Aviso"
            message={"FUNCIONALIDADE EM DESENVOLVIMENTO"}
            onClose={() => setShowModelLixeira(false)}
            buttonText="OK"
          />
          <View style={styles.headerContainer}>
            <ProfileHeader />
            <Text style={styles.headerTitle}>Notificação</Text>
          </View>
          <View style={styles.infoBlock}>
            <Notification livro={book} />
            <TouchableOpacity
              onPress={() => setShowModelLixeira(true)}
              style={styles.trashButton}
            >
              <Ionicons name="trash-outline" size={24} color="#ee1a1aff" />
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
    position: "relative",
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
