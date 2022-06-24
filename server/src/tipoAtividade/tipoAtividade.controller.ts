import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { TipoAtividadeService } from "./tipoAtividade.service";
import { TipoAtividadeControllerBase } from "./base/tipoAtividade.controller.base";

@swagger.ApiTags("tipoAtividades")
@common.Controller("tipoAtividades")
export class TipoAtividadeController extends TipoAtividadeControllerBase {
  constructor(
    protected readonly service: TipoAtividadeService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
