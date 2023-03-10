import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import {
  APPOINTMENT_PATIENT_ID_DESCRIPTION,
  APPOINTMENT_PATIENT_ID_EXAMPLE,
  APPOINTMENT_DATETIME_DESCRIPTION,
  APPOINTMENT_DATE_TIME_EXAMPLE,
} from '../constants';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsDateString()
  @ApiProperty({
    description: APPOINTMENT_DATETIME_DESCRIPTION,
    example: APPOINTMENT_DATE_TIME_EXAMPLE,
  })
  startDate?: string;

  @ApiProperty({
    description: APPOINTMENT_PATIENT_ID_DESCRIPTION,
    example: APPOINTMENT_PATIENT_ID_EXAMPLE,
  })
  patientId?: string;
}
