import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import {
  APPOINTMENT_PATIENT_ID_DESCRIPTION,
  APPOINTMENT_PATIENT_ID_EXAMPLE,
  APPOINTMENT_DATETIME_DESCRIPTION,
  APPOINTMENT_DATE_TIME_EXAMPLE,
} from '../constants';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: APPOINTMENT_DATETIME_DESCRIPTION,
    example: APPOINTMENT_DATE_TIME_EXAMPLE,
  })
  startDate: string;

  @IsNotEmpty()
  @ApiProperty({
    description: APPOINTMENT_PATIENT_ID_DESCRIPTION,
    example: APPOINTMENT_PATIENT_ID_EXAMPLE,
  })
  patientId: string;
}
