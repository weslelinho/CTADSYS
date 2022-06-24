import { Ocorrencia as TOcorrencia } from "../api/ocorrencia/Ocorrencia";

export const OCORRENCIA_TITLE_FIELD = "id";

export const OcorrenciaTitle = (record: TOcorrencia): string => {
  return record.id || record.id;
};
