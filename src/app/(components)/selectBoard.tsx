/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGeneralContext } from "@/contexts/context";
import trelloApi from "@/data/trello";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface SelectBoardProps {
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function SelectBoard({ setActiveStep }: SelectBoardProps) {
  const { member, setBoard, setSteps } = useGeneralContext();
  const [loading, setLoading] = useState(false);
  const [listBoards, setListBoards] = useState<
    [
      {
        id: "";
        name: "";
      }
    ]
  >();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await trelloApi.getListBoards(member.userName);
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
      <div className="flex flex-col gap-2">
        {listBoards?.map((item: any) => (
          <button
            className="border p-2 rounded bg-base text-white hover:bg-hover"
            key={item.id}
            onClick={() => {
              setBoard({ id: item.id, name: item.name });
              setActiveStep((prev) => {
                setSteps((prevStep) => {
                  prevStep[prev].description = item.name;
                  return prevStep;
                });
                return prev + 1;
              });
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
