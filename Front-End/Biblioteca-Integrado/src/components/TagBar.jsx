import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TabBar = ({ navigator }) => {
  const navigation = useNavigation();

  const handHome = () => {
    navigation.navigate("Home");
  };
  const handNotification = () => {
    navigation.navigate("Notification");
  };

  return (
    <View style={styles.tabBarContainer}>
      <TouchableOpacity style={styles.tabItem} onPress={handHome}>
        <Ionicons name="home" size={24} color="#FFFFFF" />
        <Text style={styles.tabText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={handNotification}>
        <Ionicons name="notifications" size={24} color="#FFFFFF" />
        <Text style={styles.tabText}>Notificação</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="sunny" size={24} color="#FFFFFF" />
        <Text style={styles.tabText}>Tema</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(173, 216, 230, 0.3)", // Azul claro transparente
    paddingVertical: 13,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    position: "absolute", // Fixa na parte inferior
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  tabText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 4,
  },
});

export default TabBar;
