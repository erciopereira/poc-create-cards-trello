"use client";
import { useGeneralContext } from "@/contexts/context";
import { Dispatch, SetStateAction } from "react";

interface SelectBoardProps {
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function SelectMembers({ setActiveStep }: SelectBoardProps) {
  const { setMember, setSteps } = useGeneralContext();
  const listMembers = [
    {
      name: "Julyana",
      userName: "julyana",
    },
    {
      name: "Anita",
      userName: "anita",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl mb-4">
        Selecione o usuário que vai criar os cards
      </div>
      <div className="flex flex-col gap-2">
        {listMembers?.map((item: any) => (
          <button
            className="border p-2 rounded bg-base text-white hover:bg-hover"
            key={item.userName}
            onClick={() => {
              setMember({ name: item.name, userName: item.userName });
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
