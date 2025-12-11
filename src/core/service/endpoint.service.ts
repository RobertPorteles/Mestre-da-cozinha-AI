import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from "@google/genai";
import { Receita } from '../models/receita';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  // Nota: Este serviço simula o Controller do servidor Java.
  // No mundo real: return this.http.post<Receita>('api/receitas/sugerir', { ingredientes: promptUsuario });

  private ai: GoogleGenAI;

  constructor() {
    // Inicializa o cliente Gemini
    let apiKey = '';
    try {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env) {
        apiKey = process.env['API_KEY'] || '';
      }
    } catch (e) {
      console.warn('Ambiente não suporta process.env');
    }

    if (!apiKey) {
      console.error('API_KEY não encontrada! A funcionalidade de IA não funcionará.');
      // Inicializa com chave vazia para não quebrar a injeção de dependência
      apiKey = 'chave-ausente';
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async gerarReceitaNoBackend(ingredientesUsuario: string): Promise<Receita> {
    // Prompt engenheirado para atuar como um Chef que improvisa com o que tem
    const prompt = `
      Você é um Chef de Cozinha especialista em "limpar a geladeira" e evitar desperdício.
      O usuário informou que tem APENAS estes ingredientes em casa: "${ingredientesUsuario}".
      
      Sua missão:
      1. Crie uma receita deliciosa usando PRINCIPALMENTE esses ingredientes.
      2. Você pode assumir que o usuário tem "itens básicos de despensa" (Sal, Óleo/Azeite, Água, Pimenta, Açúcar, Vinagre).
      3. Se os ingredientes forem muito aleatórios, seja criativo (ex: uma salada, um mexido, uma sopa).
      4. Se for impossível fazer algo comestível, sugira a receita mais simples possível que utilize pelo menos um dos ingredientes principais.
      
      Gere a resposta estritamente em Português do Brasil seguindo o schema JSON.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titulo: { type: Type.STRING, description: "Nome criativo da receita" },
              ingredientes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista completa de ingredientes usados (incluindo os básicos se necessário)"
              },
              instrucoes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Passo a passo detalhado do preparo"
              },
              tempoPreparo: { type: Type.STRING, description: "Tempo estimado (ex: 20 min)" },
              calorias: { type: Type.STRING, description: "Estimativa calórica por porção (ex: 350 kcal)" }
            },
            required: ["titulo", "ingredientes", "instrucoes", "tempoPreparo", "calorias"]
          }
        }
      });

      const jsonText = response.text || "{}";
      const data = JSON.parse(jsonText);

      return {
        id: crypto.randomUUID(),
        titulo: data.titulo,
        ingredientes: data.ingredientes,
        instrucoes: data.instrucoes,
        tempoPreparo: data.tempoPreparo,
        calorias: data.calorias,
        dataGeracao: new Date()
      };

    } catch (error) {
      console.error("Erro ao gerar receita:", error);
      throw new Error("O Chef IA está ocupado. Tente novamente.");
    }
  }

  // Simula busca de histórico do banco de dados
  getHistoricoReceitas(): Receita[] {
    return [];
  }
}