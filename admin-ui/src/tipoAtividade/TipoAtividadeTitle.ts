import { TipoAtividade as TTipoAtividade } from "../api/tipoAtividade/TipoAtividade";

export const TIPOATIVIDADE_TITLE_FIELD = "nome";

export const TipoAtividadeTitle = (record: TTipoAtividade): string => {
  return record.nome || record.id;
};
