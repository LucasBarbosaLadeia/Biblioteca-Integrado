import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ManageBookCard = ({
  cover,
  title,
  author,
  category,
  isbn,
  total = 0,
  available = 0,
  location,
  onEdit,
}) => {
  const availabilityColor = available > 0 ? "#10B981" : "#EF4444";
  const availabilityIcon = available > 0 ? "checkmark-circle" : "close-circle";

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={["#1E293B", "#0F172A"]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Capa do Livro */}
        <View style={styles.coverContainer}>
          <Image source={cover} style={styles.cover} />
          <View style={styles.availabilityBadge}>
            <Ionicons
              name={availabilityIcon}
              size={16}
              color={availabilityColor}
            />
          </View>
        </View>

        {/* Conteúdo */}
        <View style={styles.content}>
          {/* Título e Autor */}
          <View style={styles.headerSection}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.authorRow}>
              <Ionicons name="person-outline" size={14} color="#94A3B8" />
              <Text style={styles.author} numberOfLines={1}>
                {author}
              </Text>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            <LinearGradient
              colors={["#3B82F6", "#2563EB"]}
              style={styles.tag}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="pricetag" size={12} color="#fff" />
              <Text style={styles.tagText}>{category}</Text>
            </LinearGradient>

            <View style={styles.isbnTag}>
              <Ionicons name="barcode-outline" size={12} color="#94A3B8" />
              <Text style={styles.isbnText}>{isbn}</Text>
            </View>
          </View>

          {/* Estatísticas */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="albums-outline" size={16} color="#60A5FA" />
              </View>
              <View>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>{total}</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "rgba(16, 185, 129, 0.15)" },
                ]}
              >
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              </View>
              <View>
                <Text style={styles.statLabel}>Disponível</Text>
                <Text style={[styles.statValue, { color: availabilityColor }]}>
                  {available}
                </Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "rgba(245, 158, 11, 0.15)" },
                ]}
              >
                <Ionicons name="location" size={16} color="#F59E0B" />
              </View>
              <View>
                <Text style={styles.statLabel}>Local</Text>
                <Text
                  style={[styles.statValue, { fontSize: 11 }]}
                  numberOfLines={1}
                >
                  {location}
                </Text>
              </View>
            </View>
          </View>

          {/* Botão Editar */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEdit}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#3B82F6", "#2563EB"]}
              style={styles.editGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.editText}>Editar Livro</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: 8,
  },
  card: {
    flexDirection: "row",
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
  coverContainer: {
    position: "relative",
    marginRight: 16,
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#334155",
  },
  availabilityBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0F172A",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerSection: {
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#F1F5F9",
    marginBottom: 6,
    lineHeight: 22,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  author: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
    flex: 1,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  isbnTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(148, 163, 184, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  isbnText: {
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: "500",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    color: "#E2E8F0",
    fontWeight: "700",
  },
  editButton: {
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 8,
  },
  editText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default ManageBookCard;
