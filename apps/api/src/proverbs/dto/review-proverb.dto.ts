import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum ReviewProverbStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class ReviewProverbDto {
  @ApiProperty({
    enum: ReviewProverbStatus,
    example: ReviewProverbStatus.APPROVED,
    description: 'Moderation decision for a pending proverb submission.',
  })
  @IsEnum(ReviewProverbStatus)
  status: ReviewProverbStatus;
}
