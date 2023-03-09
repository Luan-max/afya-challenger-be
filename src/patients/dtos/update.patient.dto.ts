import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import {
  PATIENT_BIRTHDAY_DESCRIPTION,
  PATIENT_BIRTHDAY_EXAMPLE,
  PATIENT_EMAIL_DESCRIPTION,
  PATIENT_EMAIL_EXAMPLE,
  PATIENT_GENDER_DESCRIPTION,
  PATIENT_GENDER_EXAMPLE,
  PATIENT_HEIGHT_DESCRIPTION,
  PATIENT_HEIGHT_EXAMPLE,
  PATIENT_NAME_DESCRIPTION,
  PATIENT_NAME_EXAMPLE,
  PATIENT_PHONE_DESCRIPTION,
  PATIENT_PHONE_EXAMPLE,
  PATIENT_WEIGHT_DESCRIPTION,
  PATIENT_WEIGHT_EXAMPLE,
} from '../constants';

export enum Gender {
  feminine = 'feminine',
  masculine = 'masculine',
}

import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @ApiProperty({
    description: PATIENT_NAME_DESCRIPTION,
    example: PATIENT_NAME_EXAMPLE,
  })
  name?: string;
  @ApiProperty({
    description: PATIENT_PHONE_DESCRIPTION,
    example: PATIENT_PHONE_EXAMPLE,
  })
  phone?: string;
  @IsEmail()
  @ApiProperty({
    description: PATIENT_EMAIL_DESCRIPTION,
    example: PATIENT_EMAIL_EXAMPLE,
  })
  email?: string;
  @ApiProperty({
    description: PATIENT_BIRTHDAY_DESCRIPTION,
    example: PATIENT_BIRTHDAY_EXAMPLE,
  })
  birthday?: Date;
  @ApiProperty({
    description: PATIENT_GENDER_DESCRIPTION,
    example: PATIENT_GENDER_EXAMPLE,
  })
  @IsEnum(Gender)
  gender?: string;
  @ApiProperty({
    description: PATIENT_HEIGHT_DESCRIPTION,
    example: PATIENT_HEIGHT_EXAMPLE,
  })
  height?: string;
  @ApiProperty({
    description: PATIENT_WEIGHT_DESCRIPTION,
    example: PATIENT_WEIGHT_EXAMPLE,
  })
  weight?: string;
}
