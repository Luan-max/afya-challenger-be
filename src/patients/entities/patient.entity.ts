import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  PATIENT_BIRTHDAY_DESCRIPTION,
  PATIENT_BIRTHDAY_EXAMPLE,
  PATIENT_CREATED_AT_DESCRIPTION,
  PATIENT_CREATED_AT_EXAMPLE,
  PATIENT_EMAIL_DESCRIPTION,
  PATIENT_EMAIL_EXAMPLE,
  PATIENT_GENDER_DESCRIPTION,
  PATIENT_GENDER_EXAMPLE,
  PATIENT_HEIGHT_DESCRIPTION,
  PATIENT_HEIGHT_EXAMPLE,
  PATIENT_ID_DESCRIPTION,
  PATIENT_ID_EXAMPLE,
  PATIENT_NAME_DESCRIPTION,
  PATIENT_NAME_EXAMPLE,
  PATIENT_PHONE_DESCRIPTION,
  PATIENT_PHONE_EXAMPLE,
  PATIENT_UPDATED_AT_DESCRIPTION,
  PATIENT_UPDATED_AT_EXAMPLE,
  PATIENT_WEIGHT_DESCRIPTION,
  PATIENT_WEIGHT_EXAMPLE,
} from '../constants';

export enum Gender {
  feminine = 'feminine',
  masculine = 'masculine',
}

@Entity()
export class Patient {
  @ApiProperty({
    description: PATIENT_ID_DESCRIPTION,
    example: PATIENT_ID_EXAMPLE,
  })
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty({
    description: PATIENT_NAME_DESCRIPTION,
    example: PATIENT_NAME_EXAMPLE,
  })
  @Column({ nullable: false, type: 'varchar' })
  name: string;

  @ApiProperty({
    description: PATIENT_PHONE_DESCRIPTION,
    example: PATIENT_PHONE_EXAMPLE,
  })
  @Column({ nullable: false, type: 'varchar' })
  phone: string;

  @ApiProperty({
    description: PATIENT_EMAIL_DESCRIPTION,
    example: PATIENT_EMAIL_EXAMPLE,
    required: true,
  })
  @Column({ nullable: false, type: 'varchar' })
  email: string;

  @ApiProperty({
    description: PATIENT_BIRTHDAY_DESCRIPTION,
    example: PATIENT_BIRTHDAY_EXAMPLE,
  })
  @Column({ nullable: false, type: 'varchar' })
  birthday: Date;

  @ApiProperty({
    description: PATIENT_GENDER_DESCRIPTION,
    example: PATIENT_GENDER_EXAMPLE,
  })
  @Column({ nullable: false, type: 'varchar', enum: Gender })
  gender: string;

  @ApiProperty({
    description: PATIENT_HEIGHT_DESCRIPTION,
    example: PATIENT_HEIGHT_EXAMPLE,
  })
  @Column({ nullable: false, type: 'varchar' })
  height: string;

  @ApiProperty({
    description: PATIENT_WEIGHT_DESCRIPTION,
    example: PATIENT_WEIGHT_EXAMPLE,
  })
  @Column({ nullable: false, type: 'varchar' })
  weight: string;

  @ApiProperty({
    description: PATIENT_CREATED_AT_DESCRIPTION,
    example: PATIENT_CREATED_AT_EXAMPLE,
  })
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty({
    description: PATIENT_UPDATED_AT_DESCRIPTION,
    example: PATIENT_UPDATED_AT_EXAMPLE,
  })
  @UpdateDateColumn()
  updatedAt: string;
}
