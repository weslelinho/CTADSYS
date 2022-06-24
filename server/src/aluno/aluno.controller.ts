import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { AlunoService } from "./aluno.service";
import { AlunoControllerBase } from "./base/aluno.controller.base";

@swagger.ApiTags("alunos")
@common.Controller("alunos")
export class AlunoController extends AlunoControllerBase {
  constructor(
    protected readonly service: AlunoService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
