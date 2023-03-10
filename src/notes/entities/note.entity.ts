import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from '../../appointments/entities/appointment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  NOTES_DTO_APPOINTMENT_ID_DESCRIPTION,
  NOTES_DTO_APPOINTMENT_ID_EXAMPLE,
  NOTES_DTO_NOTES_EXAMPLE,
  NOTE_DTO_NOTES_DESCRIPTION,
  NOTES_DTO_DATE_DESCRIPTION,
  NOTES_DTO_DATE_EXAMPLE,
  NOTES_CREATED_AT_DESCRIPTION,
  NOTES_CREATED_AT_EXAMPLE,
  NOTES_UPDATED_AT_EXAMPLE,
  NOTES_UPDATED_AT_DESCRIPTION,
} from '../constants';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: NOTES_DTO_APPOINTMENT_ID_DESCRIPTION,
    example: NOTES_DTO_APPOINTMENT_ID_EXAMPLE,
  })
  id: number;

  @Column()
  @ApiProperty({
    description: NOTES_DTO_DATE_DESCRIPTION,
    example: NOTES_DTO_DATE_EXAMPLE,
  })
  date: Date;

  @Column()
  @ApiProperty({
    description: NOTES_DTO_NOTES_EXAMPLE,
    example: NOTE_DTO_NOTES_DESCRIPTION,
  })
  note: string;

  @Column({ nullable: false, type: 'varchar' })
  @ManyToOne(() => Appointment)
  @ApiProperty({
    description: NOTES_DTO_APPOINTMENT_ID_DESCRIPTION,
    example: NOTES_DTO_APPOINTMENT_ID_EXAMPLE,
  })
  appointmentId: string;

  @ApiProperty({
    description: NOTES_CREATED_AT_DESCRIPTION,
    example: NOTES_CREATED_AT_EXAMPLE,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: NOTES_UPDATED_AT_DESCRIPTION,
    example: NOTES_UPDATED_AT_EXAMPLE,
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
