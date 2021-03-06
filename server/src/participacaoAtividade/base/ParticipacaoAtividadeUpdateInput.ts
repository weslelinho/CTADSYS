/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/docs/how-to/custom-code

------------------------------------------------------------------------------
  */
import { InputType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { AlunoWhereUniqueInput } from "../../aluno/base/AlunoWhereUniqueInput";
import { ValidateNested, IsOptional, IsDate } from "class-validator";
import { Type } from "class-transformer";
import { TipoAtividadeWhereUniqueInput } from "../../tipoAtividade/base/TipoAtividadeWhereUniqueInput";
@InputType()
class ParticipacaoAtividadeUpdateInput {
  @ApiProperty({
    required: false,
    type: () => AlunoWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => AlunoWhereUniqueInput)
  @IsOptional()
  @Field(() => AlunoWhereUniqueInput, {
    nullable: true,
  })
  aluno?: AlunoWhereUniqueInput;

  @ApiProperty({
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  data?: Date | null;

  @ApiProperty({
    required: false,
    type: () => TipoAtividadeWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => TipoAtividadeWhereUniqueInput)
  @IsOptional()
  @Field(() => TipoAtividadeWhereUniqueInput, {
    nullable: true,
  })
  tipoAtividade?: TipoAtividadeWhereUniqueInput;
}
export { ParticipacaoAtividadeUpdateInput };
