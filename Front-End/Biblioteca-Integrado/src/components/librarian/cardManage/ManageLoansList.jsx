import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LoanCard from "./LoanCard";
import LoanSummaryHeader from "./LoanSummaryHeader";

// This component is now presentational: it receives `loans`, `query` and handlers from the parent (screen).
// That makes it easy for the screen to fetch from API and pass the data here.

export default function ManageLoansList({
  loans = [],
  query = "",
  onChangeQuery = () => {},
  onMarkReturned = () => {},
  onMarkLate = () => {},
}) {
  const filtered = loans.filter(
    (d) =>
      d.student.toLowerCase().includes(query.toLowerCase()) ||
      d.book.toLowerCase().includes(query.toLowerCase())
  );

  // Ordenar: Ativos primeiro, depois Atrasados, depois Devolvidos
  const sorted = filtered.sort((a, b) => {
    const statusOrder = { Ativo: 0, Atrasado: 1, Devolvido: 2 };
    return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
  });

  const counts = useMemo(() => {
    return {
      todos: loans.length,
      ativos: loans.filter((d) => d.status === "Ativo").length,
      atrasados: loans.filter((d) => d.status === "Atrasado").length,
      devolvidos: loans.filter((d) => d.status === "Devolvido").length,
    };
  }, [loans]);

  return (
    <View style={styles.container}>
      <LoanSummaryHeader counts={counts} />

      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={18}
            color="#9CA3AF"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Buscar por livro ou aluno..."
            placeholderTextColor="#9CA3AF"
            style={styles.search}
            value={query}
            onChangeText={onChangeQuery}
          />
        </View>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LoanCard
            loan={item}
            onMarkReturned={onMarkReturned}
            onMarkLate={onMarkLate}
          />
        )}
        contentContainerStyle={{ paddingVertical: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchWrap: { paddingHorizontal: 12, marginBottom: 8 },
  searchBox: {
    backgroundColor: "#0B1220",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  search: {
    flex: 1,
    color: "#E6EEF3",
  },
});
