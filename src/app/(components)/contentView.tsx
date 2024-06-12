import { Dispatch, SetStateAction } from "react";

interface ContentViewProps {
  excelData: any;
  nameFile: string | undefined;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export function ContentView({
  excelData,
  nameFile,
  setActiveStep,
}: ContentViewProps) {
  return (
    excelData && (
      <div className="w-content-view overflow-auto h-content-height">
        <div className="flex items-center">
          <div className="text-xl font-bold">{nameFile}</div>
          <div className="ml-10">
            <button
              className="border p-2 rounded bg-base text-white hover:bg-hover"
              onClick={() => setActiveStep(5)}
            >
              Preparar CARDS
            </button>
          </div>
        </div>
        <div className="flex w-fit font-bold border-b-2 sticky top-0 bg-white">
          {Object.keys(excelData[0]).map((key) => (
            <div className="w-64 p-4" key={key}>
              {key}
            </div>
          ))}
        </div>
        <div className="flex flex-col w-fit">
          {excelData.map((individualExcelData: any, index: any) => (
            <div key={index} className="flex border-b-2">
              {Object.keys(individualExcelData).map((key) => {
                const verifyUrl = () => {
                  try {
                    return Boolean(new URL(individualExcelData[key]));
                  } catch (e) {
                    return "";
                  }
                };
                const isUrl = verifyUrl();
                return (
                  <div
                    className={`w-64 ${isUrl && "break-all"} border-r-2 p-4`}
                    key={key}
                  >
                    {individualExcelData[key]}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    )
  );
}
