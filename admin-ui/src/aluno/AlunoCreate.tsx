import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  TextInput,
  DateInput,
  NumberInput,
  // ReferenceArrayInput,
  // SelectArrayInput,
  BooleanInput,
  SelectInput,
} from "react-admin";

// import { OcorrenciaTitle } from "../ocorrencia/OcorrenciaTitle";
// import { ParticipacaoAtividadeTitle } from "../participacaoAtividade/ParticipacaoAtividadeTitle";

export const AlunoCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput label="Nome" source="nome" size="medium" />
        <SelectInput
          source="sexo"
          label="Sexo"
          choices={[
            { label: "Masculino", value: "Masculino" },
            { label: "Feminino", value: "Feminino" },
          ]}
          optionText="label"
          optionValue="value"
          defaultValue="Masculino"
        />
        <TextInput label="CPF" source="cpf" />
        <NumberInput step={1} label="Matricula" source="matricula" />
        <TextInput label="Filiacao Mae" source="filiacaoMae" />
        <TextInput label="Filiacao Pai" source="filiacaoPai" />
        <TextInput label="RG" source="rg" />
        <TextInput label="Orgão Expedidor" source="rgOrgaoExpedidor" />
        <DateInput label="Data Emissao RG" source="dataEmissaoRg" />

        <TextInput label="TituloEleitor" source="tituloEleitor" />
        <TextInput label="zona" source="zona" />
        <TextInput label="Seção" source="secao" />

        <DateInput label="Data Nascimento" source="dataNascimento" />
        <DateInput label="data_saida" source="dataSaida" />
        <TextInput label="Cidade" source="cidade" />
        <TextInput label="UF" source="uf" />
        <TextInput label="Endereco" source="endereco" />


        <TextInput
          label="Com que idade iniciou o uso de drogas?"
          source="idadeInicioDroga"
        />

        <TextInput
          label="Ja ficou internado em outra clinica? qual?"
          source="outraClinica"
        />
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

 
        <BooleanInput
          label="Pretende ficar o tempo determinado"
          source="tempoInternacao"
        />
        <TextInput label="TiposDrogas" source="tiposDrogas" />

      </SimpleForm>
    </Create>
  );
};
