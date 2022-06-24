import * as React from "react";

import {
  Show,
  SimpleShowLayout,
  ShowProps,
  DateField,
  TextField,
  ReferenceManyField,
  Datagrid,
  ReferenceField,
} from "react-admin";

import { ALUNO_TITLE_FIELD } from "../aluno/AlunoTitle";
import { TIPOATIVIDADE_TITLE_FIELD } from "./TipoAtividadeTitle";

export const TipoAtividadeShow = (props: ShowProps): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <DateField source="createdAt" label="Created At" />
        <TextField label="ID" source="id" />
        <TextField label="Tipo Atividade" source="nome" />
        <TextField label="tempo_duracao" source="tempoDuracao" />
        <DateField source="updatedAt" label="Updated At" />
        <ReferenceManyField
          reference="ParticipacaoAtividade"
          target="TipoAtividadeId"
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
