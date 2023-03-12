import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { AppointmentsService } from './appointments.service';
import { Note } from 'src/notes/entities/note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Patient, Note])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
