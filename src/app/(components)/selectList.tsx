import trelloApi from "@/data/trello";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface SelectListProps {
  idBoard: string | undefined;
  setList: Dispatch<
    SetStateAction<
      | {
          id: string;
          name: string;
        }
      | undefined
    >
  >;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function SelectList({
  idBoard,
  setList,
  setActiveStep,
}: SelectListProps) {
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<
    [
      {
        id: string;
        name: string;
      }
    ]
  >();

  useEffect(() => {
    if (idBoard) {
      (async () => {
        setLoading(true);
        const response = await trelloApi.getLists(idBoard);
        setLists(response);
        setLoading(false);
      })();
    }
  }, [idBoard]);

  return (
    idBoard && (
      <div className="flex flex-col items-center">
        <div className="text-xl mb-4">
          Selecione em qual coluna deseja abrir os cards
        </div>
        {loading && <div>Carregando quadros...</div>}
        <div className="flex gap-2 flex-col">
          {lists?.map((item: any) => (
            <button
              className="border p-2 rounded bg-base text-white hover:bg-hover"
              key={item.id}
              onClick={() => {
                setList({ id: item.id, name: item.name });
                setActiveStep(2);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    )
  );
}
