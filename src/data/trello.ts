/* eslint-disable import/no-anonymous-default-export */
import { Dispatch, SetStateAction } from "react";
import { api } from "./api";

const key = process.env.NEXT_PUBLIC_TRELLO_KEY;
const tokenAnita = process.env.NEXT_PUBLIC_TRELLO_TOKEN_ANITA;
const tokenJulyana = process.env.NEXT_PUBLIC_TRELLO_TOKEN_JULYANA;
const idOrganization = process.env.NEXT_PUBLIC_TRELLO_ID_ORGANIZATION;

export default {
  getListBoards: async (member: string): Promise<any> => {
    const token = member === "anita" ? tokenAnita : tokenJulyana;
    const response = await api({
      path: `/organizations/${idOrganization}/boards?filter=open&key=${key}&token=${token}`,
      method: "GET",
      type: "Erro ao Listar Quadros",
    });
    const data = await response?.json();
    return data || [];
  },
  getLists: async (member: string, idBoard?: string): Promise<any> => {
    const token = member === "anita" ? tokenAnita : tokenJulyana;
    const reponse = await api({
      path: `/boards/${idBoard}/lists?key=${key}&token=${token}`,
      method: "GET",
      type: "Erro ao listar as colunas do quadro",
    });
    const data = await reponse?.json();
    return data || [];
  },
  generateCards: async (
    member: string,
    idList: string | undefined,
    data: any,
    setListErros: Dispatch<SetStateAction<any[]>>
  ): Promise<any> => {
    const token = member === "anita" ? tokenAnita : tokenJulyana;
    const reponse = await api({
      path: `/cards?idList=${idList}&key=${key}&token=${token}`,
      method: "POST",
      type: `Erro ao gerar o Card ${data.name}`,
      setListErros,
      body: data,
    });
    const returnData = await reponse?.json();
    return returnData || {};
  },
  updateCard: async (
    member: string,
    id: string,
    data: any,
    setListErros: Dispatch<SetStateAction<any[]>>
  ): Promise<any> => {
    const token = member === "anita" ? tokenAnita : tokenJulyana;
    await api({
      path: `/cards/${id}?key=${key}&token=${token}`,
      method: "PUT",
      type: `Erro ao criar a data de finalização ${data.due}`,
      setListErros,
      body: data,
    });
  },
  generateComment: async (
    member: string,
    text: string,
    id: any,
    setListErros: Dispatch<SetStateAction<any[]>>
  ): Promise<any> => {
    const token = member === "anita" ? tokenAnita : tokenJulyana;
    await api({
      path: `/cards/${id}/actions/comments?text=${text}&key=${key}&token=${token}`,
      method: "POST",
      type: `Erro ao gerar o comentário: ${text}`,
      setListErros,
    });
  },
};
