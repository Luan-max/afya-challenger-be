import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Patient } from '../patients/entities/patient.entity';
import { AppoitmentMocks } from './appointments.mocks';
import { AppointmentsService } from './appointments.service';
import * as checkAppointmentAvailability from './helpers/checkAppointmentAvailability.helper';

describe('AppointmentsService', () => {
  let appointmentService: AppointmentsService;
  let appointmentRepository: Repository<Appointment>;
  let patientRepository: Repository<Patient>;
  let objectAppoitmentMock: AppoitmentMocks;

  beforeEach(async () => {
    objectAppoitmentMock = new AppoitmentMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useClass: jest.fn(() => ({
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          })),
        },
        {
          provide: getRepositoryToken(Patient),
          useClass: jest.fn(() => ({
            findOne: jest.fn(),
          })),
        },
      ],
    }).compile();

    appointmentService = module.get<AppointmentsService>(AppointmentsService);
    appointmentRepository = module.get<Repository<Appointment>>(
      getRepositoryToken(Appointment),
    );
    patientRepository = module.get<Repository<Patient>>(
      getRepositoryToken(Patient),
    );
  });

  describe('create', () => {
    let expectedAppointment;
    let createAppointmentDto;
    let patientId;
    describe('when no error', () => {
      it('should create an appointment successfully', async () => {
        createAppointmentDto = objectAppoitmentMock.createAppointmentDto;
        patientId = '1';
        expectedAppointment = objectAppoitmentMock.expectedAppointment;

        const patient = new Patient();
        patient.id = patientId;

        patientRepository.findOne = jest.fn().mockResolvedValue(patient);
        jest
          .spyOn(checkAppointmentAvailability, 'checkAppointmentAvailability')
          .mockResolvedValue(true);
        appointmentRepository.save = jest
          .fn()
          .mockResolvedValue(expectedAppointment);

        const result = await appointmentService.create(createAppointmentDto);
        expect(patientRepository.findOne).toHaveBeenCalledWith({
          where: { id: patientId },
        });
        expect(appointmentRepository.save).toHaveBeenCalledWith({
          patientId,
          startDate: createAppointmentDto.startDate,
          endDate: new Date(
            new Date(createAppointmentDto.startDate).setHours(
              new Date().getHours() + 4,
            ),
          ).toISOString(),
        });
        expect(result).toEqual(expectedAppointment);
      });
    });

    describe('when error', () => {
      it('when trying to create a schedule for patient that doesnt exist', async () => {
        createAppointmentDto = objectAppoitmentMock.createAppointmentDto;
        patientId = '1';
        const patient = new Patient();
        patient.id = patientId;

        patientRepository.findOne = jest.fn().mockReturnValue(undefined);

        try {
          await appointmentService.create(createAppointmentDto);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toStrictEqual(
            'Patient does not exists for create appointment',
          );
          expect(error.status).toStrictEqual(400);
        }
      });

      it('when you are trying to create a schedule at the same time', async () => {
        createAppointmentDto = objectAppoitmentMock.createAppointmentDto;
        patientId = '1';
        const patient = new Patient();
        patient.id = patientId;

        patientRepository.findOne = jest.fn().mockResolvedValue(patient);
        jest
          .spyOn(checkAppointmentAvailability, 'checkAppointmentAvailability')
          .mockResolvedValue(false);

        try {
          await appointmentService.create(createAppointmentDto);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toStrictEqual(
            'You already have an appointment scheduled for this time',
          );
          expect(error.status).toStrictEqual(400);
        }
      });

      it('when an unexpected error occurs in the creation of the schedule', async () => {
        createAppointmentDto = objectAppoitmentMock.createAppointmentDto;
        patientId = '1';
        const patient = new Patient();
        patient.id = patientId;

        patientRepository.findOne = jest.fn().mockResolvedValue(patient);
        jest
          .spyOn(checkAppointmentAvailability, 'checkAppointmentAvailability')
          .mockResolvedValue(true);
        appointmentRepository.save = jest.fn().mockRejectedValue(new Error());

        try {
          await appointmentService.create(createAppointmentDto);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.message).toStrictEqual(
            'Internal server expection error trying create appointment',
          );
          expect(error.status).toStrictEqual(500);
        }
      });
    });
  });

  describe('update', () => {
    let updateAppointmentDto;
    let mockId;

    describe('when no error', () => {
      it('should update an appointment successfully', async () => {
        updateAppointmentDto = objectAppoitmentMock.updateAppointmentDto;
        mockId = '1';

        jest
          .spyOn(checkAppointmentAvailability, 'checkAppointmentAvailability')
          .mockResolvedValue(true);
        appointmentRepository.update = jest.fn().mockResolvedValue(undefined);

        const result = await appointmentService.update(
          mockId,
          updateAppointmentDto,
        );
        expect(appointmentRepository.update).toHaveBeenCalledWith(mockId, {
          startDate: updateAppointmentDto.startDate,
          endDate: new Date(
            new Date(updateAppointmentDto.startDate).setHours(
              new Date().getHours() + 4,
            ),
          ).toISOString(),
        });
        expect(result).toEqual(undefined);
      });
    });

    describe('when error', () => {
      it('when you are trying to update a schedule at the same time', async () => {
        updateAppointmentDto = objectAppoitmentMock.updateAppointmentDto;

        jest
          .spyOn(checkAppointmentAvailability, 'checkAppointmentAvailability')
          .mockResolvedValue(false);

        try {
          await appointmentService.update(mockId, updateAppointmentDto);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toStrictEqual(
            'You already have an appointment scheduled for this time',
          );
          expect(error.status).toStrictEqual(400);
        }
      });

      it('when an unexpected error occurs in the update of the schedule', async () => {
        updateAppointmentDto = objectAppoitmentMock.updateAppointmentDto;

        jest
          .spyOn(checkAppointmentAvailability, 'checkAppointmentAvailability')
          .mockResolvedValue(true);
        appointmentRepository.save = jest.fn().mockRejectedValue(new Error());

        try {
          await appointmentService.update(mockId, updateAppointmentDto);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.message).toStrictEqual(
            'Internal server expection error trying update appointment',
          );
          expect(error.status).toStrictEqual(500);
        }
      });
    });
  });

  describe('findAll', () => {
    describe('when no error', () => {
      it('should return appointments', async () => {
        const appointments = objectAppoitmentMock.appointment;
        appointmentRepository.find = jest.fn().mockResolvedValue(appointments);

        const result = await appointmentService.findAll();

        expect(result).toEqual(appointments);
      });
    });

    describe('when error', () => {
      it('when an unexpected error', async () => {
        appointmentRepository.find = jest.fn().mockRejectedValue(new Error());

        try {
          await appointmentService.findAll();
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.message).toStrictEqual(
            'Internal server expection error trying list appointments',
          );
          expect(error.status).toStrictEqual(500);
        }
      });
    });
  });

  describe('remove', () => {
    let mockId;
    let mockAppointment;

    describe('when no error', () => {
      it('should remove appointment', async () => {
        mockId = 1;
        mockAppointment = objectAppoitmentMock.appointment;
        appointmentRepository.findOne = jest
          .fn()
          .mockResolvedValue(mockAppointment);
        appointmentRepository.delete = jest.fn().mockResolvedValue(undefined);

        const result = await appointmentService.remove(mockId);

        expect(appointmentRepository.findOne).toHaveBeenCalledWith({
          where: {
            id: mockId,
          },
        });
        expect(appointmentRepository.delete).toHaveBeenCalledWith(mockId);
        expect(result).toEqual(undefined);
      });
    });

    describe('when error', () => {
      it('when trying to remove a schedule that doesnt exist', async () => {
        mockId = 1;
        mockAppointment = objectAppoitmentMock.appointment;
        appointmentRepository.findOne = jest.fn().mockResolvedValue(undefined);
        appointmentRepository.delete = jest.fn().mockResolvedValue(undefined);

        try {
          await appointmentService.remove(mockId);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toStrictEqual(
            'Appointment you are trying to delete does not exist',
          );
          expect(error.status).toStrictEqual(400);
        }
      });

      it('when an unexpected error trying to remove a schedule', async () => {
        mockId = 1;
        mockAppointment = objectAppoitmentMock.appointment;
        appointmentRepository.findOne = jest
          .fn()
          .mockResolvedValue(mockAppointment);
        appointmentRepository.delete = jest.fn().mockRejectedValue(new Error());

        try {
          await appointmentService.remove(mockId);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.message).toStrictEqual(
            'Internal server expection error trying remove patient',
          );
          expect(error.status).toStrictEqual(500);
        }
      });
    });
  });
});
