import { TipoAtividadeWhereInput } from "./TipoAtividadeWhereInput";
import { TipoAtividadeOrderByInput } from "./TipoAtividadeOrderByInput";

export type TipoAtividadeFindManyArgs = {
  where?: TipoAtividadeWhereInput;
  orderBy?: Array<TipoAtividadeOrderByInput>;
  skip?: number;
  take?: number;
};
