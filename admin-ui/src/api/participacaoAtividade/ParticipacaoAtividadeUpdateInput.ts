import { AlunoWhereUniqueInput } from "../aluno/AlunoWhereUniqueInput";
import { TipoAtividadeWhereUniqueInput } from "../tipoAtividade/TipoAtividadeWhereUniqueInput";

export type ParticipacaoAtividadeUpdateInput = {
  aluno?: AlunoWhereUniqueInput;
  data?: Date | null;
  tipoAtividade?: TipoAtividadeWhereUniqueInput;
};
