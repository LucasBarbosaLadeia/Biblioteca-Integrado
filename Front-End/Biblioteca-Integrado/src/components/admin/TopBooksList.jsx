import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TopBooksList = ({
  books = [
    {
      title: "Algoritmos e Estruturas de Dados",
      author: "Thomas H. Cormen",
      timesLoaned: 2,
    },
    { title: "Clean Code", author: "Robert C. Martin", timesLoaned: 1 },
    {
      title: "Harry Potter e a Pedra Filosofal",
      author: "J.K. Rowling",
      timesLoaned: 1,
    },
  ],
}) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>Livros Mais Emprestados</Text>

      {books.map((b, i) => (
        <View key={i} style={styles.item}>
          <View style={styles.itemLeft}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {b.title}
            </Text>
            <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">
              {b.author}
            </Text>
          </View>

          <View style={styles.itemRight}>
            <Text style={styles.count}>{b.timesLoaned}</Text>
            <Text style={styles.timesLabel}>emprest.</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
    marginBottom: 6,
  },
  header: {
    color: "#cfe8ff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#071028",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  itemLeft: {
    flex: 1,
  },
  itemRight: {
    alignItems: "flex-end",
    width: 64,
  },
  title: {
    color: "#e6eef8",
    fontSize: 14,
    fontWeight: "700",
  },
  author: {
    color: "#9fb0c8",
    fontSize: 12,
    marginTop: 4,
  },
  count: {
    color: "#60a5fa",
    fontSize: 18,
    fontWeight: "800",
  },
  timesLabel: {
    color: "#9fb0c8",
    fontSize: 11,
  },
});

export default TopBooksList;
