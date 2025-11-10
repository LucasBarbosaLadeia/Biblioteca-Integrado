import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tag = ({ children }) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>{children}</Text>
  </View>
);

const BookCard = ({ book = {}, onEdit, onDelete }) => {
  const title = book.titulo || book.title || "-";
  const author = book.autor || book.author || "-";
  const isbn = book.isbn || "-";
  const total = book.qt_total ?? book.total ?? 0;
  const available = book.qt_atual ?? book.available ?? 0;
  const shelf = book.prateleira || "-";
  const cover = book.capa_url || null;
  const category = book.categoria?.nome || book.categoria || "-";

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {cover ? (
          <Image source={{ uri: cover }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.coverPlaceholder]} />
        )}

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={styles.author}>{author}</Text>

          <View style={styles.rowTags}>
            <Tag>{category}</Tag>
            <Tag>ISBN: {isbn}</Tag>
          </View>

          <View style={styles.rowSmall}>
            <MaterialCommunityIcons
              name="cube-outline"
              size={14}
              color="#9fb0c8"
            />
            <Text style={styles.smallText}> Total: {total}</Text>
            <MaterialCommunityIcons
              name="cube"
              size={14}
              color="#10b981"
              style={{ marginLeft: 8 }}
            />
            <Text style={[styles.smallText, { color: "#10b981" }]}>
              {" "}
              Disponível: {available}
            </Text>
          </View>

          <View style={styles.rowSmall}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={14}
              color="#f472b6"
            />
            <Text style={styles.smallText}> Seção: {shelf}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.editBtn}
          activeOpacity={0.8}
          onPress={() => onEdit && onEdit(book)}
        >
          <MaterialCommunityIcons name="pencil" size={18} color="#e6eef8" />
          <Text style={styles.editText}>Editar Livro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.editBtn, styles.deleteBtn]}
          activeOpacity={0.8}
          onPress={() => onDelete && onDelete(book)}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={18}
            color="#e6eef8"
          />
          <Text style={styles.editText}>Excluir Livro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#071028",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    marginBottom: 12,
  },
  leftRow: {
    flexDirection: "row",
  },
  cover: {
    width: 70,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#0b1220",
  },
  coverPlaceholder: {
    opacity: 0.3,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    color: "#e6eef8",
    fontSize: 16,
    fontWeight: "700",
  },
  author: {
    color: "#9fb0c8",
    fontSize: 13,
    marginTop: 4,
  },
  rowTags: {
    flexDirection: "row",
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#0b2540",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    color: "#cfe8ff",
    fontSize: 12,
  },
  rowSmall: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  smallText: {
    color: "#9fb0c8",
    fontSize: 12,
    marginLeft: 4,
  },
  editBtn: {
    marginTop: 12,
    backgroundColor: "#123254",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  editText: {
    color: "#e6eef8",
    marginLeft: 8,
    fontWeight: "700",
  },
  actionsRow: { flexDirection: "column", marginTop: 12 },
  deleteBtn: { marginTop: 12, backgroundColor: "#b91c1c" },
  deleteText: { color: "#e6eef8", marginLeft: 8, fontWeight: "700" },
});

export default BookCard;
