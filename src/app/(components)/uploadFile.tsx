import { useGeneralContext } from "@/contexts/context";
import "moment/locale/pt-br";
import { Dispatch, SetStateAction, useState } from "react";
import * as XLSX from "xlsx";

interface UploadFileProps {
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function UploadFile({ setActiveStep }: UploadFileProps) {
  const {
    setExcelData,
    setNameFile,
    list,
    setSteps,
    setWorksheetNames,
    setWorkbook,
  } = useGeneralContext();

  const [typeError, setTypeError] = useState<any>(null);

  const handleFile = (e: any) => {
    setWorksheetNames(undefined);
    setExcelData(null);
    setNameFile("");
    setWorkbook(undefined);
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];
    setNameFile(selectedFile.name);
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e: any) => {
          handleGetFile(e.target.result, selectedFile.name);
        };
      } else {
        setTypeError("Please select only excel file types");
      }
    } else {
      console.log("Please select your file");
    }
  };

  const handleGetFile = (file: any, name: string) => {
    if (file !== null) {
      const excelRead = XLSX.read(file, { type: "buffer" });
      setWorkbook(excelRead);
      setWorksheetNames(excelRead.SheetNames);
      setActiveStep((prev) => {
        setSteps((prevStep) => {
          prevStep[prev].description = name;
          return prevStep;
        });
        return prev + 1;
      });
    }
  };

  return (
    list.id && (
      <div className="flex flex-col items-center">
        <div className="text-xl mb-4">Selecionar o arquivo excel</div>
        <div className="flex flex-col">
          <label
            htmlFor="arquivo"
            className="bg-base p-2 w-56 text-white text-center cursor-pointer hover:bg-hover"
          >
            Carregar arquivo
          </label>
          <input
            type="file"
            name="arquivo"
            id="arquivo"
            required
            onChange={handleFile}
          />
        </div>
        {typeError && <div role="alert">{typeError}</div>}
      </div>
    )
  );
}
