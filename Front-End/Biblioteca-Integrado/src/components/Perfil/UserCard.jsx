import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { maskRA } from "../../utils/mask";

const UserCard = ({ name, registration, email, phone }) => {
  return (
    <LinearGradient
      colors={["#420a3cff", "#302a63ff"]} // 🔥 gradiente igual ao da imagem
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={32} color="#dce6ff" />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{name || "Nome"}</Text>
          <Text style={styles.meta}>RA: {maskRA(registration) || "—"}</Text>

          <View style={styles.line}>
            <Ionicons name="mail-outline" size={14} color="#c6d1e6" />
            <Text style={styles.metaText}>{email || "—"}</Text>
          </View>

          <View style={styles.line}>
            <Ionicons name="call-outline" size={14} color="#c6d1e6" />
            <Text style={styles.metaText}>{phone || "—"}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 10,
    padding: 16,
    borderRadius: 18,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  info: { flex: 1 },
  name: { color: "#ffffff", fontSize: 18, fontWeight: "700" },
  meta: { color: "#c6d1e6", fontSize: 13, marginTop: 4 },
  line: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  metaText: {
    color: "#c6d1e6",
    fontSize: 13,
    marginLeft: 6,
  },
});

export default UserCard;
