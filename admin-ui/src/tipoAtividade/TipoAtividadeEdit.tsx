import * as React from "react";

import {
  Edit,
  SimpleForm,
  EditProps,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  DateTimeInput,
} from "react-admin";

import { ParticipacaoAtividadeTitle } from "../participacaoAtividade/ParticipacaoAtividadeTitle";

export const TipoAtividadeEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
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
    </Edit>
  );
};
