import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
} from "react-admin";

import { AlunoTitle } from "../aluno/AlunoTitle";
import { TipoAtividadeTitle } from "../tipoAtividade/TipoAtividadeTitle";

export const ParticipacaoAtividadeCreate = (
  props: CreateProps
): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <ReferenceInput source="aluno.id" reference="Aluno" label="aluno">
          <SelectInput optionText={AlunoTitle} />
        </ReferenceInput>
        <DateTimeInput label="data" source="data" />
        <ReferenceInput
          source="tipoatividade.id"
          reference="TipoAtividade"
          label="tipo_atividade"
        >
          <SelectInput optionText={TipoAtividadeTitle} />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
