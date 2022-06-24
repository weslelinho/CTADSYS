import { Test } from "@nestjs/testing";
import { INestApplication, HttpStatus, ExecutionContext } from "@nestjs/common";
import request from "supertest";
import { MorganModule } from "nest-morgan";
import { ACGuard } from "nest-access-control";
import { DefaultAuthGuard } from "../../auth/defaultAuth.guard";
import { ACLModule } from "../../auth/acl.module";
import { AlunoController } from "../aluno.controller";
import { AlunoService } from "../aluno.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  cidade: "exampleCidade",
  cpf: "exampleCpf",
  createdAt: new Date(),
  dataEmissaoRg: new Date(),
  dataNascimento: new Date(),
  dataSaida: new Date(),
  endereco: "exampleEndereco",
  filiacaoMae: "exampleFiliacaoMae",
  filiacaoPai: "exampleFiliacaoPai",
  id: "exampleId",
  idadeInicioDroga: "exampleIdadeInicioDroga",
  matricula: 42,
  nome: "exampleNome",
  outraClinica: "exampleOutraClinica",
  possuiDoenca: "examplePossuiDoenca",
  processo: "exampleProcesso",
  profissao: "exampleProfissao",
  regulamento: "true",
  religiao: "exampleReligiao",
  rg: "exampleRg",
  rgOrgaoExpedidor: "exampleRgOrgaoExpedidor",
  secao: "exampleSecao",
  tempoInternacao: "true",
  tiposDrogas: "exampleTiposDrogas",
  tituloEleitor: "exampleTituloEleitor",
  uf: "exampleUf",
  updatedAt: new Date(),
  zona: "exampleZona",
};
const CREATE_RESULT = {
  cidade: "exampleCidade",
  cpf: "exampleCpf",
  createdAt: new Date(),
  dataEmissaoRg: new Date(),
  dataNascimento: new Date(),
  dataSaida: new Date(),
  endereco: "exampleEndereco",
  filiacaoMae: "exampleFiliacaoMae",
  filiacaoPai: "exampleFiliacaoPai",
  id: "exampleId",
  idadeInicioDroga: "exampleIdadeInicioDroga",
  matricula: 42,
  nome: "exampleNome",
  outraClinica: "exampleOutraClinica",
  possuiDoenca: "examplePossuiDoenca",
  processo: "exampleProcesso",
  profissao: "exampleProfissao",
  regulamento: "true",
  religiao: "exampleReligiao",
  rg: "exampleRg",
  rgOrgaoExpedidor: "exampleRgOrgaoExpedidor",
  secao: "exampleSecao",
  tempoInternacao: "true",
  tiposDrogas: "exampleTiposDrogas",
  tituloEleitor: "exampleTituloEleitor",
  uf: "exampleUf",
  updatedAt: new Date(),
  zona: "exampleZona",
};
const FIND_MANY_RESULT = [
  {
    cidade: "exampleCidade",
    cpf: "exampleCpf",
    createdAt: new Date(),
    dataEmissaoRg: new Date(),
    dataNascimento: new Date(),
    dataSaida: new Date(),
    endereco: "exampleEndereco",
    filiacaoMae: "exampleFiliacaoMae",
    filiacaoPai: "exampleFiliacaoPai",
    id: "exampleId",
    idadeInicioDroga: "exampleIdadeInicioDroga",
    matricula: 42,
    nome: "exampleNome",
    outraClinica: "exampleOutraClinica",
    possuiDoenca: "examplePossuiDoenca",
    processo: "exampleProcesso",
    profissao: "exampleProfissao",
    regulamento: "true",
    religiao: "exampleReligiao",
    rg: "exampleRg",
    rgOrgaoExpedidor: "exampleRgOrgaoExpedidor",
    secao: "exampleSecao",
    tempoInternacao: "true",
    tiposDrogas: "exampleTiposDrogas",
    tituloEleitor: "exampleTituloEleitor",
    uf: "exampleUf",
    updatedAt: new Date(),
    zona: "exampleZona",
  },
];
const FIND_ONE_RESULT = {
  cidade: "exampleCidade",
  cpf: "exampleCpf",
  createdAt: new Date(),
  dataEmissaoRg: new Date(),
  dataNascimento: new Date(),
  dataSaida: new Date(),
  endereco: "exampleEndereco",
  filiacaoMae: "exampleFiliacaoMae",
  filiacaoPai: "exampleFiliacaoPai",
  id: "exampleId",
  idadeInicioDroga: "exampleIdadeInicioDroga",
  matricula: 42,
  nome: "exampleNome",
  outraClinica: "exampleOutraClinica",
  possuiDoenca: "examplePossuiDoenca",
  processo: "exampleProcesso",
  profissao: "exampleProfissao",
  regulamento: "true",
  religiao: "exampleReligiao",
  rg: "exampleRg",
  rgOrgaoExpedidor: "exampleRgOrgaoExpedidor",
  secao: "exampleSecao",
  tempoInternacao: "true",
  tiposDrogas: "exampleTiposDrogas",
  tituloEleitor: "exampleTituloEleitor",
  uf: "exampleUf",
  updatedAt: new Date(),
  zona: "exampleZona",
};

const service = {
  create() {
    return CREATE_RESULT;
  },
  findMany: () => FIND_MANY_RESULT,
  findOne: ({ where }: { where: { id: string } }) => {
    switch (where.id) {
      case existingId:
        return FIND_ONE_RESULT;
      case nonExistingId:
        return null;
    }
  },
};

const basicAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const argumentHost = context.switchToHttp();
    const request = argumentHost.getRequest();
    request.user = {
      roles: ["user"],
    };
    return true;
  },
};

const acGuard = {
  canActivate: () => {
    return true;
  },
};

describe("Aluno", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: AlunoService,
          useValue: service,
        },
      ],
      controllers: [AlunoController],
      imports: [MorganModule.forRoot(), ACLModule],
    })
      .overrideGuard(DefaultAuthGuard)
      .useValue(basicAuthGuard)
      .overrideGuard(ACGuard)
      .useValue(acGuard)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test("POST /alunos", async () => {
    await request(app.getHttpServer())
      .post("/alunos")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        dataEmissaoRg: CREATE_RESULT.dataEmissaoRg.toISOString(),
        dataNascimento: CREATE_RESULT.dataNascimento.toISOString(),
        dataSaida: CREATE_RESULT.dataSaida.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
      });
  });

  test("GET /alunos", async () => {
    await request(app.getHttpServer())
      .get("/alunos")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          createdAt: FIND_MANY_RESULT[0].createdAt.toISOString(),
          dataEmissaoRg: FIND_MANY_RESULT[0].dataEmissaoRg.toISOString(),
          dataNascimento: FIND_MANY_RESULT[0].dataNascimento.toISOString(),
          dataSaida: FIND_MANY_RESULT[0].dataSaida.toISOString(),
          updatedAt: FIND_MANY_RESULT[0].updatedAt.toISOString(),
        },
      ]);
  });

  test("GET /alunos/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/alunos"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /alunos/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/alunos"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        createdAt: FIND_ONE_RESULT.createdAt.toISOString(),
        dataEmissaoRg: FIND_ONE_RESULT.dataEmissaoRg.toISOString(),
        dataNascimento: FIND_ONE_RESULT.dataNascimento.toISOString(),
        dataSaida: FIND_ONE_RESULT.dataSaida.toISOString(),
        updatedAt: FIND_ONE_RESULT.updatedAt.toISOString(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
