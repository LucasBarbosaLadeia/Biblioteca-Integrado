import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../../services/api";
import { unmaskRA } from "../../../utils/mask";

const COLORS = {
  card: "#0b1320",
  input: "#0f1a2b",
  muted: "#9aa0b6",
  accent: "#2f8cff",
};

const StudentSelector = ({ onSelect, selectedStudent, onBack }) => {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await api.get("usuarios?page=1&limit=500");
        const data = res?.data || [];
        if (!mounted) return;
        // filter only alunos
        const alunos = data.filter((u) => (u.tipo || u.type) === "aluno");
        setStudents(alunos);
      } catch (e) {
        console.error("Erro fetching usuarios", e);
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => (mounted = false);
  }, []);

  const filtered = students.filter((s) => {
    const name = (s.nome || s.name || "").toLowerCase();
    const ra = (s.RA || s.ra || s.registration || "").toString();
    const raDigits = unmaskRA(ra);

    const q = (query || "").trim();

    // empty query -> return all
    if (!q) return true;

    // if query contains any letters, match by name
    if (/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(q)) {
      return name.includes(q.toLowerCase());
    }

    // otherwise try matching by RA digits
    const digits = unmaskRA(q);
    if (digits) {
      return raDigits.includes(digits);
    }

    // fallback to name match
    return name.includes(q.toLowerCase());
  });

  const renderItem = ({ item }) => {
    const id = item.id_usuario || item.id || item._id;
    const active =
      selectedStudent &&
      (selectedStudent.id_usuario === id || selectedStudent.id === id);
    const name = item.nome || item.name || "—";
    const course = item.curso || item.course || "";
    const ra = item.RA || item.ra || "";
    return (
      <TouchableOpacity
        style={[styles.card, active && styles.cardActive]}
        onPress={() => onSelect && onSelect(item)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0)}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.sub}>{course}</Text>
          <Text style={styles.reg}>RA: {ra}</Text>
        </View>
        <View style={styles.iconWrap}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>2. Escolha o aluno</Text>
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => onBack && onBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardWrap}>
        <TextInput
          placeholder="Nome ou RA do aluno..."
          placeholderTextColor={COLORS.muted}
          style={styles.input}
          value={query}
          onChangeText={(t) => setQuery(t)}
        />

        <FlatList
          data={filtered}
          keyExtractor={(i) =>
            i.id_usuario || i.id || i._id || Math.random().toString()
          }
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={() => (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                {loading ? "Carregando..." : "Nenhum aluno encontrado."}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, flex: 1 },
  header: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 0 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  backLink: { alignItems: "center" },
  backText: { color: "#9fb6ff" },
  cardWrap: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    flex: 1,
  },
  input: {
    backgroundColor: COLORS.input,
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f2a3b",
  },
  emptyWrap: { padding: 20, alignItems: "center" },
  emptyText: { color: COLORS.muted },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#071028",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
  cardActive: { borderColor: COLORS.accent, borderWidth: 1.5 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#243248",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconWrap: { marginLeft: 8 },
  avatarText: { color: "#fff", fontWeight: "700" },
  meta: { flex: 1 },
  name: { color: "#fff", fontWeight: "600" },
  sub: { color: "#90a0b3", fontSize: 12 },
  reg: { color: "#8fa0b3", fontSize: 11, marginTop: 6 },
});

export default StudentSelector;
