import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  DateTimeInput,
} from "react-admin";

import { ParticipacaoAtividadeTitle } from "../participacaoAtividade/ParticipacaoAtividadeTitle";

export const TipoAtividadeCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput label="Tipo Atividade" source="nome" />
        <ReferenceArrayInput
          source="participacaoAtividades"
          reference="ParticipacaoAtividade"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={ParticipacaoAtividadeTitle} />
        </ReferenceArrayInput>
        <DateTimeInput label="tempo_duracao" source="tempoDuracao" />
      </SimpleForm>
    </Create>
  );
};
