import { ParticipacaoAtividade as TParticipacaoAtividade } from "../api/participacaoAtividade/ParticipacaoAtividade";

export const PARTICIPACAOATIVIDADE_TITLE_FIELD = "id";

export const ParticipacaoAtividadeTitle = (
  record: TParticipacaoAtividade
): string => {
  return record.id || record.id;
};
