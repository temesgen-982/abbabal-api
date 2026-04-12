import { PartialType } from '@nestjs/swagger';
import { CreateProverbDto } from './create-proverb.dto';

export class UpdateProverbDto extends PartialType(CreateProverbDto) {}
