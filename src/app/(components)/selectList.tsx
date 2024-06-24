import { useGeneralContext } from "@/contexts/context";
import trelloApi from "@/data/trello";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface SelectListProps {
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function SelectList({ setActiveStep }: SelectListProps) {
  const { member, board, setList, setSteps } = useGeneralContext();
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
    if (board.id) {
      (async () => {
        setLoading(true);
        const response = await trelloApi.getLists(member.userName, board.id);
        setLists(response);
        setLoading(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board.id]);

  return (
    board.id && (
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
    )
  );
}
