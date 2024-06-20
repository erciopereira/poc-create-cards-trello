import { useErrorsApi } from "@/contexts/errors-api-context";
import trelloApi from "@/data/trello";
import { Spinner } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";

interface GenerateCardsProps {
  excelData: any;
  nameFile: string | undefined;
  list:
    | {
        id: string;
        name: string;
      }
    | undefined;
  board:
    | {
        id: string;
        name: string;
      }
    | undefined;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function GenerateCards({
  excelData,
  nameFile,
  list,
  board,
  setActiveStep,
}: GenerateCardsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { setListErros, sheetName } = useErrorsApi();

  async function createCard(
    content: string,
    format: string,
    listComents: string[],
    date: string,
    dateTitle: string,
    additionalTitle: string
  ) {
    const data = {
      name: `${dateTitle} - ${content} ${format !== "" ? `- ${format}` : ""} ${
        additionalTitle !== "" ? `- ${additionalTitle}` : ""
      }`,
    };
    const reponse = await trelloApi.generateCards(list?.id, data, setListErros);
    const dueDate = { due: date };
    await trelloApi.updateCard(reponse.id, dueDate, setListErros);
    await addComment(listComents, reponse.id);
  }

  async function addComment(listComents: any, id: string) {
    for (const comment of listComents) {
      const member = comment.member || "";
      const text = `${member} ${comment.title} ${comment.content}`;
      await trelloApi.generateComment(text, id, setListErros);
    }
  }

  async function gerarCard() {
    setLoading(true);
    for (const element of excelData) {
      let content: string = "";
      let format: string = "";
      let date: any = "";
      let dateTitle: string = "";
      let additionalTitle: string = "";
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
          case "dateTitle":
            dateTitle = element[item];
            break;
          case "dateRef":
            date = new Date(
              sheetName === "Linkedin"
                ? `${element[item]} 07:30`
                : `${element[item]} 08:00`
            );
            break;
          case "Considerações Julyana":
          case "Referência de conteúdo":
          case "Pedidos de CTA específicos":
          case "Referência visual":
            if (element[item] !== "") {
              const createTitle = `**${item}:** \n\n`;
              listComents.push({
                title: encodeURIComponent(createTitle),
                content: encodeURIComponent(element[item]),
              });
            }

            break;
          case "Collab vivi":
          case "Perfil vivi":
            additionalTitle = element[item] ? `${item}: ${element[item]}` : "";
            break;
          default:
            break;
        }
      });
      await createCard(
        content,
        format,
        listComents,
        date,
        dateTitle,
        additionalTitle
      );
    }
    setLoading(false);
    setActiveStep(7);
  }

  console.log("teste");

  return (
    excelData &&
    nameFile && (
      <div className="flex flex-col items-center gap-2">
        <div className="text-2xl mb-8">
          Confirme os dados para geração dos Cards
        </div>
        <div className="text-xl">
          <div>
            Quadro: <span className="font-bold">{board?.name}</span>
          </div>
          <div>
            Lista: <span className="font-bold">{list?.name}</span>
          </div>
          <div>
            Nome do arquivo: <span className="font-bold">{nameFile}</span>
          </div>
          <div>
            Aba selecionada do arquivo:{" "}
            <span className="font-bold">{sheetName}</span>
          </div>
        </div>
        {!loading && (
          <button
            className="border p-2 rounded bg-base text-white hover:bg-hover mt-8"
            onClick={() => gerarCard()}
          >
            Criar Cards
          </button>
        )}
        {loading && (
          <div className="flex justify-center flex-col items-center mt-8">
            <div className="text-2xl">Criando cards</div>
            <Spinner
              thickness="4px"
              speed="1s"
              emptyColor="gray.200"
              color="blue.500"
              size="lg"
            />
          </div>
        )}
      </div>
    )
  );
}
