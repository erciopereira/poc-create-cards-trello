"use client";
import { useGeneralContext } from "@/contexts/context";
import { useSteps } from "@chakra-ui/react";
import "moment/locale/pt-br";
import { ContentView } from "./(components)/contentView";
import { ListErrors } from "./(components)/errorsList";
import { GenerateCards } from "./(components)/generateCards";
import { SelectBoard } from "./(components)/selectBoard";
import { SelectList } from "./(components)/selectList";
import { SelectMembers } from "./(components)/selectMembers";
import { SelectSheet } from "./(components)/selectSheet";
import { Stepper } from "./(components)/stepper";
import { UploadFile } from "./(components)/uploadFile";

export default function Home() {
  const { steps } = useGeneralContext();

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  return (
    <div className="m-5 flex gap-5">
      <div className="h-stepper-height border-r w-80">
        <Stepper activeStep={activeStep} />
      </div>
      <div className="flex items-center justify-center w-content-view">
        {activeStep > 0 && activeStep < 7 && (
          <div
            className="absolute cursor-pointer top-0 left-[345px]"
            onClick={() => setActiveStep((prev: number) => prev - 1)}
          >
            {`< Voltar`}
          </div>
        )}
        <div className="flex">
          {activeStep === 0 && <SelectMembers setActiveStep={setActiveStep} />}
          {activeStep === 1 && <SelectBoard setActiveStep={setActiveStep} />}
          {activeStep === 2 && <SelectList setActiveStep={setActiveStep} />}
        </div>
        {activeStep === 3 && <UploadFile setActiveStep={setActiveStep} />}
        {activeStep === 4 && <SelectSheet setActiveStep={setActiveStep} />}
        {activeStep === 5 && <ContentView setActiveStep={setActiveStep} />}
        {activeStep === 6 && <GenerateCards setActiveStep={setActiveStep} />}
        {activeStep === 8 && <ListErrors />}
      </div>
    </div>
  );
}
