import * as React from "react";
import {
  Edit,
  SimpleForm,
  EditProps,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
} from "react-admin";
import { AlunoTitle } from "../aluno/AlunoTitle";
import { TipoAtividadeTitle } from "../tipoAtividade/TipoAtividadeTitle";

export const ParticipacaoAtividadeEdit = (
  props: EditProps
): React.ReactElement => {
  return (
    <Edit {...props}>
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
    </Edit>
  );
};
