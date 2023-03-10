import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update.patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      const { email } = createPatientDto;

      const patientAlreadyExists = await this.patientRepository.findOne({
        where: {
          email,
        },
      });

      if (patientAlreadyExists) {
        throw new BadRequestException('Patient already exists');
      }

      const patient = await this.patientRepository.save(createPatientDto);

      return patient;
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new BadRequestException({
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
        });

      throw new InternalServerErrorException({
        message: 'Internal server expection error trying create patient',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAll(name: string): Promise<Patient[]> {
    try {
      const patients = await this.patientRepository.find({
        where: { name },
      });

      return patients;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server expection error trying list patients',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<void> {
    try {
      const patientExists = await this.patientRepository.findOne({
        where: {
          id,
        },
      });

      if (!patientExists) {
        throw new BadRequestException(
          'Patient you are trying to update does not exist',
        );
      }

      await this.patientRepository.update(id, updatePatientDto);

      return;
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new BadRequestException({
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
        });

      throw new InternalServerErrorException({
        message: 'Internal server expection error trying update patient',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const patientExists = await this.patientRepository.findOne({
        where: {
          id,
        },
      });

      if (!patientExists) {
        throw new BadRequestException(
          'Patient you are trying to delete does not exist',
        );
      }

      await this.patientRepository.delete(id);

      return;
    } catch (error) {
      if (error.message === 'Patient you are trying to delete does not exist')
        throw new BadRequestException({
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
        });

      throw new InternalServerErrorException({
        message: 'Internal server expection error trying delete patient',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
