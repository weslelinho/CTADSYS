import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  ShowProps,
  ReferenceField,
  TextField,
  DateField,
} from "react-admin";
import { ALUNO_TITLE_FIELD } from "../aluno/AlunoTitle";
import { TIPOATIVIDADE_TITLE_FIELD } from "../tipoAtividade/TipoAtividadeTitle";

export const ParticipacaoAtividadeShow = (
  props: ShowProps
): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
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
      </SimpleShowLayout>
    </Show>
  );
};
