import { OcorrenciaWhereInput } from "./OcorrenciaWhereInput";
import { OcorrenciaOrderByInput } from "./OcorrenciaOrderByInput";

export type OcorrenciaFindManyArgs = {
  where?: OcorrenciaWhereInput;
  orderBy?: Array<OcorrenciaOrderByInput>;
  skip?: number;
  take?: number;
};
