import { ParticipacaoAtividadeCreateNestedManyWithoutTipoAtividadesInput } from "./ParticipacaoAtividadeCreateNestedManyWithoutTipoAtividadesInput";

export type TipoAtividadeCreateInput = {
  nome?: string | null;
  participacaoAtividades?: ParticipacaoAtividadeCreateNestedManyWithoutTipoAtividadesInput;
  tempoDuracao?: Date | null;
};
