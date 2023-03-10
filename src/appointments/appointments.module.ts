import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Patient])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
