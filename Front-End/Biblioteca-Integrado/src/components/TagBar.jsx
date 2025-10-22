import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomAlert from "./CustomAlert";

const TabBar = ({ navigator }) => {
  const navigation = useNavigation();
  const [showAlertaTema, setShowAlertaTema] = React.useState(false);

  const handHome = () => {
    navigation.navigate("Home");
  };
  const handNotification = () => {
    navigation.navigate("Notification");
  };
  const alertaTema = () => {
    setShowAlertaTema(true);
  };

  return (
    <View style={styles.tabBarContainer}>
      <CustomAlert
        visible={showAlertaTema}
        title="Aviso"
        message={"FUNCIONALIDADE EM DESENVOLVIMENTO"}
        onClose={() => setShowAlertaTema(false)}
        buttonText="OK"
      />
      <TouchableOpacity style={styles.tabItem} onPress={handHome}>
        <Ionicons name="home" size={24} color="#51A2FF" />
        <Text style={styles.tabText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={handNotification}>
        <Ionicons name="notifications" size={24} color="#51A2FF" />
        <Text style={styles.tabText}>Notificação</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={alertaTema}>
        <Ionicons name="sunny" size={24} color="#51A2FF" />
        <Text style={styles.tabText}>Tema</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 30,
    marginHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingVertical: 10,
    borderRadius: 150,
    marginBottom: 20,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  tabText: {
    color: "#51A2FF",
    fontSize: 12,
    marginTop: 4,
  },
});

export default TabBar;
