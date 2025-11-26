import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../services/api";
import LibrarianHeader from "../../components/librarian/header/Header";
import ManageLoansList from "../../components/librarian/cardManage/ManageLoansList";

export default function ManageLoansScreen({ navigation }) {
  const [loans, setLoans] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLoans();
  }, []);

  async function loadLoans() {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      // Buscar empréstimos
      const emprestimosData = await api.get("/emprestimos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📚 Empréstimos recebidos:", emprestimosData);

      // Extrair o array de empréstimos (pode vir em data.data ou direto em data)
      const emprestimosArray = Array.isArray(emprestimosData)
        ? emprestimosData
        : emprestimosData?.data
        ? emprestimosData.data
        : [];

      if (!Array.isArray(emprestimosArray) || emprestimosArray.length === 0) {
        console.log("ℹ️ Nenhum empréstimo encontrado");
        setLoans([]);
        return;
      }

      console.log("📊 Total de empréstimos:", emprestimosArray.length);

      // Buscar dados dos livros e usuários para cada empréstimo
      const loansWithDetails = await Promise.all(
        emprestimosArray.map(async (emp) => {
          try {
            const [livroData, usuarioData] = await Promise.all([
              api.get(`/livros/${emp.idLivro}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              api.get(`/usuarios/${emp.idUsuario}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);

            const livro = livroData?.data || livroData;
            const usuario = usuarioData?.data || usuarioData;

            return {
              id: String(emp.id),
              idEmprestimo: emp.id,
              student: usuario?.nome || `Usuário ${emp.idUsuario}`,
              studentRA: usuario?.RA || "N/A",
              book: livro?.titulo || `Livro ${emp.idLivro}`,
              bookAuthor: livro?.autor || "Autor Desconhecido",
              loanDate: emp.dataEmprestimo,
              dueDate: emp.dataPrevistaDevolucao,
              returnDate: emp.dataDevolucao,
              status:
                emp.status === "ATIVO"
                  ? "Ativo"
                  : emp.status === "DEVOLVIDO"
                  ? "Devolvido"
                  : emp.status === "ATRASADO"
                  ? "Atrasado"
                  : "Desconhecido",
            };
          } catch (error) {
            console.error("Erro ao buscar detalhes do empréstimo:", error);
            return {
              id: String(emp.id),
              idEmprestimo: emp.id,
              student: `Usuário ${emp.idUsuario}`,
              studentRA: "N/A",
              book: `Livro ${emp.idLivro}`,
              bookAuthor: "Autor Desconhecido",
              loanDate: emp.dataEmprestimo,
              dueDate: emp.dataPrevistaDevolucao,
              returnDate: emp.dataDevolucao,
              status:
                emp.status === "ATIVO"
                  ? "Ativo"
                  : emp.status === "DEVOLVIDO"
                  ? "Devolvido"
                  : emp.status === "ATRASADO"
                  ? "Atrasado"
                  : "Desconhecido",
            };
          }
        })
      );

      console.log("✅ Empréstimos com detalhes:", loansWithDetails.length);
      setLoans(loansWithDetails);
    } catch (err) {
      console.error("Erro ao carregar empréstimos:", err);
      Alert.alert(
        "Erro",
        "Não foi possível carregar empréstimos. Verifique o servidor."
      );
      setLoans([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkReturned(item) {
    try {
      const token = await AsyncStorage.getItem("token");

      console.log("📖 Marcando empréstimo como devolvido:", item.idEmprestimo);

      // Atualizar no backend
      await api.put(`/emprestimos/${item.idEmprestimo}/devolver`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Atualizar estado local
      setLoans((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                status: "Devolvido",
                returnDate: new Date().toISOString(),
              }
            : p
        )
      );

      Alert.alert("Sucesso", "Empréstimo marcado como devolvido!");
    } catch (err) {
      console.error("Erro ao marcar devolvido:", err);
      Alert.alert(
        "Erro",
        err?.body?.message ||
          err?.message ||
          "Não foi possível marcar como devolvido."
      );
    }
  }

  async function handleMarkLate(item) {
    // O status "atrasado" é calculado automaticamente pelo backend
    // baseado na data prevista de devolução
    Alert.alert(
      "Informação",
      "O status 'Atrasado' é calculado automaticamente pelo sistema quando a data prevista de devolução é ultrapassada."
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LibrarianHeader
        title="Gerenciar Empréstimos"
        navigation={navigation}
        iconSecond="list-outline"
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#60A5FA" />
          <Text style={styles.loadingText}>Carregando empréstimos...</Text>
        </View>
      ) : (
        <ManageLoansList
          loans={loans}
          query={query}
          onChangeQuery={setQuery}
          onMarkReturned={handleMarkReturned}
          onMarkLate={handleMarkLate}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#9CA3AF",
    marginTop: 12,
    fontSize: 14,
  },
});
