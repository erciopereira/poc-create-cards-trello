import { useGeneralContext } from "@/contexts/context";
import trelloApi from "@/data/trello";
import { Spinner } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";

interface GenerateCardsProps {
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function GenerateCards({ setActiveStep }: GenerateCardsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    setListErros,
    sheetName,
    member,
    list,
    excelData,
    nameFile,
    board,
    tags,
  } = useGeneralContext();

  async function createCard(
    content: string,
    format: string,
    listComents: string[],
    date: string,
    dateTitle: string,
    additionalTitle: string,
    additionalTitleSequence: string
  ) {
    const data = {
      name: `${dateTitle} - ${content} ${format !== "" ? `- ${format}` : ""} ${
        additionalTitle !== "" ? `- ${additionalTitle}` : ""
      } ${
        additionalTitleSequence !== "" ? `- ${additionalTitleSequence}` : ""
      }`,
    };
    const reponse = await trelloApi.generateCards(
      member.userName,
      list?.id,
      data,
      setListErros
    );
    const uppercase = sheetName.toUpperCase();
    const verifySheetName = uppercase.includes("LINKEDIN");
    const cover = { color: "blue", brightness: "light" };
    const dueDate = date;
    const tagsSelectec = tags.map((item) => item.id);
    const dataUpdate = verifySheetName
      ? { cover, due: dueDate, idLabels: tagsSelectec }
      : { due: dueDate, idLabels: tagsSelectec };
    await trelloApi.updateCard(
      member.userName,
      reponse.id,
      dataUpdate,
      setListErros
    );
    await addComment(listComents, reponse.id);
  }

  async function addComment(listComents: any, id: string) {
    for (const comment of listComents) {
      const memberMark = comment.member || "";
      const text = `${memberMark} ${comment.title} ${comment.content}`;
      await trelloApi.generateComment(member.userName, text, id, setListErros);
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
      let additionalTitleSequence: string = "";
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
            if (element.Sequência) {
              if (element.Sequência === "Post 1")
                date = new Date(`${element[item]} 08:00`);
              if (element.Sequência === "Post 2")
                date = new Date(`${element[item]} 13:00`);
              if (element.Sequência === "Post 3")
                date = new Date(`${element[item]} 18:00`);
            } else {
              const uppercase = sheetName.toUpperCase();
              date = new Date(
                uppercase === "LINKEDIN"
                  ? `${element[item]} 07:30`
                  : `${element[item]} 08:00`
              );
            }
            break;
          case "Considerações Julyana":
          case "Considerações Anita":
          case "Considerações Time Filhos":
          case "Referência de conteúdo":
          case "Pedidos de CTA específicos":
          case "Pedidos específicos de CTA?":
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
          case "Referência visual":
            if (element[item] !== "") {
              const verifyMember =
                member.userName === "julyana"
                  ? "@aquesiafernandes"
                  : "@rayanenogueirafilhosnocurriculo";
              const createTitle = `${verifyMember}\n\n **${item}:** \n\n`;
              listComents.push({
                title: encodeURIComponent(createTitle),
                content: encodeURIComponent(element[item]),
              });
            }
            break;
          case "Sequência":
            additionalTitleSequence = element[item]
              ? `${item}: ${element[item]}`
              : "";
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
        additionalTitle,
        additionalTitleSequence
      );
    }
    setLoading(false);
    setActiveStep((prev) => prev + 2);
  }

  return (
    excelData &&
    nameFile && (
      <div className="flex flex-col items-center gap-2">
        <div className="text-2xl mb-8">
          Confirme os dados para geração dos Cards
        </div>
        <div className="text-xl">
          <div>
            Usuário que esta criando os cards:{" "}
            <span className="font-bold">{member.name}</span>
          </div>
          <div>
            Quadro: <span className="font-bold">{board?.name}</span>
          </div>
          <div>
            Coluna: <span className="font-bold">{list?.name}</span>
          </div>
          <div>
            Etiquetas Selecionadas:{" "}
            <span className="font-bold">
              {tags.map((item) => item.name).join(", ")}
            </span>
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
