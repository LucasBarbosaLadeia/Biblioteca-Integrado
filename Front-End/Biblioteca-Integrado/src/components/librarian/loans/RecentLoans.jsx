import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import LoanCard from "./LoanCard";
import { api } from "../../../services/api";

const RecentLoans = ({ limit = 4 }) => {
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchRecent = async () => {
      try {
        const body = await api.get(`emprestimos?page=1&limit=${limit}`);
        const data = body?.data ?? [];
        if (!mounted) return;
        setLoans(data);
      } catch (e) {
        // fallback: keep empty
        console.error("Erro fetching recent loans", e);
        if (mounted) setLoans([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRecent();
    return () => (mounted = false);
  }, [limit]);

  if (loading) return <ActivityIndicator color="#fff" />;

  if (!loans || loans.length === 0) {
    return <Text style={styles.empty}>Nenhum empréstimo recente.</Text>;
  }

  return (
    <View style={styles.container}>
      {loans.map((l) => (
        <LoanCard
          key={l.id_emprestimo}
          borrower={l?.usuario?.nome || "—"}
          title={l?.livro?.titulo || "—"}
          dueDate={l?.data_devolucao_prevista}
          status={l?.status}
          returnDate={l?.data_devolucao_real}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  empty: {
    color: "#9ca3af",
    fontStyle: "italic",
    marginTop: 4,
    marginHorizontal: 12,
  },
});

export default RecentLoans;
