import { ParticipacaoAtividadeUpdateManyWithoutTipoAtividadesInput } from "./ParticipacaoAtividadeUpdateManyWithoutTipoAtividadesInput";

export type TipoAtividadeUpdateInput = {
  nome?: string | null;
  participacaoAtividades?: ParticipacaoAtividadeUpdateManyWithoutTipoAtividadesInput;
  tempoDuracao?: Date | null;
};
