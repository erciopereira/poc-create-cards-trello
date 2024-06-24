import { useGeneralContext } from "@/contexts/context";
import * as StepperComponent from "@chakra-ui/react";

interface StepperProps {
  activeStep: number;
}

export function Stepper({ activeStep }: StepperProps) {
  const { steps } = useGeneralContext();
  return (
    <StepperComponent.Stepper
      index={activeStep}
      orientation="vertical"
      height="100%"
      gap="0"
    >
      {steps.map((step, index) => (
        <StepperComponent.Step key={index}>
          <StepperComponent.StepIndicator>
            <StepperComponent.StepStatus
              complete={<StepperComponent.StepIcon />}
              incomplete={<StepperComponent.StepNumber />}
              active={<StepperComponent.StepNumber />}
            />
          </StepperComponent.StepIndicator>

          <StepperComponent.Box flexShrink="0">
            <StepperComponent.StepTitle>
              {step.title}
            </StepperComponent.StepTitle>
            <StepperComponent.StepDescription>
              {step.description}
            </StepperComponent.StepDescription>
          </StepperComponent.Box>

          <StepperComponent.StepSeparator />
        </StepperComponent.Step>
      ))}
    </StepperComponent.Stepper>
  );
}
