import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
  ReferenceArrayInput,
  SelectArrayInput,
  TextInput,
  SelectInput,
} from "react-admin";

import { AlunoTitle } from "../aluno/AlunoTitle";

export const OcorrenciaCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
      <SimpleForm>
        <ReferenceArrayInput
          source="alunos"
          reference="Aluno"
          parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
          format={(value: any) => value && value.map((v: any) => v.id)}
        >
          <SelectArrayInput optionText={AlunoTitle} />
        </ReferenceArrayInput>
        <TextInput label="Descricao" multiline source="descricao" />
        <SelectInput
          source="tipo"
          label="Tipo"
          choices={[
            { label: "Saida", value: "Saida" },
            {
              label: "Comportamento Inadequado",
              value: "ComportamentoInadequado",
            },
            { label: "Dispensado", value: "Dispensado" },
            { label: "Desobediencia", value: "Desobediencia" },
          ]}
          optionText="label"
          allowEmpty
          optionValue="value"
        />
      </SimpleForm>
    </Create>
  );
};
