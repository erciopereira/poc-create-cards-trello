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

interface ErrorApiContextType {
  listErrors: Erros[];
  setListErros: Dispatch<SetStateAction<Erros[]>>;
  sheetName: string;
  setSheetName: Dispatch<SetStateAction<string>>;
}

const ErrosApiContext = createContext({} as ErrorApiContextType);

export function ErrosApiProvider({ children }: { children: ReactNode }) {
  const [listErrors, setListErros] = useState<Erros[]>([]);
  const [sheetName, setSheetName] = useState<string>("");
  return (
    <ErrosApiContext.Provider
      value={{ listErrors, setListErros, sheetName, setSheetName }}
    >
      {children}
    </ErrosApiContext.Provider>
  );
}

export const useErrorsApi = () => useContext(ErrosApiContext);
