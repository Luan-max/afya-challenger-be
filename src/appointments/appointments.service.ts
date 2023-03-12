import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from '../appointments/dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { Appointment } from '../appointments/entities/appointment.entity';

import { checkAppointmentAvailability } from './helpers/checkAppointmentAvailability.helper';
import { Note } from '../notes/entities/note.entity';
@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const { patientId, startDate } = createAppointmentDto;

      const patient = await this.patientRepository.findOne({
        where: { id: patientId },
      });

      if (!patient) {
        throw new BadRequestException(
          'Patient does not exists for create appointment',
        );
      }

      const appointmentDate = startDate;
      const endDate = new Date(
        new Date(startDate).setHours(new Date().getHours() + 4),
      ).toISOString();

      const isAvailable = await checkAppointmentAvailability(
        this.appointmentRepository,
        appointmentDate,
        endDate,
      );

      if (!isAvailable) {
        throw new BadRequestException(
          'You already have an appointment scheduled for this time',
        );
      }

      const create = await this.appointmentRepository.save({
        patientId,
        startDate: appointmentDate,
        endDate: endDate,
      });

      return create;
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new BadRequestException({
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
        });

      throw new InternalServerErrorException({
        message: 'Internal server expection error trying create appointment',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAll(): Promise<Appointment[]> {
    try {
      const appointments = await this.appointmentRepository.find();
      return appointments;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server expection error trying list appointments',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    try {
      const { startDate } = updateAppointmentDto;

      const appointmentDate = startDate;
      const endDate = new Date(
        new Date(startDate).setHours(new Date().getHours() + 4),
      ).toISOString();

      const isAvailable = await checkAppointmentAvailability(
        this.appointmentRepository,
        appointmentDate,
        endDate,
      );

      if (!isAvailable) {
        throw new BadRequestException(
          'You already have an appointment scheduled for this time',
        );
      }

      await this.appointmentRepository.update(id, {
        startDate: appointmentDate,
        endDate,
      });

      return;
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new BadRequestException({
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
        });

      throw new InternalServerErrorException({
        message: 'Internal server expection error trying update appointment',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async remove(id: string) {
    try {
      const appointmentsExists = await this.appointmentRepository.findOne({
        where: {
          id,
        },
      });

      if (!appointmentsExists) {
        throw new BadRequestException(
          'Appointment you are trying to delete does not exist',
        );
      }

      await this.appointmentRepository.delete(id);

      return;
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new BadRequestException({
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
        });

      throw new InternalServerErrorException({
        message: 'Internal server expection error trying remove patient',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getById(id: string) {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { id },
        select: ['id', 'startDate', 'endDate'],
      });

      if (!appointment) {
        throw new NotFoundException('Appointment does not exist');
      }

      const [notes, patient] = await Promise.all([
        this.notesRepository.find({
          where: { appointmentId: id },
          select: ['date', 'note'],
        }),
        this.patientRepository.findOne({
          where: { id: appointment.patientId },
          select: ['name', 'weight', 'height', 'birthday'],
        }),
      ]);

      return {
        ...appointment,
        notes,
        patient,
      };
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException({
          message: error.message,
          statusCode: HttpStatus.NOT_FOUND,
        });

      throw new InternalServerErrorException({
        message: 'Internal server expection error trying get details patient',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
