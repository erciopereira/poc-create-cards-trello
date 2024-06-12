import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import * as XLSX from "xlsx";

interface SelectSheetProps {
  worksheetNames: any;
  workbook: any;
  setExcelData: Dispatch<any>;
  nameFile: string | undefined;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function SelectSheet({
  worksheetNames,
  workbook,
  setExcelData,
  nameFile,
  setActiveStep,
}: SelectSheetProps) {
  const handleFileSubmit = (sheetName: string) => {
    const worksheet = workbook.Sheets[sheetName];
    const data: any = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    const newData = data.map((item: any) => {
      if (typeof item.Data === "number") {
        const date = new Date(Math.round((item.Data - 25569) * 86400 * 1000));
        const newDateUTC = date.toUTCString();
        const day = moment.utc(newDateUTC).format("dddd");
        const dayMonth = moment.utc(newDateUTC).format("DD/MM");
        const dateFormat = moment.utc(newDateUTC).format("YYYY-MM-DD");
        return { ...item, Data: `${day}, ${dayMonth}`, dateRef: dateFormat };
      }
      return item;
    });
    setExcelData(newData);
    setActiveStep(4);
  };

  return (
    worksheetNames && (
      <div className="flex flex-col items-center">
        <div className="text-xl mb-4">
          <span>Nome do arquivo selecionado: </span>
          <span className="font-bold">{nameFile}</span>
        </div>
        <div className="text-xl mb-4">
          Selecione a aba do documento que deseja apresentar os dados
        </div>
        <div className="flex gap-2">
          {worksheetNames?.map((item: any) => (
            <button
              className="border p-2 rounded bg-base text-white hover:bg-hover"
              key={item}
              value={item}
              onClick={() => handleFileSubmit(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    )
  );
}
