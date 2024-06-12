"use client";
import trelloApi from "@/data/trello";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface SelectBoardProps {
  setBoard: Dispatch<
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

export function SelectBoard({ setBoard, setActiveStep }: SelectBoardProps) {
  const [loading, setLoading] = useState(false);
  const [listBoards, setListBoards] = useState<
    [
      {
        id: string;
        name: string;
      }
    ]
  >();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await trelloApi.getListBoards();
      setListBoards(response);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl mb-4">
        Selecione o quadro do trello que você deseja trabalhar
      </div>
      {loading && <div>Carregando quadros...</div>}
      <div className="flex gap-2">
        {listBoards?.map((item: any) => (
          <button
            className="border p-2 rounded bg-base text-white hover:bg-hover"
            key={item.id}
            onClick={() => {
              setBoard({ id: item.id, name: item.name });
              setActiveStep(1);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
