import * as React from "react";

import {
  Show,
  SimpleShowLayout,
  ShowProps,
  TextField,
  DateField,
  BooleanField,
  ReferenceManyField,
  Datagrid,
  ReferenceField,
} from "react-admin";

import { ALUNO_TITLE_FIELD } from "./AlunoTitle";
import { TIPOATIVIDADE_TITLE_FIELD } from "../tipoAtividade/TipoAtividadeTitle";

export const AlunoShow = (props: ShowProps): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField label="Cidade" source="cidade" />
        <TextField label="CPF" source="cpf" />
        <DateField source="createdAt" label="Created At" />
        <TextField label="DataEmissaoRG" source="dataEmissaoRg" />
        <TextField label="DataNascimento" source="dataNascimento" />
        <TextField label="data_saida" source="dataSaida" />
        <TextField label="Endereco" source="endereco" />
        <TextField label="Filiacao Mae" source="filiacaoMae" />
        <TextField label="Filiacao Pai" source="filiacaoPai" />
        <TextField label="ID" source="id" />
        <TextField
          label="Com que idade iniciou o uso de drogas?"
          source="idadeInicioDroga"
        />
        <TextField label="Matricula" source="matricula" />
        <TextField label="Nome" source="nome" />
        <TextField
          label="Ja ficou internado em outra clinica? qual?"
          source="outraClinica"
        />
        <TextField label="Possui Doença" source="possuiDoenca" />
        <TextField label="Responde algum processo?" source="processo" />
        <TextField label="Profissão" source="profissao" />
        <BooleanField
          label="Está disposto a obedecer o regulamento da casa?"
          source="regulamento"
        />
        <TextField label="Religiao" source="religiao" />
        <TextField label="RG" source="rg" />
        <TextField label="RGOrgaoExpedidor" source="rgOrgaoExpedidor" />
        <TextField label="Seção" source="secao" />
        <TextField label="Sexo" source="sexo" />
        <BooleanField
          label="Pretende ficar o tempo determinado"
          source="tempoInternacao"
        />
        <TextField label="TiposDrogas" source="tiposDrogas" />
        <TextField label="TituloEleitor" source="tituloEleitor" />
        <TextField label="UF" source="uf" />
        <DateField source="updatedAt" label="Updated At" />
        <TextField label="zona" source="zona" />
        <ReferenceManyField
          reference="ParticipacaoAtividade"
          target="AlunoId"
          label="participacao_atividades"
        >
          <Datagrid rowClick="show">
            <ReferenceField label="aluno" source="aluno.id" reference="Aluno">
              <TextField source={ALUNO_TITLE_FIELD} />
            </ReferenceField>
            <DateField source="createdAt" label="Created At" />
            <TextField label="data" source="data" />
            <TextField label="ID" source="id" />
            <ReferenceField
              label="tipo_atividade"
              source="tipoatividade.id"
              reference="TipoAtividade"
            >
              <TextField source={TIPOATIVIDADE_TITLE_FIELD} />
            </ReferenceField>
            <DateField source="updatedAt" label="Updated At" />
          </Datagrid>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};
