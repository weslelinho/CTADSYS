import { OcorrenciaUpdateManyWithoutAlunosInput } from "./OcorrenciaUpdateManyWithoutAlunosInput";
import { ParticipacaoAtividadeUpdateManyWithoutAlunosInput } from "./ParticipacaoAtividadeUpdateManyWithoutAlunosInput";

export type AlunoUpdateInput = {
  cidade?: string;
  cpf?: string;
  dataEmissaoRg?: Date | null;
  dataNascimento?: Date;
  dataSaida?: Date | null;
  endereco?: string | null;
  filiacaoMae?: string;
  filiacaoPai?: string;
  idadeInicioDroga?: string;
  matricula?: number;
  nome?: string;
  ocorrencia?: OcorrenciaUpdateManyWithoutAlunosInput;
  outraClinica?: string | null;
  participacaoAtividades?: ParticipacaoAtividadeUpdateManyWithoutAlunosInput;
  possuiDoenca?: string | null;
  processo?: string | null;
  profissao?: string;
  regulamento?: boolean | null;
  religiao?: string;
  rg?: string;
  rgOrgaoExpedidor?: string;
  secao?: string;
  sexo?: "Masculino" | "Feminino";
  tempoInternacao?: boolean;
  tiposDrogas?: string | null;
  tituloEleitor?: string;
  uf?: string;
  zona?: string;
};
