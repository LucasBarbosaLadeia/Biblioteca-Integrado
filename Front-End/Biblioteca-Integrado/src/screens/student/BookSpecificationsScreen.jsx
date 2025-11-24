import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabBar from "../../components/home/TagBar";
import { toggleFavorito as toggleFavoritoAPI } from "../../utils/favoritos";
import { emit } from "../../utils/eventBus";
import { api } from "../../services/api";
import StyledAlert from "../../components/common/StyledAlert";

import HeaderDetalhes from "../../components/DetalhesDoLivro/HeaderDetalhes";
import CoverImage from "../../components/DetalhesDoLivro/CoverImage";
import AvailabilityBadge from "../../components/DetalhesDoLivro/AvailabilityBadge";
import InfoRowCards from "../../components/DetalhesDoLivro/InfoRowCards";
import DetailsCard from "../../components/DetalhesDoLivro/DetailsCard";
import AboutSection from "../../components/DetalhesDoLivro/AboutSection";
import ReserveButton from "../../components/DetalhesDoLivro/ReserveButton";

const BookSpecificationsScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const raw = book?.raw || book || {};
  const id = raw.id_livro ?? raw.id;
  const title = raw.titulo ?? raw.title ?? book?.title ?? "";
  const author = raw.autor ?? raw.author ?? book?.autor ?? "";
  const cover = book?.cover ?? (raw.capa_url ? { uri: raw.capa_url } : null);
  const isAvailable = (raw.qt_atual ?? raw.qtAtual ?? 0) > 0;
  const copies = raw.qt_total ?? raw.qtTotal ?? 0;
  const pages = raw.paginas ?? raw.pages ?? 0;
  const year = raw.ano_publicacao ?? raw.year ?? null;
  const editora = raw.editora ?? null;
  const isbn = raw.isbn ?? null;
  const localizacao = raw.prateleira ?? null;
  const description = raw.sinopse ?? raw.description ?? null;
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(true);
  const [togglingFavorite, setTogglingFavorite] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [hasReservation, setHasReservation] = useState(false);
  const [checkingReservation, setCheckingReservation] = useState(true);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info",
    buttons: [],
  });

  const showAlert = (config) => {
    setAlertConfig({ ...config, visible: true });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  const checkIfFavorited = async () => {
    try {
      setLoadingFavorite(true);
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("userId");
      const result = await api.get(`favoritos/usuario/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (result.success && Array.isArray(result.data)) {
        const isFav = result.data.some(
          (fav) => fav.id_livro === id || fav.livro?.id_livro === id
        );
        setIsFavorited(isFav);
      } else {
        setIsFavorited(false);
      }
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
      setIsFavorited(false);
    } finally {
      setLoadingFavorite(false);
    }
  };

  const checkIfHasReservation = async () => {
    try {
      setCheckingReservation(true);
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("userId");

      const result = await api.get(`reservas/usuario/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📚 Verificando reserva para livro ID:", id);
      console.log("👤 Usuário ID:", usuarioId);
      console.log(
        "📋 Reservas do usuário:",
        JSON.stringify(result.data, null, 2)
      );

      if (result.success && Array.isArray(result.data)) {
        const hasActiveReservation = result.data.some((reserva) => {
          const livroMatch = String(reserva.livroId) === String(id);
          const userMatch = String(reserva.alunoId) === String(usuarioId);
          const statusMatch = reserva.status === "PENDENTE";

          console.log(`🔍 Reserva ${reserva.id}:`, {
            livroId: reserva.livroId,
            livroMatch,
            userMatch,
            statusMatch,
            status: reserva.status,
          });

          return livroMatch && userMatch && statusMatch;
        });

        console.log("✅ Tem reserva ativa?", hasActiveReservation);
        setHasReservation(hasActiveReservation);
      } else {
        setHasReservation(false);
      }
    } catch (error) {
      console.error("Erro ao verificar reserva:", error);
      setHasReservation(false);
    } finally {
      setCheckingReservation(false);
    }
  };

  useEffect(() => {
    checkIfFavorited();
    checkIfHasReservation();
  }, []);

  const handleToggleFavorito = async () => {
    if (togglingFavorite) return;
    setTogglingFavorite(true);

    const prev = isFavorited;
    setIsFavorited(!prev);
    emit("favoriteChanged", { id, isFavorito: !prev, book: raw });

    try {
      const token = await AsyncStorage.getItem("token");
      const usuarioId = await AsyncStorage.getItem("userId");

      const response = await toggleFavoritoAPI(usuarioId, id, token);

      if (!response || !response.success) {
        setIsFavorited(prev);
        emit("favoriteChanged", { id, isFavorito: prev });
        console.warn(
          "Erro ao favoritar:",
          response?.message || "Erro desconhecido"
        );
      }
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      setIsFavorited(prev);
      emit("favoriteChanged", { id, isFavorito: prev });
    } finally {
      setTogglingFavorite(false);
    }
  };

  const handleReservar = async () => {
    if (reserving) return;

    const mensagemReserva = isAvailable
      ? `Deseja reservar o livro "${title}"? Você terá 24 horas para retirar o livro, caso contrário ele retornará ao estoque.`
      : `O livro "${title}" está indisponível no momento. Deseja entrar na fila de reserva? Você será notificado quando o livro estiver disponível.`;

    showAlert({
      title: "Confirmar Reserva",
      message: mensagemReserva,
      type: "confirm",
      buttons: [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: hideAlert,
        },
        {
          text: "Confirmar",
          onPress: async () => {
            hideAlert();
            try {
              setReserving(true);
              const token = await AsyncStorage.getItem("token");
              const usuarioId = await AsyncStorage.getItem("userId");

              await api.post(`/reservas/${id}/${usuarioId}`, null, {
                headers: { Authorization: `Bearer ${token}` },
              });

              console.log("✅ Reserva criada com sucesso");

              const mensagemSucesso = isAvailable
                ? "Reserva confirmada! Você tem 24 horas para retirar o livro. Após esse período, a reserva será cancelada automaticamente."
                : "Você foi adicionado à fila de reserva! Você será notificado quando o livro estiver disponível para retirada.";

              setHasReservation(true);

              // Recarrega o status da reserva
              await checkIfHasReservation();

              showAlert({
                title: "Reserva Confirmada!",
                message: mensagemSucesso,
                type: "success",
                buttons: [{ text: "OK", onPress: hideAlert }],
              });
            } catch (error) {
              console.error("Erro ao reservar livro:", error);

              const errorMessage =
                error?.body?.message ||
                error?.message ||
                "Não foi possível fazer a reserva. Tente novamente.";

              showAlert({
                title: "Erro na Reserva",
                message: errorMessage,
                type: "error",
                buttons: [{ text: "OK", onPress: hideAlert }],
              });
            } finally {
              setReserving(false);
            }
          },
        },
      ],
    });
  };

  const handleCancelarReserva = async () => {
    showAlert({
      title: "Cancelar Reserva",
      message: `Deseja realmente cancelar a reserva do livro "${title}"?`,
      type: "warning",
      buttons: [
        {
          text: "Não",
          style: "cancel",
          onPress: hideAlert,
        },
        {
          text: "Sim, Cancelar",
          style: "destructive",
          onPress: async () => {
            hideAlert();
            try {
              setReserving(true);
              const token = await AsyncStorage.getItem("token");
              const usuarioId = await AsyncStorage.getItem("userId");

              await api.delete(`/reservas/${id}/${usuarioId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              console.log("✅ Reserva cancelada com sucesso");

              setHasReservation(false);

              // Recarrega o status da reserva
              await checkIfHasReservation();

              showAlert({
                title: "Reserva Cancelada",
                message: "Sua reserva foi cancelada com sucesso.",
                type: "success",
                buttons: [{ text: "OK", onPress: hideAlert }],
              });
            } catch (error) {
              console.error("Erro ao cancelar reserva:", error);

              const errorMessage =
                error?.body?.message ||
                error?.message ||
                "Não foi possível cancelar a reserva. Tente novamente.";

              showAlert({
                title: "Erro ao Cancelar",
                message: errorMessage,
                type: "error",
                buttons: [{ text: "OK", onPress: hideAlert }],
              });
            } finally {
              setReserving(false);
            }
          },
        },
      ],
    });
  };

  return (
    <View style={styles.Backgroundcontainer}>
      <SafeAreaView style={styles.safeArea}>
        <HeaderDetalhes
          title="Detalhes do Livro"
          onBack={() => navigation.goBack()}
          onToggleFavorite={handleToggleFavorito}
          isFavorited={isFavorited}
          disabled={loadingFavorite || togglingFavorite}
          togglingFavorite={togglingFavorite}
        />

        <ScrollView contentContainerStyle={styles.container}>
          <CoverImage cover={cover} />
          <Text style={styles.bookTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.bookAuthor}>{author}</Text>
          <AvailabilityBadge isAvailable={isAvailable} copies={copies} />

          <InfoRowCards pages={pages} year={year} />

          <DetailsCard
            editora={editora}
            isbn={isbn}
            localizacao={localizacao}
          />

          <AboutSection text={description} />

          {hasReservation ? (
            <ReserveButton
              onPress={handleCancelarReserva}
              disabled={reserving || checkingReservation}
              isAvailable={true}
              buttonText="Cancelar Reserva"
              backgroundColor="#E74C3C"
            />
          ) : (
            <ReserveButton
              onPress={handleReservar}
              disabled={reserving || checkingReservation}
              isAvailable={isAvailable}
            />
          )}
        </ScrollView>

        <StyledAlert {...alertConfig} onClose={hideAlert} />

        <TabBar />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  Backgroundcontainer: { flex: 1, backgroundColor: "#020618" },
  safeArea: { flex: 1, paddingTop: 50 },
  container: { padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 30,
  },
  bookTitle: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookAuthor: {
    color: "#cfcfcf",
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E74C3C",
    justifyContent: "center",
    alignItems: "center",
    right: 30,
    bottom: 100,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default BookSpecificationsScreen;
