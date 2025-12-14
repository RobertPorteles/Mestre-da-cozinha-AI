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