export interface Receita {
    id: string;
    titulo: string;
    ingredientes: string[];
    instrucoes: string[];
    tempoPreparo: string;
    calorias: string;
    dataGeracao: Date;
}