import React, { useEffect, useState } from "react";
import { Admin, DataProvider, Resource } from "react-admin";
import buildGraphQLProvider from "./data-provider/graphqlDataProvider";
import { theme } from "./theme/theme";
import Login from "./Login";
import "./App.scss";
import Dashboard from "./pages/Dashboard";
import { UserList } from "./user/UserList";
import { UserCreate } from "./user/UserCreate";
import { UserEdit } from "./user/UserEdit";
import { UserShow } from "./user/UserShow";
import { AlunoList } from "./aluno/AlunoList";
import { AlunoCreate } from "./aluno/AlunoCreate";
import { AlunoEdit } from "./aluno/AlunoEdit";
import { AlunoShow } from "./aluno/AlunoShow";
import { OcorrenciaList } from "./ocorrencia/OcorrenciaList";
import { OcorrenciaCreate } from "./ocorrencia/OcorrenciaCreate";
import { OcorrenciaEdit } from "./ocorrencia/OcorrenciaEdit";
import { OcorrenciaShow } from "./ocorrencia/OcorrenciaShow";
import { TipoAtividadeList } from "./tipoAtividade/TipoAtividadeList";
import { TipoAtividadeCreate } from "./tipoAtividade/TipoAtividadeCreate";
import { TipoAtividadeEdit } from "./tipoAtividade/TipoAtividadeEdit";
import { TipoAtividadeShow } from "./tipoAtividade/TipoAtividadeShow";
import { ParticipacaoAtividadeList } from "./participacaoAtividade/ParticipacaoAtividadeList";
import { ParticipacaoAtividadeCreate } from "./participacaoAtividade/ParticipacaoAtividadeCreate";
import { ParticipacaoAtividadeEdit } from "./participacaoAtividade/ParticipacaoAtividadeEdit";
import { ParticipacaoAtividadeShow } from "./participacaoAtividade/ParticipacaoAtividadeShow";
import { jwtAuthProvider } from "./auth-provider/ra-auth-jwt";

const App = (): React.ReactElement => {
  const [dataProvider, setDataProvider] = useState<DataProvider | null>(null);
  useEffect(() => {
    buildGraphQLProvider
      .then((provider: any) => {
        setDataProvider(() => provider);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);
  if (!dataProvider) {
    return <div>Loading</div>;
  }
  return (
    <div className="App">
      <Admin
        title={"CTAD"}
        dataProvider={dataProvider}
        authProvider={jwtAuthProvider}
        theme={theme}
        dashboard={Dashboard}
        loginPage={Login}
      >
        <Resource
          name="User"
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
          show={UserShow}
        />
        <Resource
          name="Aluno"
          list={AlunoList}
          edit={AlunoEdit}
          create={AlunoCreate}
          show={AlunoShow}
        />
        <Resource
          name="Ocorrencia"
          list={OcorrenciaList}
          edit={OcorrenciaEdit}
          create={OcorrenciaCreate}
          show={OcorrenciaShow}
        />
        <Resource
          name="TipoAtividade"
          list={TipoAtividadeList}
          edit={TipoAtividadeEdit}
          create={TipoAtividadeCreate}
          show={TipoAtividadeShow}
        />
        <Resource
          name="ParticipacaoAtividade"
          list={ParticipacaoAtividadeList}
          edit={ParticipacaoAtividadeEdit}
          create={ParticipacaoAtividadeCreate}
          show={ParticipacaoAtividadeShow}
        />
      </Admin>
    </div>
  );
};

export default App;
