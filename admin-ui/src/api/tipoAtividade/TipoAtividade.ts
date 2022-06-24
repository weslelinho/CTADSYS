import { ParticipacaoAtividade } from "../participacaoAtividade/ParticipacaoAtividade";

export type TipoAtividade = {
  createdAt: Date;
  id: string;
  nome: string | null;
  participacaoAtividades?: Array<ParticipacaoAtividade>;
  tempoDuracao: Date | null;
  updatedAt: Date;
};
