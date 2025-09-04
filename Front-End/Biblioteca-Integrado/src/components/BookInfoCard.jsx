import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

const BookInfoCard = ({ book }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={book.coverImage} style={styles.coverImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.titleText} numberOfLines={2}>
          {book.title}
        </Text>
        <DetailRow label="Autor" value={book.author_name?.[0] || "N/A"} />
        <DetailRow
          label="Publicação"
          value={book.first_publish_year || "N/A"}
        />
        <DetailRow label="Categoria" value={book.subject?.[0] || "N/A"} />
        <DetailRow
          label="Páginas"
          value={book.number_of_pages_median || "N/A"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    marginBottom: 20,
    width: "100%",
  },
  coverImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "white",
    marginTop: 50,
  },
  infoContainer: { flex: 1, justifyContent: "space-between" },
  titleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    marginHorizontal: 5,
  },
  detailRow: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
  },
  detailLabel: { fontSize: 10, color: "#555" },
  detailValue: { fontSize: 12, color: "black", fontWeight: "500" },
});

export default BookInfoCard;
