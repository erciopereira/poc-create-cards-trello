/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { api } from "@/data/api";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const id = process.env.NEXT_PUBLIC_TRELLO_ID;
  const key = process.env.NEXT_PUBLIC_TRELLO_KEY;
  const token = process.env.NEXT_PUBLIC_TRELLO_TOKEN;
  const [excelFile, setExcelFile] = useState<any>(null);
  const [typeError, setTypeError] = useState<any>(null);
  const [dataBoard, setDataBoard] = useState<any>({});
  const [lists, setLists] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // submit state
  const [excelData, setExcelData] = useState<any>(null);

  // onchange event
  const handleFile = (e: any) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e: any) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };

  // submit event
  const handleFileSubmit = (e: any) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
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
    }
  };

  async function getBoards() {
    const reponse = await api(`/boards/${id}?key=${key}&token=${token}`, "GET");
    const data = await reponse.json();
    setDataBoard(data);
    getLists(data.id);
  }
  async function getLists(id: string) {
    const reponse = await api(
      `/boards/${id}/lists?key=${key}&token=${token}`,
      "GET"
    );
    const data = await reponse.json();
    setLists(data);
  }

  async function createCard(
    content: string,
    format: string,
    listComents: string[],
    date: string
  ) {
    console.log(date);
    const idList = lists[0].id;
    const data = {
      name: `${content} - ${format}`,
    };
    const reponse = await api(
      `/cards?idList=${idList}&key=${key}&token=${token}`,
      "POST",
      data
    );
    const returnData = await reponse.json();
    updateCard(returnData.id, listComents, date);
  }

  async function updateCard(id: string, listComents: string[], date: string) {
    const data = { due: date };
    await api(`/cards/${id}?key=${key}&token=${token}`, "PUT", data);
    addComment(listComents, id);
  }

  async function addComment(listComents: string[], id: string) {
    for (const comment of listComents) {
      await generateComment(comment, id);
    }
  }

  async function generateComment(comment: any, id: string) {
    const text = `${comment.title}: ${comment.content}`;
    await api(
      `/cards/${id}/actions/comments?text=${text}&key=${key}&token=${token}`,
      "POST"
    );
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
            // const teste = moment(element[item]);
            // const newFormatDate = teste.format("YYYY/DD/MM");
            date = new Date(`${element[item]} 08:00`); // new Date(`${element[item]} 08:00`);
            break;
          case "Considerações Gustavo":
          case "Considerações Julyana":
          case "Considerações Maila":
          case "Considerações Marilia":
          case "Considerações Natalia":
          case "Considerações Quésia":
          case "Referência de conteúdo":
          case "Referência visual":
          case "Pedidos de CTA específicos":
            if (element[item] !== "")
              listComents.push({
                title: item,
                content: element[item],
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
    getBoards();
  }, []);

  console.log(excelData);

  return (
    <div>
      <h1>Nome do Quadro {dataBoard?.name}</h1>

      <button className="border-2 p-2 rounded" onClick={() => gerarCard()}>
        Criar CARD
      </button>
      {loading && <div>Criando cards...</div>}

      <h3>Upload & View Excel Sheets</h3>

      {/* form */}
      <form onSubmit={handleFileSubmit}>
        <input type="file" required onChange={handleFile} />
        <button className="border-2 p-2 rounded" type="submit">
          UPLOAD
        </button>
        {typeError && <div role="alert">{typeError}</div>}
      </form>

      {/* view data */}
      <>
        {excelData ? (
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
        ) : (
          <div>No File is uploaded yet!</div>
        )}
      </>
    </div>
  );
}
