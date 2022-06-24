import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { OcorrenciaService } from "./ocorrencia.service";
import { OcorrenciaControllerBase } from "./base/ocorrencia.controller.base";

@swagger.ApiTags("ocorrencias")
@common.Controller("ocorrencias")
export class OcorrenciaController extends OcorrenciaControllerBase {
  constructor(
    protected readonly service: OcorrenciaService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
