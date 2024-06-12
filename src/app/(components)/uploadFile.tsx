import "moment/locale/pt-br";
import { Dispatch, SetStateAction, useState } from "react";
import * as XLSX from "xlsx";
import { SelectSheet } from "./selectSheet";

interface UploadFileProps {
  idList: string | undefined;
  setExcelData: Dispatch<any>;
  setNameFile: Dispatch<SetStateAction<string | undefined>>;
  setActiveStep: Dispatch<SetStateAction<number>>;
  activeStep: number;
  nameFile: string | undefined;
}

export function UploadFile({
  idList,
  setExcelData,
  setNameFile,
  setActiveStep,
  activeStep,
  nameFile,
}: UploadFileProps) {
  const [workbook, setWorkbook] = useState<any>();
  const [worksheetNames, setWorksheetNames] = useState<any>();
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
          handleGetFile(e.target.result);
        };
      } else {
        setTypeError("Please select only excel file types");
      }
    } else {
      console.log("Please select your file");
    }
  };

  const handleGetFile = (file: any) => {
    if (file !== null) {
      const excelRead = XLSX.read(file, { type: "buffer" });
      setWorkbook(excelRead);
      setWorksheetNames(excelRead.SheetNames);
      setActiveStep(3);
    }
  };

  return (
    idList && (
      <div className="flex flex-col items-center">
        {activeStep === 2 && (
          <>
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
          </>
        )}

        {activeStep === 3 && (
          <SelectSheet
            worksheetNames={worksheetNames}
            workbook={workbook}
            setExcelData={setExcelData}
            nameFile={nameFile}
            setActiveStep={setActiveStep}
          />
        )}
        {typeError && <div role="alert">{typeError}</div>}
      </div>
    )
  );
}
