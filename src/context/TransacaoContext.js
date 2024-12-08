import React, { createContext, useContext, useState } from "react";

const TransacaoContext = createContext();

export const TransacaoProvider = ({ children }) => {
  const [transacoes, setTransacoes] = useState([]);

  return (
    <TransacaoContext.Provider value={{ transacoes, setTransacoes }}>
      {children}
    </TransacaoContext.Provider>
  );
};

export const useTransacoes = () => {
  return useContext(TransacaoContext);
};
