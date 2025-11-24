import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ReservationCard = ({ item, onPress }) => {
  const isInQueue = item.posicaoFila !== null && item.posicaoFila !== undefined;
  const hasDeadline = item.dataLimiteRetirada !== null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const getTimeRemaining = (deadline) => {
    if (!deadline) return null;
    try {
      const now = new Date();
      const end = new Date(deadline);
      const diff = end - now;

      if (diff <= 0) return "Expirado";

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours < 24) {
        return `${hours}h ${minutes}min restantes`;
      }

      const days = Math.floor(hours / 24);
      return `${days} dia${days > 1 ? "s" : ""} restante${days > 1 ? "s" : ""}`;
    } catch {
      return null;
    }
  };

  const timeRemaining = hasDeadline
    ? getTimeRemaining(item.dataLimiteRetirada)
    : null;
  const isExpiringSoon = timeRemaining && timeRemaining.includes("h");

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="book" size={24} color="#47b3ff" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.bookTitle || `Livro #${item.livroId}`}
          </Text>
          {isInQueue ? (
            <View style={[styles.badge, styles.badgeQueue]}>
              <Ionicons name="people" size={12} color="#F59E0B" />
              <Text style={styles.badgeText}>
                Posição {item.posicaoFila} na fila
              </Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeActive]}>
              <Ionicons name="checkmark-circle" size={12} color="#10B981" />
              <Text style={styles.badgeText}>Reserva Ativa</Text>
            </View>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#64748b" />
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#94a3b8" />
          <Text style={styles.detailLabel}>Reservado em:</Text>
          <Text style={styles.detailValue}>{formatDate(item.dataReserva)}</Text>
        </View>

        {hasDeadline && (
          <View style={styles.detailRow}>
            <Ionicons
              name="time-outline"
              size={16}
              color={isExpiringSoon ? "#f59e0b" : "#94a3b8"}
            />
            <Text style={styles.detailLabel}>Prazo:</Text>
            <Text style={[styles.detailValue, isExpiringSoon && styles.urgent]}>
              {timeRemaining}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: 6,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgeActive: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  badgeQueue: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f1f5f9",
  },
  divider: {
    height: 1,
    backgroundColor: "#334155",
    marginVertical: 12,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#cbd5e1",
    fontWeight: "600",
    flex: 1,
  },
  urgent: {
    color: "#f59e0b",
    fontWeight: "700",
  },
});

export default ReservationCard;
