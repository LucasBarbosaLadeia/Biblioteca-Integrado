import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { API_HOST } from "@env";

import { Ionicons } from "@expo/vector-icons";

import FormSection from "../../components/admin/editBook/FormSection";
import TextField from "../../components/admin/editBook/TextField";
import NumberField from "../../components/admin/editBook/NumberField";
import SelectField from "../../components/admin/editBook/SelectField";
import SaveButton from "../../components/admin/editBook/SaveButton";
import StyledAlert from "../../components/common/StyledAlert";

const EditBook = ({ route, navigation }) => {
  const { bookId } = route.params || {};
  const API = API_HOST || "http://localhost:3001";

  const [book, setBook] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        if (!bookId) return;
        const [resBook, resCats] = await Promise.all([
          fetch(`${API}/api/livros/${bookId}`),
          fetch(`${API}/api/categorias`),
        ]);

        const jsonBook = await resBook.json();
        const jsonCats = await resCats.json();

        if (!mounted) return;
        const b = jsonBook?.data || {};
        // normalize category id
        const normalized = {
          ...b,
          id_categoria:
            b.id_categoria ?? b.categoria?.id_categoria ?? b.categoria?.id,
        };
        setBook(normalized);
        setCategories(jsonCats?.data || []);
      } catch (e) {
        console.warn("Erro ao carregar livro:", e);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, [bookId]);

  const handleSave = async () => {
    // basic validation
    if (!book.titulo || !book.autor) {
      setAlertData({
        title: "Erro",
        message: "Título e Autor são obrigatórios",
        type: "error",
        onConfirm: () => setAlertVisible(false),
        confirmText: "OK",
      });
      setAlertVisible(true);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        titulo: book.titulo,
        autor: book.autor,
        isbn: book.isbn,
        id_categoria: book.id_categoria,
        qt_total: Number(book.qt_total) || 0,
        prateleira: book.prateleira,
        capa_url: book.capa_url,
        sinopse: book.sinopse,
        ano_publicacao: book.ano_publicacao,
        editora: book.editora,
        paginas: Number(book.paginas) || 0,
      };

      const res = await fetch(`${API}/api/livros/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok) {
        setAlertData({
          title: "Sucesso",
          message: "Livro atualizado com sucesso",
          type: "success",
          onConfirm: () => {
            setAlertVisible(false);
            if (navigation && navigation.goBack) navigation.goBack();
          },
          confirmText: "OK",
        });
        setAlertVisible(true);
      } else {
        setAlertData({
          title: "Erro",
          message: json?.message || "Falha ao atualizar livro",
          type: "error",
          onConfirm: () => setAlertVisible(false),
          confirmText: "OK",
        });
        setAlertVisible(true);
      }
    } catch (e) {
      console.warn(e);
      setAlertData({
        title: "Erro",
        message: "Falha ao atualizar livro",
        type: "error",
        onConfirm: () => setAlertVisible(false),
        confirmText: "OK",
      });
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const available = book.qt_atual ?? (book.qt_total ? book.qt_total : 0);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({});

  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() =>
              navigation && navigation.goBack && navigation.goBack()
            }
          >
            <Ionicons name="arrow-back" size={22} color="#9fb0c8" />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.title}>Editar Livro</Text>
            <Text style={styles.subtitle}>{book.autor ? book.autor : ""}</Text>
          </View>

          <Ionicons name="book-outline" size={22} color="#9fb0c8" />
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          {book.capa_url ? (
            <View style={styles.coverWrap}>
              <Image source={{ uri: book.capa_url }} style={styles.cover} />
            </View>
          ) : null}

          <FormSection title="Informações Básicas">
            <TextField
              label="Título do Livro *"
              value={book.titulo}
              onChangeText={(t) => setBook({ ...book, titulo: t })}
            />
            <TextField
              label="Autor *"
              value={book.autor}
              onChangeText={(t) => setBook({ ...book, autor: t })}
            />
            <SelectField
              label="Categoria *"
              options={categories}
              value={book.id_categoria}
              onValueChange={(v) => setBook({ ...book, id_categoria: v })}
              placeholder="Selecione"
            />
            <TextField
              label="Descrição"
              multiline
              value={book.sinopse}
              onChangeText={(t) => setBook({ ...book, sinopse: t })}
            />
          </FormSection>

          <FormSection
            title="Localização e Estoque"
            note="💡 Quantidade disponível = Total de cópias - Livros emprestados"
          >
            <TextField
              label="Localização na Biblioteca"
              value={book.prateleira}
              onChangeText={(t) => setBook({ ...book, prateleira: t })}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <NumberField
                  label="Quantidade Total *"
                  value={book.qt_total}
                  onChangeText={(t) => setBook({ ...book, qt_total: t })}
                />
              </View>
              <View style={{ width: 120 }}>
                <NumberField
                  label="Disponíveis *"
                  value={available}
                  onChangeText={(t) => setBook({ ...book, qt_atual: t })}
                />
              </View>
            </View>
          </FormSection>

          <FormSection title="Detalhes de Publicação">
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <TextField
                  label="ISBN *"
                  value={book.isbn}
                  onChangeText={(t) => setBook({ ...book, isbn: t })}
                />
              </View>
              <View style={{ width: 100 }}>
                <NumberField
                  label="Ano *"
                  value={book.ano_publicacao}
                  onChangeText={(t) => setBook({ ...book, ano_publicacao: t })}
                />
              </View>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <TextField
                  label="Editora"
                  value={book.editora}
                  onChangeText={(t) => setBook({ ...book, editora: t })}
                />
              </View>
              <View style={{ width: 120 }}>
                <NumberField
                  label="Páginas"
                  value={book.paginas}
                  onChangeText={(t) => setBook({ ...book, paginas: t })}
                />
              </View>
            </View>
          </FormSection>

          <SaveButton onPress={handleSave} loading={loading} />
        </ScrollView>
        <StyledAlert
          visible={alertVisible}
          title={alertData.title}
          message={alertData.message}
          type={alertData.type}
          onConfirm={alertData.onConfirm}
          onCancel={alertData.onCancel}
          confirmText={alertData.confirmText}
          cancelText={alertData.cancelText}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#020618" },
  safe: { flex: 1 },
  container: { padding: 16 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#061248ff",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "800" },
  subtitle: { color: "#9fb0c8", fontSize: 12 },
  coverWrap: { alignItems: "center", marginBottom: 12 },
  cover: {
    width: 120,
    height: 170,
    borderRadius: 8,
    backgroundColor: "#071028",
  },
  label: { color: "#9fb0c8", marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#071028",
    padding: 10,
    borderRadius: 8,
    color: "#e6eef8",
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: "#0b2540",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#e6eef8", fontWeight: "700" },
});

export default EditBook;
