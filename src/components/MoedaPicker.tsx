import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import MoedaAPI from "../api/listaMoedas";

const MoedaPicker = ({ setMoeda, moedaInicial = "" }) => {
  const [moedas, setMoedas] = useState([]);
  const [moeda, setMoedaState] = useState(moedaInicial);

  useEffect(() => {
    const carregarMoedas = async () => {
      const moedasObtidas = await MoedaAPI.obterMoedas();
      setMoedas(moedasObtidas);
    };

    carregarMoedas();
  }, []);

  useEffect(() => {
    if (moedas.length > 0) {
      if (!moedas.some((moeda) => moeda.simbolo === moedaInicial)) {
        setMoedaState(moedas[0].simbolo);
      } else {
        setMoedaState(moedaInicial);
      }
    }
  }, [moedas, moedaInicial]);

  useEffect(() => {
    setMoeda(moeda);
  }, [moeda, setMoeda]);

  return (
    <Picker
      selectedValue={moeda}
      onValueChange={(itemValue) => {
        setMoedaState(itemValue);
        setMoeda(itemValue);
      }}
    >
      {moedas.map((moeda) => (
        <Picker.Item
          key={moeda.simbolo}
          label={`${moeda.simbolo} - ${moeda.nomeFormatado}`}
          value={moeda.simbolo}
        />
      ))}
    </Picker>
  );
};

export default MoedaPicker;
