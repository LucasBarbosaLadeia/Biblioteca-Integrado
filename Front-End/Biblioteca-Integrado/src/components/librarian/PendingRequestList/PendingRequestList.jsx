import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  SafeAreaView,
} from "react-native";
import PendingRequestCard from "../PendingRequestCard/PendingRequestCard";
import CustomAlert from "../../CustomAlert";

const sampleRequests = [
  {
    id: "r1",
    studentName: "Ana Costa",
    studentId: "ST003",
    book: {
      title: "O Hobbit",
      author: "J.R.R. Tolkien",
      cover: "https://picsum.photos/seed/hobbit/200/300",
      available: true,
      copies: 2,
    },
    dateRequested: "22/10/2025",
    location: "Seção F - Prateleira 10",
    status: "Aguardando Retirada",
  },
  {
    id: "r2",
    studentName: "Carlos Silva",
    studentId: "ST010",
    book: {
      title: "Dom Casmurro",
      author: "Machado de Assis",
      cover: "https://picsum.photos/seed/casmurro/200/300",
      available: false,
      copies: 0,
    },
    dateRequested: "01/11/2025",
    location: "Seção B - Prateleira 2",
    status: "Aguardando Retirada",
  },
];

const InfoBox = () => (
  <View style={styles.infoBox}>
    <Text style={styles.infoTitle}>Fluxo de Confirmação</Text>
    <Text style={styles.infoText}>
      Quando o aluno vier retirar o livro fisicamente, confirme a retirada. O
      empréstimo será ativado e o livro marcado como indisponível.
    </Text>
  </View>
);

const PendingRequestList = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [requests, setRequests] = useState(sampleRequests);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const filtered = useMemo(() => {
    if (!query) return requests;
    const q = query.toLowerCase();
    return requests.filter(
      (r) =>
        r.studentName.toLowerCase().includes(q) ||
        r.book.title.toLowerCase().includes(q)
    );
  }, [query, requests]);

  const handleConfirm = (req, dueDate) => {
    const fmt = (d) => {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };
    console.log("Confirmando request", req.id, "dueDate=", dueDate);
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    setAlertMessage(`Retirada confirmada. Devolução: ${fmt(dueDate)}`);
    setAlertVisible(true);
  };

  const handleReject = (req) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Buscar por livro ou aluno..."
        placeholderTextColor="#9aa4c7"
        style={styles.search}
        value={query}
        onChangeText={setQuery}
      />

      <InfoBox />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PendingRequestCard
            request={item}
            onConfirm={handleConfirm}
            onReject={handleReject}
            navigation={navigation}
          />
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      <CustomAlert
        visible={alertVisible}
        title="Sucesso"
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        buttonText="OK"
        type="success"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  search: {
    backgroundColor: "#0b253d",
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: "#081226",
    borderColor: "#1a3b63",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  infoTitle: { color: "#9fb6ff", fontWeight: "700", marginBottom: 6 },
  infoText: { color: "#9aa4c7", fontSize: 13 },
});

export default PendingRequestList;
