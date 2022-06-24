import { Aluno } from "../aluno/Aluno";

export type Ocorrencia = {
  alunos?: Array<Aluno>;
  createdAt: Date;
  descricao: string;
  id: string;
  tipo?:
    | "Saida"
    | "ComportamentoInadequado"
    | "Dispensado"
    | "Desobediencia"
    | null;
  updatedAt: Date;
};
