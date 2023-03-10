import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import {
  NOTES_DTO_APPOINTMENT_ID_DESCRIPTION,
  NOTES_DTO_APPOINTMENT_ID_EXAMPLE,
  NOTES_DTO_DATE_DESCRIPTION,
  NOTES_DTO_DATE_EXAMPLE,
  NOTE_DTO_NOTES_DESCRIPTION,
  NOTES_DTO_NOTES_EXAMPLE,
} from '../constants';

export class CreateMedicalConsultationNoteDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: NOTES_DTO_DATE_DESCRIPTION,
    example: NOTES_DTO_DATE_EXAMPLE,
  })
  date: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: NOTE_DTO_NOTES_DESCRIPTION,
    example: NOTES_DTO_NOTES_EXAMPLE,
  })
  notes: string;

  @ApiProperty({
    description: NOTES_DTO_APPOINTMENT_ID_DESCRIPTION,
    example: NOTES_DTO_APPOINTMENT_ID_EXAMPLE,
    required: false,
  })
  appointmentId?: string;
}
