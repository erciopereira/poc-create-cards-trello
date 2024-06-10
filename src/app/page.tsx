/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useErrorsApi } from "@/contexts/errors-api-context";
import trelloApi from "@/data/trello";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const { setListErros, listErrors } = useErrorsApi();
  const [typeError, setTypeError] = useState<any>(null);
  const [lists, setLists] = useState<
    [
      {
        id: string;
        name: string;
      }
    ]
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const [idBoard, setIdBoard] = useState<string>();
  const [listBoards, setListBoards] = useState<
    [
      {
        id: string;
        name: string;
      }
    ]
  >();
  const [idList, setIdList] = useState<string>("");
  const [excelData, setExcelData] = useState<any>(null);
  const [nameFile, setNameFile] = useState<string>();
  const [workbook, setWorkbook] = useState<any>();
  const [worksheetNames, setWorksheetNames] = useState<any>();
  const [listMembers, setListMembers] = useState<any>([]);

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
    }
  };

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
  };

  async function createCard(
    content: string,
    format: string,
    listComents: string[],
    date: string
  ) {
    const data = {
      name: `${content} - ${format}`,
    };
    const reponse = await trelloApi.generateCards(idList, data, setListErros);
    const dueDate = { due: date };
    await trelloApi.updateCard(reponse.id, dueDate, setListErros);
    await addComment(listComents, reponse.id);
  }

  async function addComment(listComents: any, id: string) {
    for (const comment of listComents) {
      const member = comment.member || "";
      const text = `${member} ${comment.title}: ${comment.content}`;
      await trelloApi.generateComment(text, id, setListErros);
    }
  }

  async function gerarCard() {
    setLoading(true);
    for (const element of excelData) {
      let content: string = "";
      let format: string = "";
      let date: any = "";
      const listComents: any = [];
      const obj: any = Object.keys(element);
      obj.forEach((item: any) => {
        switch (item) {
          case "Conteúdo":
            content = element[item];
            break;
          case "Formato":
            format = element[item];
            break;
          case "dateRef":
            date = new Date(`${element[item]} 08:00`);
            break;
          case "Considerações Gustavo":
          case "Considerações Julyana":
          case "Considerações Maila":
          case "Considerações Marilia":
          case "Considerações Natalia":
          case "Considerações Quésia":
          case "Referência de conteúdo":
          case "Pedidos de CTA específicos":
            if (element[item] !== "")
              listComents.push({
                title: item,
                content: element[item],
              });
            break;
          case "Referência visual":
            if (element[item] !== "")
              listComents.push({
                title: item,
                content: element[item],
                member: "@julyanamuniz2",
              });
            break;
          default:
            break;
        }
      });
      await createCard(content, format, listComents, date);
    }
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const response = await trelloApi.getListBoards(setListErros);
      setListBoards(response);
    })();
    (async () => {
      const response = await trelloApi.getListMembers(setListErros);
      setListMembers(response);
    })();
  }, []);

  useEffect(() => {
    if (idBoard) {
      (async () => {
        const response = await trelloApi.getLists(idBoard, setListErros);
        setLists(response);
      })();
    }
  }, [idBoard]);

  return (
    <div className="p-5">
      <div className="flex gap-5">
        <div className="flex flex-col mb-2">
          <label>Quadros do trello</label>
          <select
            className="border p-2 w-48"
            onChange={(e) => {
              setIdBoard(e.target.value);
              setLists(undefined);
              setIdList("");
            }}
          >
            <option value={undefined}></option>
            {listBoards?.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        {idBoard && (
          <div className="flex flex-col mb-5">
            <label>Listas do quadro</label>
            <select
              className="border p-2 w-48"
              onChange={(e) => setIdList(e.target.value)}
            >
              <option value={undefined}></option>
              {lists?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {idList !== "" && (
          <div className="flex">
            <div className="flex flex-col">
              <h3>Selecionar o arquivo excel</h3>
              <input
                type="file"
                required
                onChange={handleFile}
                className="mr-5"
              />
            </div>

            {worksheetNames && (
              <div className="flex flex-col mb-2">
                <label>Abas do arquivo</label>
                <select
                  className="border p-2 w-48"
                  onChange={(e) => {
                    handleFileSubmit(e.target.value);
                  }}
                >
                  <option value={undefined}></option>
                  {worksheetNames?.map((item: any) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {typeError && <div role="alert">{typeError}</div>}
          </div>
        )}
      </div>

      {listErrors.length ? (
        <div className="border p-5 mb-5">
          {listErrors.map((item, index) => (
            <div className="mb-5" key={index}>
              {item.type}
            </div>
          ))}
        </div>
      ) : null}

      {excelData && nameFile && (
        <div className="flex items-center">
          <div className="text-xl font-bold">{nameFile}</div>
          <div className="ml-10 self-center">
            <button
              className="border-2 p-1 rounded w-36"
              onClick={() => gerarCard()}
            >
              Criar CARDS
            </button>
          </div>
          {loading && <div>Criando cards...</div>}
        </div>
      )}
      <>
        {excelData && (
          <>
            <div className="flex w-fit font-bold border-b-2 sticky top-0 bg-white">
              {Object.keys(excelData[0]).map((key) => (
                <div className="w-64 p-4" key={key}>
                  {key}
                </div>
              ))}
            </div>
            <div className="flex flex-col w-fit">
              {excelData.map((individualExcelData: any, index: any) => (
                <div key={index} className="flex border-b-2">
                  {Object.keys(individualExcelData).map((key) => {
                    const verifyUrl = () => {
                      try {
                        return Boolean(new URL(individualExcelData[key]));
                      } catch (e) {
                        return "";
                      }
                    };
                    const isUrl = verifyUrl();
                    return (
                      <div
                        className={`w-64 ${
                          isUrl && "break-all"
                        } border-r-2 p-4`}
                        key={key}
                      >
                        {individualExcelData[key]}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </>
    </div>
  );
}
