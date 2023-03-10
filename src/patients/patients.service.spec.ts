import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { PatientMocks } from './patients.mocks';
import { PatientsService } from './patients.service';

describe('PatientService', () => {
  let patientService: PatientsService;
  let patientRepository: Repository<Patient>;
  let patientMock: PatientMocks;

  beforeEach(async () => {
    patientMock = new PatientMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useClass: jest.fn(() => ({
            save: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          })),
        },
      ],
    }).compile();

    patientService = module.get<PatientsService>(PatientsService);
    patientRepository = module.get<Repository<Patient>>(
      getRepositoryToken(Patient),
    );
  });

  describe('create', () => {
    describe('when no error', () => {
      it('find patient for check if the user already exists', async () => {
        const createPatientDto = patientMock.createPatientMock;
        jest.spyOn(patientRepository, 'findOne').mockReturnValue(undefined);

        await patientService.create(createPatientDto);

        expect(patientRepository.findOne).toHaveBeenCalledWith({
          where: { email: createPatientDto.email },
        });
      });

      it('create a new patient', async () => {
        const createPatientDto = patientMock.createPatientMock;
        const expectedPatient = patientMock.expectedPatient;
        jest
          .spyOn(patientRepository, 'save')
          .mockResolvedValue(expectedPatient);

        const result = await patientService.create(createPatientDto);

        expect(patientRepository.save).toHaveBeenCalledWith(createPatientDto);
        expect(result).toEqual(expectedPatient);
      });
    });

    describe('when error', () => {
      it('when trying to create a patient that already exists', async () => {
        const createPatientDto = patientMock.createPatientMock;
        jest.spyOn(patientRepository, 'findOne').mockReturnThis();

        try {
          await patientService.create(createPatientDto);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toStrictEqual('Patient already exists');
          expect(error.status).toStrictEqual(400);
        }
      });

      it('internal error unexpected by the application', async () => {
        const createPatientDto = patientMock.createPatientMock;
        jest.spyOn(patientRepository, 'findOne').mockReturnValue(undefined);
        jest.spyOn(patientRepository, 'save').mockRejectedValue(new Error());

        try {
          await patientService.create(createPatientDto);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.message).toStrictEqual(
            'Internal server expection error trying create patient',
          );
          expect(error.status).toStrictEqual(500);
        }
      });
    });
  });

  describe('update', () => {
    describe('when no error', () => {
      it('find patient for check if the user exists', async () => {
        const updatePatientDto = patientMock.updatePatientMock;
        const patientId = patientMock.patientId;
        jest.spyOn(patientRepository, 'findOne').mockReturnThis();

        await patientService.update(patientId, updatePatientDto);

        expect(patientRepository.findOne).toHaveBeenCalledWith({
          where: { id: patientId },
        });
      });

      it('update patient', async () => {
        const updatePatientDto = patientMock.updatePatientMock;
        const patientId = patientMock.patientId;
        jest.spyOn(patientRepository, 'findOne').mockReturnThis();
        jest.spyOn(patientRepository, 'update').mockResolvedValue(undefined);

        const result = await patientService.update(patientId, updatePatientDto);

        expect(patientRepository.update).toHaveBeenCalledWith(
          patientId,
          updatePatientDto,
        );
        expect(result).toEqual(undefined);
      });
    });

    describe('when error', () => {
      it('when trying to update a user that doesnt exist', async () => {
        const updatePatientDto = patientMock.updatePatientMock;
        const patientId = patientMock.patientId;
        jest.spyOn(patientRepository, 'findOne').mockReturnValue(undefined);

        try {
          await patientService.update(patientId, updatePatientDto);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toStrictEqual(
            'Patient you are trying to update does not exist',
          );
          expect(error.status).toStrictEqual(400);
        }
      });

      it('internal error unexpected by the application', async () => {
        const updatePatientDto = patientMock.updatePatientMock;
        const patientId = patientMock.patientId;
        jest.spyOn(patientRepository, 'findOne').mockReturnThis();
        jest.spyOn(patientRepository, 'update').mockRejectedValue(new Error());

        try {
          await patientService.update(patientId, updatePatientDto);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.message).toStrictEqual(
            'Internal server expection error trying update patient',
          );
          expect(error.status).toStrictEqual(500);
        }
      });
    });
  });

  describe('findAll', () => {
    it('when no error', async () => {
      const patients = patientMock.mockPatients;
      const params = {
        name: 'John',
      };
      patientRepository.find = jest.fn().mockResolvedValue(patients);

      const result = await patientService.findAll(params.name);
      expect(result).toEqual(patients);
    });

    it('when internal error unexpected by the application ', async () => {
      const params = {
        name: 'John',
      };
      patientRepository.find = jest.fn().mockRejectedValue(new Error());

      try {
        await patientService.findAll(params.name);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toStrictEqual(
          'Internal server expection error trying list patients',
        );
        expect(error.status).toStrictEqual(500);
      }
    });
  });

  describe('remove', () => {
    describe('when no error', () => {
      it('find patient for check if the user exists', async () => {
        const patientId = patientMock.patientId;
        jest.spyOn(patientRepository, 'findOne').mockReturnThis();

        await patientService.remove(patientId);

        expect(patientRepository.findOne).toHaveBeenCalledWith({
          where: { id: patientId },
        });
      });

      it('remove an patient', async () => {
        const patientId = patientMock.patientId;
        jest.spyOn(patientRepository, 'findOne').mockReturnThis();
        jest.spyOn(patientRepository, 'delete').mockResolvedValue(undefined);

        const result = await patientService.remove(patientId);

        expect(patientRepository.delete).toHaveBeenCalledWith(patientId);
        expect(result).toBeUndefined();
      });
    });

    describe('when error', () => {
      it('when delete a user that doesnt exist', async () => {
        const patientId = patientMock.patientId;
        jest.spyOn(patientRepository, 'findOne').mockReturnValue(undefined);

        try {
          await patientService.remove(patientId);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toStrictEqual(
            'Patient you are trying to delete does not exist',
          );
          expect(error.status).toStrictEqual(400);
        }
      });

      it('when internal error unexpected by the application ', async () => {
        const patientId = patientMock.patientId;
        jest.spyOn(patientRepository, 'findOne').mockRejectedValue(new Error());

        try {
          await patientService.remove(patientId);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.message).toStrictEqual(
            'Internal server expection error trying delete patient',
          );
          expect(error.status).toStrictEqual(500);
        }
      });
    });
  });
});
