import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  return (
    <View style={styles.card}>
      <Image source={cover} style={styles.cover} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.author}>{author}</Text>

        <View style={styles.row}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{category}</Text>
          </View>
          <View style={styles.isbn}>
            <Text style={styles.isbnText}>ISBN: {isbn}</Text>
          </View>
        </View>

        <View style={styles.rowBetween}>
          <View style={styles.statsRow}>
            <Ionicons name="people" size={14} color="#8aa0d6" />
            <Text style={styles.statText}> Total: {total}</Text>
            <Text style={styles.available}> Disponível: {available}</Text>
          </View>

          <Text style={styles.location}>{location}</Text>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <Text style={styles.editText}>Editar Livro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#0f1724",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    alignItems: "flex-start",
  },
  cover: {
    width: 64,
    height: 96,
    borderRadius: 6,
    backgroundColor: "#27314a",
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  author: {
    color: "#9bb0d9",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
  },
  tag: {
    backgroundColor: "#1b3a75",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  tagText: {
    color: "#bfe0ff",
    fontSize: 12,
  },
  isbn: {
    backgroundColor: "#2a394f",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  isbnText: {
    color: "#cbd8ef",
    fontSize: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    color: "#9fb6e6",
    marginLeft: 6,
  },
  available: {
    color: "#7fe0a3",
    marginLeft: 8,
  },
  location: {
    color: "#f3b0c0",
  },
  editBtn: {
    marginTop: 12,
    backgroundColor: "#1b3a75",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default ManageBookCard;
