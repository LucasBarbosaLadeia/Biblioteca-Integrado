import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BookItem = ({ title, author, coverImage, isAvailable, onPress }) => {
  const availabilityColor = isAvailable ? "#2ECC71" : "#E74C3C";
  const availabilityIcon = isAvailable ? "checkmark-circle" : "close-circle";
  const availabilityText = isAvailable
    ? "Dispon├¡vel Na Biblioteca"
    : "Indispon├¡vel Na Biblioteca";
  // Se o t├¡tulo for longo, diminui a fonte
  const isLongTitle = title && title.length > 20;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardContainer}>
        <Image
          source={coverImage}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <View style={styles.titleWrapper}>
            <Text
              style={[styles.titleText, isLongTitle && styles.titleTextSmall]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
          <Text style={styles.authorText} numberOfLines={1}>
            {author}
          </Text>
          <View style={styles.availabilityContainer}>
            <Ionicons
              name={availabilityIcon}
              size={22}
              color={availabilityColor}
            />
            <Text
              style={[styles.availabilityText, { color: availabilityColor }]}
            >
              {availabilityText}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#0A1931",
    borderRadius: 20,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  coverImage: {
    width: 70,
    height: 100,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    backgroundColor: "#0A1931",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
    height: 100,
  },
  titleWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 18,
    alignSelf: "center",
    marginBottom: 4,
    borderWidth: 1.5,
    borderColor: "#3A4A7A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  titleText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  titleTextSmall: {
    fontSize: 13,
  },
  authorText: {
    color: "#FFFFFF",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 8,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 0,
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 7,
    color: "#FFFFFF",
  },
});

export default BookItem;
