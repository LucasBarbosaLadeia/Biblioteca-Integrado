import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useWindowDimensions } from "react-native";

const Badge = ({ text, color, compact }) => (
  <View
    style={[
      styles.badge,
      compact ? styles.badgeCompact : null,
      { backgroundColor: color },
    ]}
  >
    <Text style={[styles.badgeText, compact ? styles.badgeTextCompact : null]}>
      {text}
    </Text>
  </View>
);

const LoanCard = ({ borrower, title, dueDate, status, returnDate }) => {
  const { width } = useWindowDimensions();
  const compact = width < 400;
  // dueDate and returnDate expected as ISO strings
  const today = new Date();
  const due = dueDate ? new Date(dueDate) : null;
  const returnedAt = returnDate ? new Date(returnDate) : null;
  let badge = null;

  // priority: if returned, show devolvido; else if overdue show atrasado; else show days remaining
  if (status === "devolvido") {
    badge = { text: "Devolvido", color: "#059669" };
  } else if (due) {
    const diffMs = due.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      badge = { text: "Atrasado", color: "#dc2626" };
    } else {
      badge = { text: `${diffDays}d restantes`, color: "#b45309" };
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.rowTop}>
        <Text
          style={[styles.borrower, compact ? styles.borrowerCompact : null]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {borrower}
        </Text>
        {badge ? (
          <Badge text={badge.text} color={badge.color} compact={compact} />
        ) : null}
      </View>

      <Text
        style={[styles.bookTitle, compact ? styles.bookTitleCompact : null]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {title}
      </Text>

      {status === "devolvido" ? (
        <Text style={styles.due}>
          {returnedAt
            ? `Devolvido: ${returnedAt.toLocaleDateString()}`
            : `Devolvido`}
        </Text>
      ) : dueDate ? (
        <Text style={styles.due}>
          Devolução: {new Date(dueDate).toLocaleDateString()}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#071029",
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  borrower: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
    flex: 1,
    marginRight: 8,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  borrowerCompact: {
    fontSize: 13,
  },
  bookTitle: {
    color: "#9ca3af",
    fontSize: 13,
    marginBottom: 6,
    flexShrink: 1,
  },
  bookTitleCompact: {
    fontSize: 12,
  },
  due: {
    color: "#94a3b8",
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginLeft: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  badgeTextCompact: {
    fontSize: 11,
    fontWeight: "700",
  },
});

export default LoanCard;
