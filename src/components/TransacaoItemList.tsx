import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");
const isLandscape = width > height;

const TransacaoItemList = ({ transacao, onEditar, onExcluir }) => {
  const { descricao, valor, data, hora, categoria, tipo, moeda } = transacao;

  const formattedData = data instanceof Date ? data.toLocaleDateString() : data;
  const formattedHora = hora instanceof Date ? hora.toLocaleTimeString() : hora;

  const rightSwipe = (
    <View style={styles.action}>
      <TouchableOpacity onPress={() => onEditar(transacao)}>
        <Text style={styles.actionText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  const leftSwipe = (
    <View style={styles.action}>
      <TouchableOpacity onPress={() => onExcluir(transacao)}>
        <Text style={styles.actionText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={rightSwipe} renderLeftActions={leftSwipe}>
      <View
        style={[
          styles.container,
          tipo === "receita" ? styles.receita : styles.despesa,
        ]}
      >
        <Text style={styles.descricao}>{descricao}</Text>
        <Text style={styles.detalhes}>
          Valor: {moeda} {valor.toFixed(2)}
        </Text>
        <Text style={styles.detalhes}>Data: {formattedData}</Text>

        {isLandscape && (
          <>
            <Text style={styles.detalhes}>Hora: {formattedHora}</Text>
            <Text style={styles.detalhes}>Categoria: {categoria}</Text>
            <Text style={styles.tipo}>
              {tipo === "receita" ? "Receita" : "Despesa"}
            </Text>
            <Text style={styles.detalhes}>Moeda: {moeda}</Text>
          </>
        )}
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  receita: {
    borderColor: "#4caf50",
  },
  despesa: {
    borderColor: "#f44336",
  },
  descricao: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detalhes: {
    fontSize: 14,
    color: "#555",
  },
  tipo: {
    marginTop: 5,
    fontSize: 14,
    fontStyle: "italic",
  },
  action: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff4444",
    width: 100,
    height: "100%",
    borderRadius: 10,
    marginVertical: 8,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TransacaoItemList;
