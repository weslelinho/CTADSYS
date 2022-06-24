import { AlunoListRelationFilter } from "../aluno/AlunoListRelationFilter";
import { StringFilter } from "../../util/StringFilter";

export type OcorrenciaWhereInput = {
  alunos?: AlunoListRelationFilter;
  descricao?: StringFilter;
  id?: StringFilter;
  tipo?: "Saida" | "ComportamentoInadequado" | "Dispensado" | "Desobediencia";
};
