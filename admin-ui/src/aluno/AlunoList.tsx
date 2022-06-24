import * as React from "react";
import {
  List,
  Datagrid,
  ListProps,
  TextField,
  DateField,
  // BooleanField,
} from "react-admin";
import Pagination from "../Components/Pagination";

export const AlunoList = (props: ListProps): React.ReactElement => {
  return (
    <List
      {...props}
      bulkActionButtons={false}
      title={"Alunos"}
      perPage={50}
      pagination={<Pagination />}
    >
      <Datagrid rowClick="show">
      <TextField label="Matricula" source="matricula" />
      <TextField label="Nome" source="nome" />
      <DateField source="createdAt" label="Created At" />
      <TextField label="data_saida" source="dataSaida" />
        
        {/* <TextField label="Cidade" source="cidade" />
        <TextField label="CPF" source="cpf" />
      
        <TextField label="DataEmissaoRG" source="dataEmissaoRg" />
        <TextField label="DataNascimento" source="dataNascimento" />
        
        <TextField label="Endereco" source="endereco" />
        <TextField label="Filiacao Mae" source="filiacaoMae" />
        <TextField label="Filiacao Pai" source="filiacaoPai" />
        <TextField label="ID" source="id" />
        <TextField
          label="Com que idade iniciou o uso de drogas?"
          source="idadeInicioDroga"
        />
        
       
        <TextField
          label="Ja ficou internado em outra clinica? qual?"
          source="outraClinica"
        />
        <TextField label="Possui Doença" source="possuiDoenca" />
        <TextField label="Responde algum processo?" source="processo" />
        <TextField label="Profissão" source="profissao" />
        <BooleanField
          label="Está disposto a obedecer o regulamento da casa?"
          source="regulamento"
        />
        <TextField label="Religiao" source="religiao" />
        <TextField label="RG" source="rg" />
        <TextField label="RGOrgaoExpedidor" source="rgOrgaoExpedidor" />
        <TextField label="Seção" source="secao" />
        <TextField label="Sexo" source="sexo" />
        <BooleanField
          label="Pretende ficar o tempo determinado"
          source="tempoInternacao"
        />
        <TextField label="TiposDrogas" source="tiposDrogas" />
        <TextField label="TituloEleitor" source="tituloEleitor" />
        <TextField label="UF" source="uf" />
        <DateField source="updatedAt" label="Updated At" />
        <TextField label="zona" source="zona" /> */}
      </Datagrid>
    </List>
  );
};
