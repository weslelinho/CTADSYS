import { AlunoCreateNestedManyWithoutOcorrenciasInput } from "./AlunoCreateNestedManyWithoutOcorrenciasInput";

export type OcorrenciaCreateInput = {
  alunos?: AlunoCreateNestedManyWithoutOcorrenciasInput;
  descricao: string;
  tipo?:
    | "Saida"
    | "ComportamentoInadequado"
    | "Dispensado"
    | "Desobediencia"
    | null;
};
