import { Aluno } from "../aluno/Aluno";
import { TipoAtividade } from "../tipoAtividade/TipoAtividade";

export type ParticipacaoAtividade = {
  aluno?: Aluno;
  createdAt: Date;
  data: Date | null;
  id: string;
  tipoAtividade?: TipoAtividade;
  updatedAt: Date;
};
