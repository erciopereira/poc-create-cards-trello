/* eslint-disable import/no-anonymous-default-export */
import { Dispatch, SetStateAction } from "react";
import { api } from "./api";

const key = process.env.NEXT_PUBLIC_TRELLO_KEY;
const token = process.env.NEXT_PUBLIC_TRELLO_TOKEN;
const idOrganization = process.env.NEXT_PUBLIC_TRELLO_ID_ORGANIZATION;

const concatKeyToken = `key=${key}&token=${token}`;

export default {
  getListBoards: async (): Promise<any> => {
    const response = await api({
      path: `/organizations/${idOrganization}/boards?${concatKeyToken}`,
      method: "GET",
      type: "Erro ao Listar Quadros",
    });
    const data = await response?.json();
    return data || [];
  },
  getLists: async (idBoard: string): Promise<any> => {
    const reponse = await api({
      path: `/boards/${idBoard}/lists?${concatKeyToken}`,
      method: "GET",
      type: "Erro ao listar as listas do quadro",
    });
    const data = await reponse?.json();
    return data || [];
  },
  generateCards: async (
    idList: string | undefined,
    data: any,
    setListErros: Dispatch<SetStateAction<any[]>>
  ): Promise<any> => {
    const reponse = await api({
      path: `/cards?idList=${idList}&${concatKeyToken}`,
      method: "POST",
      type: `Erro ao gerar o Card ${data.name}`,
      setListErros,
      body: data,
    });
    const returnData = await reponse?.json();
    return returnData || {};
  },
  updateCard: async (
    id: string,
    data: any,
    setListErros: Dispatch<SetStateAction<any[]>>
  ): Promise<any> => {
    await api({
      path: `/cards/${id}?${concatKeyToken}`,
      method: "PUT",
      type: `Erro ao criar a data de finalização ${data.due}`,
      setListErros,
      body: data,
    });
  },
  generateComment: async (
    text: string,
    id: any,
    setListErros: Dispatch<SetStateAction<any[]>>
  ): Promise<any> => {
    await api({
      path: `/cards/${id}/actions/comments?text=${text}&${concatKeyToken}`,
      method: "POST",
      type: `Erro ao gerar o comentário: ${text}`,
      setListErros,
    });
  },
};
