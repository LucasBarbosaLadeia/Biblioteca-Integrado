import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EditBookForm from "../../components/librarian/editBook/EditBookForm";
import CategorySelect from "../../components/librarian/editBook/CategorySelect";
import SaveButton from "../../components/librarian/editBook/SaveButton";
import { api } from "../../services/api";
import StyledAlert from "../../components/common/StyledAlert";

const EditBook = ({ navigation, route }) => {
  const bookId =
    route?.params?.bookId ||
    route?.params?.book?.id ||
    route?.params?.book?.id_livro;

  const [values, setValues] = useState({
    title: "",
    author: "",
    isbn: "",
    total: "",
    cover: require("../../../assets/icon.png"),
    categoryId: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        // fetch categories
        try {
          const cats = await api.get("categorias");
          if (mounted) setCategories(cats?.data || []);
        } catch (e) {
          // ignore categories error
        }

        if (bookId) {
          const json = await api.get(`livros/${bookId}`);
          const book = json?.data || json || {};
          if (!mounted) return;
          setValues({
            title: book.titulo || book.title || "",
            author: book.autor || book.author || "",
            isbn: book.isbn || book.ISBN || "",
            total: book.total ?? book.quantidade ?? "",
            cover: book.capa
              ? { uri: book.capa }
              : require("../../../assets/icon.png"),
            categoryId: book.categoria_id ?? book.categoria ?? null,
          });
        }
      } catch (e) {
        console.warn("Erro ao carregar livro", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [bookId]);

  const handleChange = (key, val) => {
    setValues((s) => ({ ...s, [key]: val }));
  };

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({});

  const handleSave = async () => {
    // basic validation
    if (!values.title.trim()) {
      setAlertData({
        title: "Validação",
        message: "Título é obrigatório",
        type: "error",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        titulo: values.title,
        autor: values.author,
        isbn: values.isbn,
        total: Number(values.total) || 0,
        categoria: values.categoryId,
      };

      if (bookId) {
        await api.put(`livros/${bookId}`, payload);
      } else {
        await api.post("livros", payload);
      }

      setAlertData({
        title: "Sucesso",
        message: "Livro salvo com sucesso",
        type: "success",
        onConfirm: () => {
          setAlertVisible(false);
          navigation && navigation.goBack && navigation.goBack();
        },
      });
      setAlertVisible(true);
    } catch (e) {
      console.warn("Erro ao salvar livro", e);
      setAlertData({
        title: "Erro",
        message: "Falha ao salvar livro",
        type: "error",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !values.title) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1b3a75" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.topRow}>
        <Ionicons
          name="arrow-back"
          size={22}
          color="#9fb0c8"
          onPress={() => navigation && navigation.goBack && navigation.goBack()}
        />
        <Text style={styles.title}>Editar Livro</Text>
        <Ionicons name="save" size={22} color="#ffffffff" style={{}} />
      </View>

      <View style={styles.container}>
        <EditBookForm values={values} onChange={handleChange} />

        <CategorySelect
          categories={categories}
          selectedId={values.categoryId}
          onSelect={(id) => setValues((s) => ({ ...s, categoryId: id }))}
        />

        <SaveButton onPress={handleSave} loading={loading} />
      </View>
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
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#020618" },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 25,
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700", marginLeft: 12 },
  container: { padding: 16 },
});

export default EditBook;
