import * as React from "react";
import {
  List,
  Datagrid,
  ListProps,
  ReferenceField,
  TextField,
  DateField,
} from "react-admin";
import Pagination from "../Components/Pagination";
import { ALUNO_TITLE_FIELD } from "../aluno/AlunoTitle";
import { TIPOATIVIDADE_TITLE_FIELD } from "../tipoAtividade/TipoAtividadeTitle";

export const ParticipacaoAtividadeList = (
  props: ListProps
): React.ReactElement => {
  return (
    <List
      {...props}
      bulkActionButtons={false}
      title={"participacao_atividades"}
      perPage={50}
      pagination={<Pagination />}
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
    </List>
  );
};
