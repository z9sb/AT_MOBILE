import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import MoedaPicker from "../components/MoedaPicker";
import MoedaAPI from "../api/listaMoedas";
import DataPickerComponent from "../components/dataPickerComponent";
import TimePickerComponent from "../components/timePickerComponent";

const TransacaoListScreen = ({ navigation, route }) => {
  const { setTransacoes, transacoes } = route.params;
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("despesa");
  const [moeda, setMoeda] = useState();
  const [editando, setEditando] = useState(false);
  const [transacaoEditar, setTransacaoEditar] = useState(null);

  useEffect(() => {
    if (route.params?.transacao) {
      const transacao = route.params.transacao;
      setTransacaoEditar(transacao);
      setDescricao(transacao.descricao);
      setValor(transacao.valor.toString());
      setData(new Date(transacao.data));
      setCategoria(transacao.categoria);
      setTipo(transacao.tipo);
      setMoeda(transacao.moeda);
      setEditando(true);
    }
  }, [route.params?.transacao]);

  const formatarData = (data) => {
    const parsedDate = new Date(data);
    const dia = String(parsedDate.getDate()).padStart(2, "0");
    const mes = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const ano = parsedDate.getFullYear();
    return `${dia}-${mes}-${ano}`;
  };

  const adicionarTransacao = async () => {
    let novaTransacao = {
      descricao,
      valor: parseFloat(valor),
      data,
      hora,
      categoria,
      tipo,
      moeda,
      id: Date.now().toString(),
    };
    novaTransacao.data = formatarData(novaTransacao.data);

    if (moeda != "BRL") {
      console.log(moeda);
      console.log(data);
      const cotacao = await MoedaAPI.obterCotacao(moeda, novaTransacao.data);
      if (cotacao) {
        novaTransacao.valor *= cotacao.cotacaoVenda;
        novaTransacao.moeda = "BRL";
      }
    }

    if (editando && transacaoEditar) {
      novaTransacao.id = transacaoEditar.id;
      setTransacoes((prevTransacoes) =>
        prevTransacoes.map((transacao) =>
          transacao.id === transacaoEditar.id ? novaTransacao : transacao
        )
      );
    } else {
      setTransacoes((prevTransacoes) => [...prevTransacoes, novaTransacao]);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />
      <DataPickerComponent setData={setData} data={data} />
      <TimePickerComponent setHora={setHora} hora={hora} />
      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={categoria}
        onChangeText={setCategoria}
      />
      <Picker
        selectedValue={tipo}
        onValueChange={(value) => setTipo(value)}
        style={styles.input}
      >
        <Picker.Item label="Despesa" value="despesa" />
        <Picker.Item label="Receita" value="receita" />
      </Picker>

      <MoedaPicker setMoeda={setMoeda} moeda={moeda} />

      <Button
        title={editando ? "Atualizar Transação" : "Salvar Transação"}
        onPress={adicionarTransacao}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default TransacaoListScreen;
