import { AlunoWhereUniqueInput } from "../aluno/AlunoWhereUniqueInput";
import { DateTimeNullableFilter } from "../../util/DateTimeNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { TipoAtividadeWhereUniqueInput } from "../tipoAtividade/TipoAtividadeWhereUniqueInput";

export type ParticipacaoAtividadeWhereInput = {
  aluno?: AlunoWhereUniqueInput;
  data?: DateTimeNullableFilter;
  id?: StringFilter;
  tipoAtividade?: TipoAtividadeWhereUniqueInput;
};
