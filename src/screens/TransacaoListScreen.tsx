import React, { useState, useMemo } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated from "react-native-reanimated";

const TransacaoListScreen = ({ navigation }) => {
  const [transacoes, setTransacoes] = useState([
    {
      id: "1",
      descricao: "Compra no mercado",
      valor: 150.25,
      data: "2024-12-06T14:30:00Z",
      hora: "14:30",
      categoria: "Alimentação",
      tipo: "despesa",
      moeda: "BRL",
    },
    {
      id: "2",
      descricao: "Salário",
      valor: 4500.0,
      data: "2024-12-01T08:00:00Z",
      hora: "08:00",
      categoria: "Renda",
      tipo: "receita",
      moeda: "BRL",
    },
    {
      id: "3",
      descricao: "Venda de produto",
      valor: 1200.0,
      data: "2024-12-04T10:00:00Z",
      hora: "10:00",
      categoria: "Renda",
      tipo: "receita",
      moeda: "BRL",
    },
  ]);

  const [ordenarPor, setOrdenarPor] = useState("descricao");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroBusca, setFiltroBusca] = useState("");

  const ordenarTransacoes = (transacoes, criterio) => {
    return transacoes.sort((a, b) => {
      if (criterio === "valor") {
        return a.valor - b.valor;
      }
      if (criterio === "data") {
        return new Date(a.data) - new Date(b.data);
      }
      return a.descricao.localeCompare(b.descricao);
    });
  };

  const filtrarTransacoes = (transacoes, tipo, busca) => {
    let resultado =
      tipo === "todos"
        ? transacoes
        : transacoes.filter((transacao) => transacao.tipo === tipo);

    if (busca) {
      resultado = resultado.filter((transacao) =>
        transacao.descricao.toLowerCase().includes(busca.toLowerCase())
      );
    }

    return resultado;
  };

  const transacoesFiltradas = useMemo(
    () => filtrarTransacoes(transacoes, filtroTipo, filtroBusca),
    [transacoes, filtroTipo, filtroBusca]
  );
  const transacoesOrdenadas = useMemo(
    () => ordenarTransacoes(transacoesFiltradas, ordenarPor),
    [transacoesFiltradas, ordenarPor]
  );

  const { width } = useWindowDimensions();
  const isLandscape = width > 600;

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const renderItem = ({ item }) => (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        renderLeftActions={(_, dragX) => {
          const styleAnimation = useAnimatedStyle(() => {
            return {
              transform: [{ translateX: dragX.value - 60 }],
            };
          });
          return (
            <Reanimated.View style={[styleAnimation]}>
              <Button
                title="Editar"
                onPress={() =>
                  navigation.navigate("Cadastrar Transação", {
                    transacao: item,
                  })
                }
              />
            </Reanimated.View>
          );
        }}
        renderRightActions={(_, dragX) => {
          const styleAnimation = useAnimatedStyle(() => {
            return {
              transform: [{ translateX: dragX.value + 60 }],
            };
          });
          return (
            <Reanimated.View style={[styleAnimation]}>
              <Button
                title="Excluir"
                onPress={() => {
                  setTransacoes(
                    transacoes.filter((transacao) => transacao.id !== item.id)
                  );
                }}
              />
            </Reanimated.View>
          );
        }}
      >
        <View
          style={[
            styles.item,
            item.tipo === "receita" ? styles.receita : styles.despesa,
          ]}
        >
          <Text style={styles.itemText}>{item.descricao}</Text>
          <Text style={styles.itemText}>{item.valor.toFixed(2)}</Text>
          <Text style={styles.itemText}>{formatDate(item.data)}</Text>

          {isLandscape && (
            <>
              <Text style={styles.itemText}>{item.hora}</Text>
              <Text style={styles.itemText}>{item.categoria}</Text>
              <Text style={styles.itemText}>{item.tipo}</Text>
              <Text style={styles.itemText}>{item.moeda}</Text>
            </>
          )}
        </View>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por descrição..."
        value={filtroBusca}
        onChangeText={setFiltroBusca}
      />
      <View style={styles.controls}>
        <Picker
          selectedValue={ordenarPor}
          onValueChange={(itemValue) => setOrdenarPor(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Ordenar por Descrição" value="descricao" />
          <Picker.Item label="Ordenar por Valor" value="valor" />
          <Picker.Item label="Ordenar por Data" value="data" />
        </Picker>

        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.button, styles.buttonTodos]}
            onPress={() => setFiltroTipo("todos")}
          >
            <Text style={styles.buttonText}>Mostrar Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonDespesas]}
            onPress={() => setFiltroTipo("despesa")}
          >
            <Text style={styles.buttonText}>Mostrar Despesas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonReceitas]}
            onPress={() => setFiltroTipo("receita")}
          >
            <Text style={styles.buttonText}>Mostrar Receitas</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={transacoesOrdenadas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <TouchableOpacity
        style={[styles.button, styles.buttonCadastrar]}
        onPress={() =>
          navigation.navigate("Cadastrar Transação", { setTransacoes })
        }
      >
        <Text style={styles.buttonText}>Cadastrar Nova Transação</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  controls: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonTodos: {
    backgroundColor: "#9E9E9E",
  },
  buttonDespesas: {
    backgroundColor: "#F44336",
  },
  buttonReceitas: {
    backgroundColor: "#3F51B5",
  },
  buttonCadastrar: {
    backgroundColor: "#673AB7",
    marginTop: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    flex: 1,
    textAlign: "left",
  },
  searchInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 15,
    borderRadius: 8,
  },
  receita: {
    backgroundColor: "#E8F5E9",
  },
  despesa: {
    backgroundColor: "#FFEBEE",
  },
});

export default TransacaoListScreen;
