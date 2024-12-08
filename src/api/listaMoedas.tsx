import axios from "axios";

const API_MOEDAS_URL =
  "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json";

const API_COTACAO_URL =
  "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='MOEDA'&@dataCotacao='DATA'&$top=1&$format=json";

class MoedaAPI {
  static async obterMoedas() {
    try {
      const response = await axios.get(API_MOEDAS_URL);
      const moedas = response.data.value.filter(
        (item) => item.simbolo && item.nomeFormatado
      );
      return moedas;
    } catch (error) {
      console.error("Erro ao obter a lista de moedas:", error);
      return [];
    }
  }

  static async obterCotacao(moeda: string, dataCotacao: string) {
    try {
      const url = API_COTACAO_URL.replace("MOEDA", moeda).replace(
        "DATA",
        dataCotacao
      );
      const response = await axios.get(url);
      return response.data.value[0];
    } catch (error) {
      console.error("Erro ao obter a cotação:", error);
      return null;
    }
  }
}

export default MoedaAPI;
