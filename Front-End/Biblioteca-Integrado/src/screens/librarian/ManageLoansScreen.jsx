import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import LibrarianHeader from "../../components/librarian/header/Header";
import ManageLoansList from "../../components/librarian/cardManage/ManageLoansList";
import { MOCK_LOANS } from "../../components/librarian/cardManage/mockLoans";
import api from "../../services/api";

export default function ManageLoansScreen({ navigation }) {
  // Screen owns the loans state and will fetch from backend.
  const [loans, setLoans] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await api.get("/emprestimos");
        // Expecting array; map to front-end shape if necessary
        if (!mounted) return;
        if (Array.isArray(data)) {
          setLoans(
            data.map((d) => ({
              id: String(d.id || d._id || d.uuid),
              student:
                d.usuario_nome ||
                (d.usuario && d.usuario.nome) ||
                d.aluno ||
                "---",
              book:
                d.livro_titulo ||
                (d.livro && d.livro.titulo) ||
                d.livro ||
                "---",
              loanDate: d.data_emprestimo || d.loanDate || null,
              returnDate: d.data_devolucao || d.returnDate || null,
              status:
                d.status ||
                (d.devolvido
                  ? "Devolvido"
                  : d.ativo
                  ? "Ativo"
                  : "Desconhecido"),
            }))
          );
        } else {
          setLoans(MOCK_LOANS);
        }
      } catch (err) {
        console.warn("Erro ao carregar empréstimos:", err);
        Alert.alert(
          "Erro",
          "Não foi possível carregar empréstimos. Verifique o servidor."
        );
        setLoans(MOCK_LOANS);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleMarkReturned(item) {
    // optimistic update
    setLoans((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, status: "Devolvido" } : p))
    );
    try {
      await api.put(`/emprestimos/${item.id}/devolver`);
    } catch (err) {
      console.warn("Erro ao marcar devolvido:", err);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar no servidor. A alteração ficou apenas local."
      );
    }
  }

  async function handleMarkLate(item) {
    // backend doesn't expose explicit 'mark late' endpoint in docs; try a generic update
    setLoans((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, status: "Atrasado" } : p))
    );
    try {
      await api.put(`/emprestimos/${item.id}`, { status: "Atrasado" });
    } catch (err) {
      // if API doesn't support updating status directly, keep local change and notify
      console.warn(
        "Erro ao marcar atrasado (tentar PUT /emprestimos/:id):",
        err
      );
      Alert.alert(
        "Aviso",
        "Marcação como atrasado aplicada localmente. Se necessário, implemente endpoint no backend para persistir essa mudança."
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LibrarianHeader
        title="Gerenciar Empréstimos"
        navigation={navigation}
        iconSecond="list-outline"
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#60A5FA"
          style={{ marginTop: 24 }}
        />
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
  text: { color: "#fff", padding: 16 },
});
