import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import LibrarianHeader from "../../components/librarian/header/Header";
import PendingRequestList from "../../components/librarian/PendingRequestList/PendingRequestList";

export default function PendingRequestsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LibrarianHeader
        title="Solicitações Pendentes"
        navigation={navigation}
        iconSecond="notifications-outline"
      />

      <PendingRequestList navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071025" },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#061248ff",
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  subtitle: { color: "#9fb0c8", fontSize: 14, marginTop: 4 },
});
