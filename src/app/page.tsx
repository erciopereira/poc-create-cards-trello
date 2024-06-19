"use client";
import { useSteps } from "@chakra-ui/react";
import "moment/locale/pt-br";
import { useState } from "react";
import { ContentView } from "./(components)/contentView";
import { ListErrors } from "./(components)/errorsList";
import { GenerateCards } from "./(components)/generateCards";
import { SelectBoard } from "./(components)/selectBoard";
import { SelectList } from "./(components)/selectList";
import { Stepper } from "./(components)/stepper";
import { UploadFile } from "./(components)/uploadFile";

export default function Home() {
  const [board, setBoard] = useState<{ id: string; name: string }>();
  const [list, setList] = useState<{ id: string; name: string }>();
  const [excelData, setExcelData] = useState<any>(null);
  const [nameFile, setNameFile] = useState<string>();

  const steps = [
    { title: "Selecionar quadro" },
    { title: "Selecionar coluna" },
    { title: "Carregar arquivo de excel" },
    { title: "Selecionar aba do arquivo" },
    { title: "Dados do arquivo carregado" },
    { title: "Criar cards" },
    { title: "Cards gerados" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  return (
    <div className="m-5 flex gap-5">
      <div className="h-stepper-height border-r w-80">
        <Stepper activeStep={activeStep} steps={steps} />
      </div>
      <div className="flex items-center justify-center w-content-view">
        {(activeStep > 0 || activeStep < 7) && (
          <div
            className="absolute cursor-pointer top-0 left-[345px]"
            onClick={() => setActiveStep((prev: number) => prev - 1)}
          >
            {`< Voltar`}
          </div>
        )}
        <div className="flex">
          {activeStep === 0 && (
            <SelectBoard setBoard={setBoard} setActiveStep={setActiveStep} />
          )}
          {activeStep === 1 && (
            <SelectList
              idBoard={board?.id}
              setList={setList}
              setActiveStep={setActiveStep}
            />
          )}
        </div>
        {(activeStep === 2 || activeStep === 3) && (
          <UploadFile
            idList={list?.id}
            setExcelData={setExcelData}
            setNameFile={setNameFile}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            nameFile={nameFile}
          />
        )}
        {activeStep === 4 && (
          <ContentView
            excelData={excelData}
            nameFile={nameFile}
            setActiveStep={setActiveStep}
          />
        )}
        {activeStep === 5 && (
          <GenerateCards
            excelData={excelData}
            nameFile={nameFile}
            list={list}
            board={board}
            setActiveStep={setActiveStep}
          />
        )}
        {activeStep === 7 && <ListErrors />}
      </div>
    </div>
  );
}
