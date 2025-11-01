import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import BackgroundImage from "../../assets/background.png";
import NotificationHeader from "./components/Notification/NotificationHeader";
import TabBar from "./components/home/TagBar";
import NotificationList from "./components/Notification/NotificationList";
import CustomAlert from "../../components/feedback/CustomAlert";

const NotificationScreen = ({ navigation }) => {
  const [showTelaDesenvolvimento, setShowTelaDesenvolvimento] =
    React.useState(true);
  const [showModelLixeira, setShowModelLixeira] = React.useState(false);
  const book = "O Senhor dos Aneis";

  return (
    <View source={BackgroundImage} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
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

        <View style={styles.page}>
          <View style={styles.headerContainer}>
            <NotificationHeader navigation={navigation} unreadCount={2} />
          </View>
          <View style={styles.NotificationContainer}>
            <NotificationList />
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
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
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
    paddingBottom: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 20,
  },
  NotificationContainer: {
    flex: 1,
    marginTop: 15,
  },
  trashButton: {
    position: "absolute",
    backgroundColor: "#481414ff",
    bottom: 10,
    right: 10,
    padding: 10,
    borderRadius: 30,
  },
});

export default NotificationScreen;
