import { ApiProperty } from '@nestjs/swagger';
import { Patient } from '../../patients/entities/patient.entity';

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {
  APPOINTMENT_CREATED_AT_DESCRIPTION,
  APPOINTMENT_CREATED_AT_EXAMPLE,
  APPOINTMENT_END_DATETIME_DESCRIPTION,
  APPOINTMENT_END_DATETIME_EXAMPLE,
  APPOINTMENT_PATIENT_ID_DESCRIPTION,
  APPOINTMENT_PATIENT_ID_EXAMPLE,
  APPOINTMENT_DATETIME_DESCRIPTION,
  APPOINTMENT_DATETIME_EXAMPLE,
  APPOINTMENT_UPDATED_AT_DESCRIPTION,
  APPOINTMENT_UPDATED_AT_EXAMPLE,
} from '../constants';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: APPOINTMENT_DATETIME_DESCRIPTION,
    example: APPOINTMENT_DATETIME_EXAMPLE,
  })
  startDate: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: APPOINTMENT_END_DATETIME_DESCRIPTION,
    example: APPOINTMENT_END_DATETIME_EXAMPLE,
  })
  endDate: string;

  @Column({ nullable: false, type: 'varchar' })
  @ManyToOne(() => Patient, { onDelete: 'SET NULL' })
  @ApiProperty({
    description: APPOINTMENT_PATIENT_ID_DESCRIPTION,
    example: APPOINTMENT_PATIENT_ID_EXAMPLE,
  })
  patientId: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: APPOINTMENT_CREATED_AT_DESCRIPTION,
    example: APPOINTMENT_CREATED_AT_EXAMPLE,
  })
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: APPOINTMENT_UPDATED_AT_DESCRIPTION,
    example: APPOINTMENT_UPDATED_AT_EXAMPLE,
  })
  updatedAt: Date;
}
