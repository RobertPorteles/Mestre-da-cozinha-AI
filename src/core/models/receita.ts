export interface Receita {
    id: string;
    titulo: string;
    ingredientes: string[];
    instrucoes: string[];
    tempoPreparo: string;
    calorias: string;
    dataGeracao: Date;
}

export interface ReceitaAPI {
  conteudo: string;
}

export interface ReceitaParsed {
  id: string;
  titulo: string;
  ingredientes: string[];
  instrucoes: string[];
  tempoPreparo: string;
  calorias: string;
  dataGeracao: Date;
}

export interface ReceitaConsulta {
  id: string;
  nome: string;
  ingredientes: string[];
  preparo: string[];
  tempoPreparo: string;
  dataHora: Date
}