import * as React from "react";

import {
  Edit,
  SimpleForm,
  EditProps,
  TextInput,
  DateInput,
  NumberInput,
  ReferenceArrayInput,
  SelectArrayInput,
  BooleanInput,
  SelectInput,
} from "react-admin";

import { OcorrenciaTitle } from "../ocorrencia/OcorrenciaTitle";
import { ParticipacaoAtividadeTitle } from "../participacaoAtividade/ParticipacaoAtividadeTitle";

export const AlunoEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput label="Cidade" source="cidade" />
        <TextInput label="CPF" source="cpf" />
        <DateInput label="DataEmissaoRG" source="dataEmissaoRg" />
        <DateInput label="DataNascimento" source="dataNascimento" />
        <DateInput label="data_saida" source="dataSaida" />
        <TextInput label="Endereco" source="endereco" />
        <TextInput label="Filiacao Mae" source="filiacaoMae" />
        <TextInput label="Filiacao Pai" source="filiacaoPai" />
        <TextInput
          label="Com que idade iniciou o uso de drogas?"
          source="idadeInicioDroga"
        />
        <NumberInput step={1} label="Matricula" source="matricula" />
        <TextInput label="Nome" source="nome" />
        <ReferenceArrayInput
          source="ocorrencia"
          reference="Ocorrencia"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={OcorrenciaTitle} />
        </ReferenceArrayInput>
        <TextInput
          label="Ja ficou internado em outra clinica? qual?"
          source="outraClinica"
        />
        <ReferenceArrayInput
          source="participacaoAtividades"
          reference="ParticipacaoAtividade"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={ParticipacaoAtividadeTitle} />
        </ReferenceArrayInput>
        <TextInput label="Possui Doença" source="possuiDoenca" />
        <TextInput
          label="Responde algum processo?"
          multiline
          source="processo"
        />
        <TextInput label="Profissão" source="profissao" />
        <BooleanInput
          label="Está disposto a obedecer o regulamento da casa?"
          source="regulamento"
        />
        <TextInput label="Religiao" source="religiao" />
        <TextInput label="RG" source="rg" />
        <TextInput label="RGOrgaoExpedidor" source="rgOrgaoExpedidor" />
        <TextInput label="Seção" source="secao" />
        <SelectInput
          source="sexo"
          label="Sexo"
          choices={[
            { label: "Masculino", value: "Masculino" },
            { label: "Feminino", value: "Feminino" },
          ]}
          optionText="label"
          optionValue="value"
        />
        <BooleanInput
          label="Pretende ficar o tempo determinado"
          source="tempoInternacao"
        />
        <TextInput label="TiposDrogas" source="tiposDrogas" />
        <TextInput label="TituloEleitor" source="tituloEleitor" />
        <TextInput label="UF" source="uf" />
        <TextInput label="zona" source="zona" />
      </SimpleForm>
    </Edit>
  );
};
