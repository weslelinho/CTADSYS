import { StringFilter } from "../../util/StringFilter";
import { StringNullableFilter } from "../../util/StringNullableFilter";
import { ParticipacaoAtividadeListRelationFilter } from "../participacaoAtividade/ParticipacaoAtividadeListRelationFilter";
import { DateTimeNullableFilter } from "../../util/DateTimeNullableFilter";

export type TipoAtividadeWhereInput = {
  id?: StringFilter;
  nome?: StringNullableFilter;
  participacaoAtividades?: ParticipacaoAtividadeListRelationFilter;
  tempoDuracao?: DateTimeNullableFilter;
};
