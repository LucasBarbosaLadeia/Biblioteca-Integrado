import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import NotificationCard from "./NotificationCard";
import { emit } from "../../utils/eventBus";

const SAMPLE = [
  {
    id: "1",
    type: "warning",
    title: "Prazo de devolu├º├úo pr├│ximo",
    message: 'O livro "Clean Code" deve ser devolvido em 7 dias',
    date: "21 de out.",
    initialSeen: false,
  },
  {
    id: "2",
    type: "success",
    title: "Livro dispon├¡vel",
    message: 'O livro "O Senhor dos An├®is" que voc├¬ reservou est├í dispon├¡vel',
    date: "20 de out.",
    initialSeen: false,
    date: "21 de out.",
    initialSeen: false,
  },
  {
    id: "3",
    type: "success",
    title: "Livro dispon├¡vel",
    message: 'O livro "O Senhor dos An├®is" que voc├¬ reservou est├í dispon├¡vel',
    date: "20 de out.",
    initialSeen: true,
  },
  {
    id: "4",
    type: "info",
    title: "Reserva confirmada",
    message: 'Sua reserva para "1984" foi confirmada',
    date: "19 de out.",
    initialSeen: true,
  },
  {
    id: "5",
    type: "info",
    title: "Reserva cancelada",
    message: 'Sua reserva para "1984" foi cancelada',
    date: "19 de out.",
    initialSeen: true,
  },
  {
    id: "6",
    type: "info",
    title: "Reserva cancelada",
    message: 'Sua reserva para "1984" foi cancelada',
    date: "19 de out.",
    initialSeen: true,
  },
  {
    id: "7",
    type: "warning",
    title: "Prazo de Reserva pr├│ximo",
    message:
      'Sua reserva para "1984" est├í pr├│xima do prazo final de retirada da biblioteca',
    date: "19 de out.",
    initialSeen: true,
  },
];

const NotificationList = ({ data = SAMPLE, style }) => {
  // map of id -> seen (boolean)
  const [seenMap, setSeenMap] = useState(() => {
    const map = {};
    (data || []).forEach((d) => {
      map[d.id] = !!d.initialSeen;
    });
    return map;
  });

  // emit initial unread count and whenever it changes
  useEffect(() => {
    const unread = (data || []).reduce(
      (acc, d) => acc + (!seenMap[d.id] ? 1 : 0),
      0
    );
    try {
      emit("notificationsUpdated", { unreadCount: unread });
    } catch (e) {}
  }, [seenMap, data]);

  const handleMarkSeen = (id) => {
    setSeenMap((prev) => {
      if (prev[id]) return prev; // already seen
      const next = { ...prev, [id]: true };
      return next;
    });
  };

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            id={item.id}
            type={item.type}
            title={item.title}
            message={item.message}
            date={item.date}
            seen={!!seenMap[item.id]}
            onMarkSeen={handleMarkSeen}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NotificationList;
