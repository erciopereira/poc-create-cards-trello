import { useErrorsApi } from "@/contexts/errors-api-context";

interface ListErrorsProps {}

export function ListErrors({}: ListErrorsProps) {
  const { listErrors } = useErrorsApi();
  return listErrors.length ? (
    <div className="h-errors-height p-5 mb-5">
      <>
        <div className="font-bold text-2xl mb-8">
          Os cards foram gerados com sucesso, mas ocorreram alguns erros.
        </div>
        {listErrors.map((item, index) => (
          <div className="mb-5" key={index}>
            {item.type}
          </div>
        ))}
      </>
    </div>
  ) : (
    <div className="font-bold text-2xl mb-8">Cards gerados com sucesso</div>
  );
}
