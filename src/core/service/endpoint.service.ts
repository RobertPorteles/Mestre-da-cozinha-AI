import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from "@google/genai";
import { Receita, ReceitaAPI, ReceitaParsed } from '../models/receita';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  // Nota: Este serviço simula o Controller do servidor Java.
  // No mundo real: return this.http.post<Receita>('api/receitas/sugerir', { ingredientes: promptUsuario });


  constructor() {
    // Inicializa o cliente Gemini
   
  }

  parseTodasReceitas(apiResponse: ReceitaAPI, promptOriginal: string): ReceitaParsed[] {
  const conteudo = apiResponse.conteudo;
  const receitas: ReceitaParsed[] = [];
  
  // Regex para encontrar títulos de receitas (### 1. Titulo ou ### Titulo)
  const receitasMatch = conteudo.split(/###\s*\d*\.?\s*/g).filter(r => r.trim());
  
  // Se não encontrar receitas com ###, trata como uma receita única
  if (receitasMatch.length <= 1) {
    return [this.parseSingleReceita(conteudo, promptOriginal)];
  }
  
  // Processa TODAS as receitas encontradas (ignora o primeiro item que é o texto antes da primeira receita)
  for (let i = 1; i < receitasMatch.length; i++) {
    const receitaTexto = receitasMatch[i];
    if (receitaTexto.trim()) {
      receitas.push(this.parseSingleReceita(receitaTexto, promptOriginal, i));
    }
  }
  
  return receitas.length > 0 ? receitas : [this.parseSingleReceita(conteudo, promptOriginal)];
}

// Se você quer apenas a primeira (comportamento atual)
 parseReceita(apiResponse: ReceitaAPI, promptOriginal: string): ReceitaParsed {
  const todasReceitas = this.parseTodasReceitas(apiResponse, promptOriginal);
  return todasReceitas[0];
}

 parseSingleReceita(texto: string, promptOriginal: string, index: number = 0): ReceitaParsed {
  const linhas = texto.split('\n').filter(l => l.trim());
  
  // Extrai o título (primeira linha não vazia)
  let titulo = linhas[0]?.replace(/\*\*/g, '').trim() || 'Receita Deliciosa';
  
  // Remove numeração do título se existir (ex: "1. Bolo" -> "Bolo")
  titulo = titulo.replace(/^\d+\.\s*/, '');
  
  // Extrai ingredientes do prompt original
  const ingredientes = this.extractIngredientes(promptOriginal);
  
  // Extrai instruções (procura por "Preparo:" ou similar)
  const instrucoes = this.extractInstrucoes(texto);
  
  // Estima tempo de preparo baseado no texto
  const tempoPreparo = this.extractTempoPreparo(texto);
  
  // Estima calorias (valor padrão se não encontrado)
  const calorias = this.extractCalorias(texto);
  
  return {
    id: `${Date.now()}-${index}`,
    titulo,
    ingredientes,
    instrucoes,
    tempoPreparo,
    calorias,
    dataGeracao: new Date()
  };
}

 extractIngredientes(prompt: string): string[] {
  // Separa ingredientes por vírgula ou "e"
  const ingredientes = prompt
    .split(/,|e(?=\s)/)
    .map(i => i.trim())
    .filter(i => i.length > 0)
    .map(i => {
      // Capitaliza primeira letra
      return i.charAt(0).toUpperCase() + i.slice(1);
    });
  
  return ingredientes.length > 0 ? ingredientes : ['Ingredientes variados'];
}

 extractInstrucoes(texto: string): string[] {
  // Procura por seção de preparo
  const preparoMatch = texto.match(/\*\*Preparo:\*\*\s*([\s\S]*?)(?=\n\n|$)/i);
  
  if (preparoMatch) {
    const preparoTexto = preparoMatch[1].trim();
    
    // Divide por sentenças (ponto final seguido de espaço/maiúscula)
    const instrucoes = preparoTexto
      .split(/\.(?=\s+[A-Z]|\s*$)/)
      .map(i => i.trim())
      .filter(i => i.length > 20) // Remove frases muito curtas
      .map(i => i.endsWith('.') ? i : i + '.');
    
    return instrucoes.length > 0 ? instrucoes : [preparoTexto];
  }
  
  // Se não encontrar seção de preparo, tenta extrair todo o texto após o título
  const linhas = texto.split('\n').filter(l => l.trim() && !l.includes('**'));
  const textoCompleto = linhas.slice(1).join(' ').trim();
  
  if (textoCompleto.length > 50) {
    const instrucoes = textoCompleto
      .split(/\.(?=\s+[A-Z])/)
      .map(i => i.trim())
      .filter(i => i.length > 20)
      .map(i => i.endsWith('.') ? i : i + '.');
    
    return instrucoes.length > 0 ? instrucoes : [textoCompleto];
  }
  
  return ['Siga as instruções tradicionais de preparo.'];
}

 extractTempoPreparo(texto: string): string {
  // Procura por menções de tempo (35-45 minutos, 20 minutos, etc)
  const tempoMatch = texto.match(/(\d+(?:-\d+)?)\s*(?:minutos?|min|horas?|h)/i);
  
  if (tempoMatch) {
    const tempo = tempoMatch[1];
    const unidade = tempoMatch[0].toLowerCase().includes('hora') ? 'h' : 'min';
    return `${tempo} ${unidade}`;
  }
  
  // Estimativa baseada no tamanho do texto
  const tamanho = texto.length;
  if (tamanho > 1000) return '45-60 min';
  if (tamanho > 500) return '30-45 min';
  return '20-30 min';
}

 extractCalorias(texto: string): string {
  // Procura por menções explícitas de calorias
  const caloriasMatch = texto.match(/(\d+)\s*(?:kcal|calorias)/i);
  
  if (caloriasMatch) {
    return `${caloriasMatch[1]} kcal`;
  }
  
  // Estimativa padrão
  return '350 kcal';
}

  // Simula busca de histórico do banco de dados
  
}