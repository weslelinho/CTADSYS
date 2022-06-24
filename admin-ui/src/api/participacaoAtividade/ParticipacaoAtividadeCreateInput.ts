import { AlunoWhereUniqueInput } from "../aluno/AlunoWhereUniqueInput";
import { TipoAtividadeWhereUniqueInput } from "../tipoAtividade/TipoAtividadeWhereUniqueInput";

export type ParticipacaoAtividadeCreateInput = {
  aluno: AlunoWhereUniqueInput;
  data?: Date | null;
  tipoAtividade: TipoAtividadeWhereUniqueInput;
};
