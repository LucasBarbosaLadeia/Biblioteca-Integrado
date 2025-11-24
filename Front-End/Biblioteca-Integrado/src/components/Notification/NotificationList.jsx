import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
} from "react-native";
import NotificationCard from "./NotificationCard";
import { emit } from "../../utils/eventBus";
import notificationService from "../../services/NotificationService";

const NotificationList = ({ style }) => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar notificações
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.fetchNotifications();

      // Converter formato do backend para o formato esperado pelo componente
      const formattedData = data.map((notif) => ({
        id: notif.id,
        type: getNotificationType(notif.titulo),
        title: notif.titulo,
        message: notif.mensagem,
        date: formatDate(notif.createdAt),
        initialSeen: notif.lida,
      }));

      console.log("✅ Notificações formatadas:", formattedData.length);
      setNotificacoes(formattedData);
    } catch (error) {
      console.error("❌ Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  // Mapear tipo de notificação baseado no título
  const getNotificationType = (titulo) => {
    if (titulo.includes("Empréstimo") || titulo.includes("criado"))
      return "info";
    if (titulo.includes("devolvido")) return "success";
    if (titulo.includes("Reserva") || titulo.includes("disponível"))
      return "success";
    if (titulo.includes("prazo") || titulo.includes("próximo"))
      return "warning";
    return "info";
  };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
  };

  // map of id -> seen (boolean)
  const [seenMap, setSeenMap] = useState({});

  // Atualizar seenMap quando notificações carregarem
  useEffect(() => {
    const map = {};
    notificacoes.forEach((d) => {
      map[d.id] = !!d.initialSeen;
    });
    setSeenMap(map);
  }, [notificacoes]);

  // emit initial unread count and whenever it changes
  useEffect(() => {
    const unread = notificacoes.reduce(
      (acc, d) => acc + (!seenMap[d.id] ? 1 : 0),
      0
    );
    try {
      emit("notificationsUpdated", { unreadCount: unread });
    } catch (e) {}
  }, [seenMap, notificacoes]);

  const handleMarkSeen = async (id) => {
    if (seenMap[id]) return; // já está lida

    // Marcar como lida no backend
    const success = await notificationService.markAsRead(id);

    if (success) {
      setSeenMap((prev) => {
        const next = { ...prev, [id]: true };
        return next;
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Carregando notificações...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={notificacoes}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
            <Text style={styles.emptySubtext}>
              Você será notificado quando houver atualizações
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});

export default NotificationList;
