import { AlunoWhereInput } from "./AlunoWhereInput";
import { AlunoOrderByInput } from "./AlunoOrderByInput";

export type AlunoFindManyArgs = {
  where?: AlunoWhereInput;
  orderBy?: Array<AlunoOrderByInput>;
  skip?: number;
  take?: number;
};
