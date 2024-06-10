/* eslint-disable import/no-anonymous-default-export */
import { Dispatch, SetStateAction } from "react";
import { api } from "./api";

const key = process.env.NEXT_PUBLIC_TRELLO_KEY;
const token = process.env.NEXT_PUBLIC_TRELLO_TOKEN;
const idOrganization = process.env.NEXT_PUBLIC_TRELLO_ID_ORGANIZATION;

const concatKeyToken = `key=${key}&token=${token}`;

export default {
  getListBoards: async (
    setListErros: Dispatch<SetStateAction<any[]>>
  ): Promise<any> => {
    const response = await api(
      `/organizations/${idOrganization}/boards?${concatKeyToken}`,
      "GET",
      "Erro ao Listar Quadros",
      setListErros
    );
    const data = await response?.json();
    return data || [];
  },
  getLists: async (
    idBoard: string,
    setListErros: Dispatch<SetStateAction<any[]>>
  ): Promise<any> => {
    const reponse = await api(
      `/boards/${idBoard}/lists?${concatKeyToken}`,
      "GET",
      "Erro ao listar as listas do quadro",
      setListErros
    );
    const data = await reponse?.json();
    return data || [];
  },
  getListMembers: async (
    setListErros: Dispatch<SetStateAction<any[]>>
  ): Promise<any> => {
    const response = await api(
      `/organizations/${idOrganization}/members?${concatKeyToken}`,
      "GET",
      "Erro ao Listar Membros",
      setListErros
    );
    const data = await response?.json();
    return data || [];
  },
  generateCards: async (
    idList: string,
    data: any,
    setListErros: Dispatch<SetStateAction<any[]>>
  ): Promise<any> => {
    const reponse = await api(
      `/cards?idList=${idList}&${concatKeyToken}`,
      "POST",
      `Erro ao gerar o Card ${data.name}`,
      setListErros,
      data
    );
    const returnData = await reponse?.json();
    return returnData || {};
  },
  updateCard: async (
    id: string,
    data: any,
    setListErros: Dispatch<SetStateAction<any[]>>
  ): Promise<any> => {
    await api(
      `/cards/${id}?${concatKeyToken}`,
      "PUT",
      `Erro ao criar a data de finalização ${data.due}`,
      setListErros,
      data
    );
  },
  generateComment: async (
    text: string,
    id: any,
    setListErros: Dispatch<SetStateAction<any[]>>
  ): Promise<any> => {
    await api(
      `/cards/${id}/actions/comments?text=${text}&${concatKeyToken}`,
      "POST",
      `Erro ao gerar o comentário: ${text}`,
      setListErros
    );
  },
};
