import { AlunoUpdateManyWithoutOcorrenciasInput } from "./AlunoUpdateManyWithoutOcorrenciasInput";

export type OcorrenciaUpdateInput = {
  alunos?: AlunoUpdateManyWithoutOcorrenciasInput;
  descricao?: string;
  tipo?:
    | "Saida"
    | "ComportamentoInadequado"
    | "Dispensado"
    | "Desobediencia"
    | null;
};
