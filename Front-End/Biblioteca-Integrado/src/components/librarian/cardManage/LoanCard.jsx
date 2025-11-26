import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LoanCard({ loan = {}, onMarkReturned, onMarkLate }) {
  const {
    student = "Aluno Desconhecido",
    studentRA = "N/A",
    book = "Livro Desconhecido",
    bookAuthor = "Autor Desconhecido",
    loanDate,
    dueDate,
    returnDate,
    status = "Desconhecido",
  } = loan;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const statusConfig =
    status === "Ativo"
      ? {
          colors: ["#3B82F6", "#2563EB"],
          icon: "time-outline",
          textColor: "#EFF6FF",
        }
      : status === "Devolvido"
      ? {
          colors: ["#10B981", "#059669"],
          icon: "checkmark-circle",
          textColor: "#D1FAE5",
        }
      : {
          colors: ["#EF4444", "#DC2626"],
          icon: "alert-circle",
          textColor: "#FEE2E2",
        };

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={["#1E293B", "#0F172A"]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header com Avatar e Status */}
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#3B82F6", "#1D4ED8"]}
              style={styles.avatar}
            >
              <Ionicons name="person" size={24} color="#fff" />
            </LinearGradient>
          </View>

          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student}</Text>
            <View style={styles.raContainer}>
              <Ionicons name="card-outline" size={12} color="#94A3B8" />
              <Text style={styles.studentRA}>RA: {studentRA}</Text>
            </View>
          </View>

          <LinearGradient
            colors={statusConfig.colors}
            style={styles.statusBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons
              name={statusConfig.icon}
              size={14}
              color={statusConfig.textColor}
            />
            <Text
              style={[styles.statusText, { color: statusConfig.textColor }]}
            >
              {status}
            </Text>
          </LinearGradient>
        </View>

        {/* Informações do Livro */}
        <View style={styles.bookSection}>
          <View style={styles.bookIconContainer}>
            <Ionicons name="book" size={20} color="#60A5FA" />
          </View>
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={1}>
              {book}
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {bookAuthor}
            </Text>
          </View>
        </View>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Datas */}
        <View style={styles.datesSection}>
          <View style={styles.dateItem}>
            <View style={styles.dateIconContainer}>
              <Ionicons name="calendar-outline" size={16} color="#60A5FA" />
            </View>
            <View>
              <Text style={styles.dateLabel}>Empréstimo</Text>
              <Text style={styles.dateValue}>{formatDate(loanDate)}</Text>
            </View>
          </View>

          <View style={styles.dateItem}>
            <View style={styles.dateIconContainer}>
              <Ionicons name="calendar" size={16} color="#F59E0B" />
            </View>
            <View>
              <Text style={styles.dateLabel}>Prazo</Text>
              <Text style={styles.dateValue}>{formatDate(dueDate)}</Text>
            </View>
          </View>

          {returnDate && (
            <View style={styles.dateItem}>
              <View style={styles.dateIconContainer}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              </View>
              <View>
                <Text style={styles.dateLabel}>Devolvido</Text>
                <Text style={styles.dateValue}>{formatDate(returnDate)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Ações */}
        {status === "Ativo" && (
          <View style={styles.actionsSection}>
            <TouchableOpacity
              onPress={() => onMarkReturned && onMarkReturned(loan)}
              style={styles.actionButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="checkmark-done" size={18} color="#fff" />
                <Text style={styles.actionText}>Marcar Devolvido</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#F1F5F9",
    marginBottom: 4,
  },
  raContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  studentRA: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  bookSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  bookIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#E2E8F0",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 13,
    color: "#94A3B8",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(148, 163, 184, 0.15)",
    marginVertical: 12,
  },
  datesSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  dateLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 2,
    fontWeight: "500",
  },
  dateValue: {
    fontSize: 13,
    color: "#E2E8F0",
    fontWeight: "600",
  },
  actionsSection: {
    marginTop: 4,
  },
  actionButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  actionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
