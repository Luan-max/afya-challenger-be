import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/notes.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,

    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    try {
      const appointmentExists = await this.appointmentRepository.findOne({
        where: {
          id: createNoteDto.appointmentId,
        },
      });

      if (!appointmentExists) {
        throw new BadRequestException(
          'Cannot create a note for an appointment that does not exist',
        );
      }

      const create = await this.notesRepository.save({
        appointmentId: createNoteDto.appointmentId,
        date: createNoteDto.date,
        note: createNoteDto.notes,
      });

      return create;
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new BadRequestException({
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
        });

      throw new InternalServerErrorException({
        message: 'Internal server expection error trying create note',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
