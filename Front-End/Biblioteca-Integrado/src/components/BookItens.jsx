import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BookItem = ({ title, coverImage, isAvailable, onPress }) => {
  const availabilityColor = isAvailable ? "#2ECC71" : "#E74C3C";
  const availabilityIcon = isAvailable ? "checkmark-circle" : "close-circle";
  const availabilityText = isAvailable
    ? "Disponível Na Biblioteca"
    : "Indisponível Na Biblioteca";

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.cardContainer}>
        <Image
          source={coverImage}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <View style={styles.titleBackground}>
            <Text style={styles.titleText} numberOfLines={2}>
              {title}
            </Text>
          </View>
          <View style={styles.availabilityContainer}>
            <Ionicons
              name={availabilityIcon}
              size={20}
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
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  coverImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    resizeMode: "cover",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
    height: 120,
  },
  titleBackground: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 10,
    marginTop: 1,
    marginInline: 5,
    paddingHorizontal: 15,
    // alignSelf: "flex-start",
  },
  titleText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default BookItem;
