import { io } from "socket.io-client";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { API_HOST } from "@env";
import { api } from "./api";

// Configuração de como as notificações serão exibidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NOTIFICATION_SERVER_URL = API_HOST
  ? `${API_HOST.replace(/\/+$/g, "")}:3005`
  : "http://localhost:3005";

class NotificationService {
  constructor() {
    this.socket = null;
    this.userId = null;
    this.isConnected = false;
  }

  // Solicitar permissões de notificação
  async requestPermissions() {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Permissão de notificação negada");
      return false;
    }

    return true;
  }

  // Conectar ao WebSocket
  async connect(serverUrl = null) {
    try {
      this.userId = await AsyncStorage.getItem("userId");

      if (!this.userId) {
        console.warn("UserId não encontrado no AsyncStorage");
        return;
      }

      const url = serverUrl || NOTIFICATION_SERVER_URL;
      console.log("🔌 Conectando ao servidor de notificações:", url);

      // Conectar ao Socket.io
      this.socket = io(url, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      // Eventos de conexão
      this.socket.on("connect", () => {
        console.log("✅ Conectado ao servidor de notificações");
        this.isConnected = true;

        // Registrar usuário
        this.socket.emit("register", { userId: this.userId });
      });

      this.socket.on("disconnect", () => {
        console.log("❌ Desconectado do servidor de notificações");
        this.isConnected = false;
      });

      // Receber notificações
      this.socket.on("notificacao", async (notificacao) => {
        console.log("📨 Notificação recebida:", notificacao);
        await this.showNotification(notificacao);
      });

      this.socket.on("error", (error) => {
        console.error("Erro no WebSocket:", error);
      });
    } catch (error) {
      console.error("Erro ao conectar:", error);
    }
  }

  // Mostrar notificação local
  async showNotification(notificacao) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificacao.titulo || "Nova Notificação",
          body: notificacao.mensagem || "",
          data: notificacao,
          sound: true,
        },
        trigger: null, // Mostrar imediatamente
      });
    } catch (error) {
      console.error("Erro ao mostrar notificação:", error);
    }
  }

  // Desconectar
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Buscar notificações antigas da API
  async fetchNotifications() {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return [];

      const data = await api.get(`notification/notification/${userId}`);
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      return [];
    }
  }

  // Marcar notificação como lida
  async markAsRead(notificationId) {
    try {
      await api.raw(`notification/notification/${notificationId}/lida`, {
        method: "PATCH",
      });
      return true;
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
      return false;
    }
  }

  // Verificar status da conexão
  isSocketConnected() {
    return this.isConnected;
  }
}

// Instância única (Singleton)
const notificationService = new NotificationService();

export default notificationService;
