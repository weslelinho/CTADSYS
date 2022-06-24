import { Aluno as TAluno } from "../api/aluno/Aluno";

export const ALUNO_TITLE_FIELD = "cidade";

export const AlunoTitle = (record: TAluno): string => {
  return record.cidade || record.nome;
};
