/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGeneralContext } from "@/contexts/context";
import trelloApi from "@/data/trello";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface SelectBoardProps {
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function SelectTags({ setActiveStep }: SelectBoardProps) {
  const { member, setTags, setSteps, board } = useGeneralContext();
  const [loading, setLoading] = useState(false);
  const [listTags, setListTags] = useState<{ id: string; name: string }[]>([]);
  const [tagsSelectes, setTagsSelected] = useState<
    { id: string; name: string }[]
  >([]);

  const nextStep = () => {
    const listNames = tagsSelectes?.map((item) => item.name);
    setTags(tagsSelectes);
    const names = listNames?.join(", ");
    console.log(names);
    setActiveStep((prev) => {
      setSteps((prevStep) => {
        prevStep[prev].description = names;
        return prevStep;
      });
      return prev + 1;
    });
  };

  const changeTags = (item: { id: string; name: string }) => {
    if (tagsSelectes.length) {
      const newArray = tagsSelectes;
      const find = newArray.find((fil) => fil.id === item.id);
      if (find) {
        const filter = newArray.filter((fil) => fil.id !== find.id);
        setTagsSelected(filter);
      } else {
        newArray.push({ id: item.id, name: item.name });
        setTagsSelected(newArray);
      }
      return;
    }
    setTagsSelected([{ id: item.id, name: item.name }]);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await trelloApi.getListTags(member.userName, board.id);
      setListTags(response);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl mb-4">
        Selecione uma etiqueta para ser marcada em todos os cards
      </div>
      {loading && <div>Carregando etiquetas...</div>}
      <div className="flex flex-col gap-2">
        {listTags?.map((item: any) => (
          <div key={item.id} className="flex gap-2">
            <input
              type="checkbox"
              value={item.id}
              className=""
              onChange={() => changeTags(item)}
            />
            <label>{item.name}</label>
          </div>
        ))}
        <button
          className="border p-2 rounded bg-base text-white hover:bg-hover"
          onClick={() => nextStep()}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}
