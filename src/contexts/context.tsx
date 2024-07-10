"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface Erros {
  type: string;
  day: string;
}

interface ProsIdName {
  id: string | undefined;
  name: string | undefined;
}

interface GeneralContextType {
  listErrors: Erros[];
  setListErros: Dispatch<SetStateAction<Erros[]>>;
  sheetName: string;
  setSheetName: Dispatch<SetStateAction<string>>;
  member: { name: string; userName: string };
  setMember: Dispatch<SetStateAction<{ name: string; userName: string }>>;
  setBoard: Dispatch<SetStateAction<ProsIdName>>;
  board: ProsIdName;
  setList: Dispatch<SetStateAction<ProsIdName>>;
  list: ProsIdName;
  setTags: Dispatch<SetStateAction<ProsIdName[]>>;
  tags: ProsIdName[];
  setExcelData: Dispatch<any>;
  excelData: any;
  setNameFile: Dispatch<SetStateAction<string | undefined>>;
  nameFile: string | undefined;
  setSteps: Dispatch<
    SetStateAction<
      {
        title: string;
        description: string;
      }[]
    >
  >;
  steps: {
    title: string;
    description: string;
  }[];
  setWorkbook: Dispatch<any>;
  workbook: any;
  setWorksheetNames: Dispatch<any>;
  worksheetNames: any;
}

const GeneralContext = createContext({} as GeneralContextType);

export function GeneralContextProvider({ children }: { children: ReactNode }) {
  const [board, setBoard] = useState<ProsIdName>({
    id: undefined,
    name: undefined,
  });
  const [list, setList] = useState<ProsIdName>({
    id: undefined,
    name: undefined,
  });
  const [tags, setTags] = useState<ProsIdName[]>([
    {
      id: undefined,
      name: undefined,
    },
  ]);
  const [excelData, setExcelData] = useState<any>(null);
  const [listErrors, setListErros] = useState<Erros[]>([]);
  const [sheetName, setSheetName] = useState<string>("");
  const [nameFile, setNameFile] = useState<string>();
  const [member, setMember] = useState<{ name: string; userName: string }>({
    name: "",
    userName: "",
  });
  const [steps, setSteps] = useState([
    { title: "Selecionar usuário", description: "" },
    { title: "Selecionar quadro", description: "" },
    { title: "Selecionar coluna", description: "" },
    { title: "Selecionar etiqueta", description: "" },
    { title: "Carregar arquivo de excel", description: "" },
    { title: "Selecionar aba do arquivo", description: "" },
    { title: "Dados do arquivo carregado", description: "" },
    { title: "Criar cards", description: "" },
    { title: "Cards gerados", description: "" },
  ]);
  const [workbook, setWorkbook] = useState<any>();
  const [worksheetNames, setWorksheetNames] = useState<any>();
  return (
    <GeneralContext.Provider
      value={{
        listErrors,
        setListErros,
        sheetName,
        setSheetName,
        member,
        setMember,
        board,
        setBoard,
        list,
        setList,
        tags,
        setTags,
        excelData,
        setExcelData,
        setNameFile,
        nameFile,
        setSteps,
        steps,
        setWorkbook,
        workbook,
        worksheetNames,
        setWorksheetNames,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
}

export const useGeneralContext = () => useContext(GeneralContext);
