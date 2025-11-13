import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const PendingRequestCard = ({ request, onConfirm, onReject }) => {
  const { studentName, studentId, book, dateRequested, location, status } =
    request;

  // Inline panel / date selection state
  const [panelVisible, setPanelVisible] = useState(false);
  const today = new Date();
  // Normaliza horário para comparação apenas por data
  const normalize = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const todayNorm = normalize(today);
  const maxDate = new Date(todayNorm);
  maxDate.setDate(maxDate.getDate() + 14);

  // default de devolução: 14 dias a partir de hoje (como no screenshot)
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date(todayNorm);
    d.setDate(d.getDate() + 14);
    return d;
  });

  const formatDate = (d) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const incDate = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    if (next <= maxDate) setSelectedDate(next);
  };

  const decDate = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    if (prev >= todayNorm) setSelectedDate(prev);
  };

  const handleConfirmWithDate = () => {
    // garante que a data esteja dentro do intervalo
    const s = normalize(selectedDate);
    if (s < todayNorm || s > maxDate) return;
    setPanelVisible(false);
    if (onConfirm) onConfirm(request, s);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color="#fff" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{studentName}</Text>
          <Text style={styles.userSub}>RA: {studentId}</Text>
        </View>
        <View style={styles.statusWrap}>
          {status === "Retirado" ? (
            <View style={styles.statusRow}>
              <Ionicons name="checkmark-circle" size={16} color="#3bd671" />
              <Text style={[styles.timeText, styles.statusRetirado]}>
                Retirado
              </Text>
            </View>
          ) : (
            <Text style={styles.timeText}>{status}</Text>
          )}
        </View>
      </View>

      <View style={styles.bookRow}>
        <Image source={{ uri: book.cover }} style={styles.cover} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.author}</Text>
          <Text style={styles.availability}>
            {book.available ? "Disponível " : "Indisponível"} • {book.copies}{" "}
            cópias
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>Data: {dateRequested}</Text>
        <Text style={styles.meta}>Localização: {location}</Text>
      </View>

      {!panelVisible && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => setPanelVisible(true)}
            activeOpacity={0.85}
            style={[styles.gradientWrap, { marginRight: 8 }]}
          >
            <LinearGradient
              colors={["#5ec81bff", "#10b953e1"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Confirmar Retirada</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onReject && onReject(request)}
            activeOpacity={0.85}
            style={[styles.gradientWrap, { marginLeft: 8 }]}
          >
            <LinearGradient
              colors={["#fb883cff", "#ef4444d8"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Recusar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Painel inline para escolher data de devolução (dentro do card) */}
      {panelVisible && (
        <View style={styles.panelWrapper}>
          <Text style={styles.panelTitle}>Data de Devolução</Text>

          <View style={styles.inlineRow}>
            <TouchableOpacity onPress={decDate} style={styles.inlineBtn}>
              <Text style={styles.inlineBtnText}>-</Text>
            </TouchableOpacity>

            <View style={styles.inlineDateDisplay}>
              <Text style={styles.inlineDateText}>
                {formatDate(selectedDate)}
              </Text>
              <Text style={styles.inlineNote}>
                Prazo padrão: 14 dias a partir de hoje
              </Text>
            </View>

            <TouchableOpacity onPress={incDate} style={styles.inlineBtn}>
              <Text style={styles.inlineBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inlineActions}>
            <TouchableOpacity
              onPress={handleConfirmWithDate}
              activeOpacity={0.85}
              style={[styles.gradientWrapSmall, { marginRight: 8 }]}
            >
              <LinearGradient
                colors={["#34D399", "#10B981"]}
                start={[0, 0]}
                end={[1, 1]}
                style={[styles.inlineActionBtn]}
              >
                <Text style={styles.inlineActionText}>Confirmar</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPanelVisible(false)}
              activeOpacity={0.85}
              style={[styles.gradientWrapSmall, { marginLeft: 8 }]}
            >
              <LinearGradient
                colors={["#94A3B8", "#6B7280"]}
                start={[0, 0]}
                end={[1, 1]}
                style={[styles.inlineActionBtn]}
              >
                <Text style={styles.inlineActionText}>Cancelar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f1724",
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#29365b",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: { marginLeft: 12, flex: 1 },
  userName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  userSub: { color: "#9aa4c7", fontSize: 12, marginTop: 2 },
  statusWrap: { alignItems: "flex-end" },
  timeText: { color: "#f5c85e", fontSize: 12 },

  bookRow: { flexDirection: "row", marginBottom: 12 },
  cover: { width: 64, height: 88, borderRadius: 6, backgroundColor: "#111" },
  bookInfo: { marginLeft: 12, justifyContent: "center" },
  bookTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  bookAuthor: { color: "#9aa4c7", fontSize: 13, marginTop: 4 },
  availability: { color: "#3bd671", fontSize: 12, marginTop: 6 },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  meta: { color: "#9aa4c7", fontSize: 12 },

  actionsRow: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: 8,
    minHeight: 36,
    position: "relative",
    paddingHorizontal: 12,
  },
  statusRow: { flexDirection: "row", alignItems: "center" },
  statusRetirado: { color: "#3bd671", marginLeft: 8, fontWeight: "700" },
  confirm: { marginRight: 8 },
  reject: { marginLeft: 8 },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
    width: "100%",
  },

  // painel inline (aparece dentro do card)
  panelWrapper: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#0b1626",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#162333",
  },
  panelTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inlineBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#29365b",
    justifyContent: "center",
    alignItems: "center",
  },
  inlineBtnText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  inlineDateDisplay: { flex: 1, alignItems: "center" },
  inlineDateText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  inlineNote: { color: "#9aa4c7", fontSize: 12, marginTop: 4 },
  inlineActions: { flexDirection: "row", justifyContent: "space-between" },
  inlineActionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  inlineConfirm: { marginRight: 8 },
  inlineCancel: { marginLeft: 8 },
  gradientWrap: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  gradientWrapSmall: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  inlineActionText: { color: "#fff", fontWeight: "700" },
});

export default PendingRequestCard;
