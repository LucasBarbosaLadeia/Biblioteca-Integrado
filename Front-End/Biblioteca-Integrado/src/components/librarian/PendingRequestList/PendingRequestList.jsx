import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../../services/api";
import { getCapaUrl } from "../../../utils/imageUtils";
import PendingRequestCard from "../PendingRequestCard/PendingRequestCard";
import CustomAlert from "../../CustomAlert";

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
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      // Buscar todas as reservas
      const reservasData = await api.get("/reservas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📋 Reservas recebidas:", reservasData);

      // Filtrar apenas PENDENTE (aguardando retirada)
      const reservasPendentes = Array.isArray(reservasData)
        ? reservasData.filter((r) => r.status === "PENDENTE")
        : [];

      // Buscar dados dos livros e usuários
      const requestsWithDetails = await Promise.all(
        reservasPendentes.map(async (reserva) => {
          try {
            const [livroData, usuarioData] = await Promise.all([
              api.get(`/livros/${reserva.livroId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              api.get(`/usuarios/${reserva.alunoId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);

            const livro = livroData?.data || livroData;
            const usuario = usuarioData?.data || usuarioData;

            return {
              id: reserva.id,
              reservaId: reserva.id,
              livroId: reserva.livroId,
              alunoId: reserva.alunoId,
              studentName: usuario?.nome || "Aluno Desconhecido",
              studentId: usuario?.RA || "N/A",
              book: {
                title: livro?.titulo || "Livro Desconhecido",
                author: livro?.autor || "Autor Desconhecido",
                cover: livro?.capa_url
                  ? getCapaUrl(livro.capa_url)
                  : "https://via.placeholder.com/200x300?text=Sem+Capa",
                available: (livro?.qt_atual || 0) > 0,
                copies: livro?.qt_atual || 0,
              },
              dateRequested: new Date(reserva.dataReserva).toLocaleDateString(
                "pt-BR"
              ),
              location: livro?.prateleira || "Não informado",
              status: "Aguardando Retirada",
            };
          } catch (error) {
            console.error("Erro ao buscar detalhes da reserva:", error);
            return null;
          }
        })
      );

      setRequests(requestsWithDetails.filter((r) => r !== null));
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      setAlertType("error");
      setAlertMessage("Erro ao carregar reservas pendentes.");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!query) return requests;
    const q = query.toLowerCase();
    return requests.filter(
      (r) =>
        r.studentName.toLowerCase().includes(q) ||
        r.book.title.toLowerCase().includes(q)
    );
  }, [query, requests]);

  const handleConfirm = async (req, dueDate) => {
    try {
      const token = await AsyncStorage.getItem("token");

      console.log("🔄 Confirmando retirada da reserva:", req.reservaId);

      // Chamar endpoint de retirada
      await api.post(`/reservas/retirar/${req.reservaId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fmt = (d) => {
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
      };

      // Remover da lista
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      setAlertType("success");
      setAlertMessage(
        `✅ Retirada confirmada! O empréstimo foi criado automaticamente. Devolução prevista: ${fmt(
          dueDate
        )}`
      );
      setAlertVisible(true);
    } catch (error) {
      console.error("Erro ao confirmar retirada:", error);
      setAlertType("error");
      setAlertMessage(
        error?.body?.message ||
          error?.message ||
          "Erro ao confirmar retirada. Tente novamente."
      );
      setAlertVisible(true);
    }
  };

  const handleReject = async (req) => {
    try {
      const token = await AsyncStorage.getItem("token");

      console.log("❌ Recusando reserva:", req.livroId, req.alunoId);

      // Cancelar a reserva
      await api.delete(`/reservas/${req.livroId}/${req.alunoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remover da lista
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      setAlertType("success");
      setAlertMessage("Reserva recusada com sucesso.");
      setAlertVisible(true);
    } catch (error) {
      console.error("Erro ao recusar reserva:", error);
      setAlertType("error");
      setAlertMessage(
        error?.body?.message ||
          error?.message ||
          "Erro ao recusar reserva. Tente novamente."
      );
      setAlertVisible(true);
    }
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#47b3ff" />
          <Text style={styles.loadingText}>Carregando reservas...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {query
              ? "Nenhuma reserva encontrada com esse termo."
              : "Nenhuma reserva pendente no momento."}
          </Text>
        </View>
      ) : (
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
      )}

      <CustomAlert
        visible={alertVisible}
        title={alertType === "success" ? "Sucesso" : "Erro"}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        buttonText="OK"
        type={alertType}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#9aa4c7",
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#9aa4c7",
    fontSize: 14,
    textAlign: "center",
  },
});

export default PendingRequestList;
