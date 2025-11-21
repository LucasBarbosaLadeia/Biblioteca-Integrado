import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import notificationService from "../services/NotificationService";

export const useNotifications = () => {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Listener para notificações recebidas enquanto o app está em foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("📨 Notificação recebida (foreground):", notification);
      });

    // Listener para quando o usuário toca na notificação
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Usuário tocou na notificação:", response);
        // Aqui você pode navegar para uma tela específica baseado na notificação
      });

    // Conectar ao serviço de notificações
    notificationService.connect().catch(console.error);

    return () => {
      // Cleanup
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      notificationService.disconnect();
    };
  }, []);

  return {
    isConnected: notificationService.isSocketConnected(),
  };
};
