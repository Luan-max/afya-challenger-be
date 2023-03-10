import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Note } from './entities/note.entity';
import { NoteMock } from './notes.mocks';
import { NotesService } from './notes.service';
import { AppoitmentMocks } from '../appointments/appointments.mocks';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('NotesService', () => {
  let notesService: NotesService;
  let noteRepository: Repository<Note>;
  let appointmentRepository: Repository<Appointment>;
  let objectNoteMock: NoteMock;
  let objectAppointmentMock: AppoitmentMocks;

  beforeEach(async () => {
    objectNoteMock = new NoteMock();
    objectAppointmentMock = new AppoitmentMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useClass: jest.fn(() => ({
            save: jest.fn(),
            find: jest.fn(),
          })),
        },
        {
          provide: 'AppointmentRepository',
          useClass: jest.fn(() => ({
            findOne: jest.fn(),
          })),
        },
      ],
    }).compile();

    notesService = module.get<NotesService>(NotesService);
    noteRepository = module.get<Repository<Note>>(getRepositoryToken(Note));
    appointmentRepository = module.get<Repository<Appointment>>(
      getRepositoryToken(Appointment),
    );
  });

  describe('create', () => {
    let expectedNote;
    let mockCreateNoteDto;
    let appointment;

    describe('when no error', () => {
      it('should create a note for appointment', async () => {
        expectedNote = objectNoteMock.expectedNote;
        mockCreateNoteDto = objectNoteMock.mockCreateNoteDto;
        appointment = objectAppointmentMock.appointment;

        appointmentRepository.findOne = jest
          .fn()
          .mockResolvedValue(appointment);
        noteRepository.save = jest.fn().mockResolvedValue(expectedNote);

        const result = await notesService.create(mockCreateNoteDto);

        expect(noteRepository.save).toHaveBeenCalledWith({
          appointmentId: mockCreateNoteDto.appointmentId,
          date: mockCreateNoteDto.date,
          note: mockCreateNoteDto.notes,
        });
        expect(result).toEqual(expectedNote);
      });
    });

    describe('when error', () => {
      it('when you try to create a note for an appointment that doesnt exist', async () => {
        mockCreateNoteDto = objectNoteMock.mockCreateNoteDto;
        appointment = objectAppointmentMock.appointment;

        appointmentRepository.findOne = jest.fn().mockResolvedValue(undefined);

        try {
          await notesService.create(mockCreateNoteDto);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toStrictEqual(
            'Cannot create a note for an appointment that does not exist',
          );
          expect(error.status).toStrictEqual(400);
        }
      });
      it('when internal error unexpected by the application ', async () => {
        mockCreateNoteDto = objectNoteMock.mockCreateNoteDto;
        appointment = objectAppointmentMock.appointment;

        appointmentRepository.findOne = jest
          .fn()
          .mockResolvedValue(appointment);

        noteRepository.save = jest.fn().mockRejectedValue(new Error());

        try {
          await notesService.create(mockCreateNoteDto);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.message).toStrictEqual(
            'Internal server expection error trying create note',
          );
          expect(error.status).toStrictEqual(500);
        }
      });
    });
  });

  describe('findAll', () => {
    it('when no error', async () => {
      const notes = objectNoteMock.mockNotes;
      const params = {
        appointmentId: '1',
      };
      noteRepository.find = jest.fn().mockResolvedValue(notes);

      const result = await notesService.findAll(params.appointmentId);
      expect(result).toEqual(notes);
    });

    it('when internal error unexpected by the application ', async () => {
      const params = {
        appointmentId: '1',
      };
      noteRepository.find = jest.fn().mockRejectedValue(new Error());

      try {
        await notesService.findAll(params.appointmentId);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toStrictEqual(
          'Internal server expection error trying list notes',
        );
        expect(error.status).toStrictEqual(500);
      }
    });
  });
});
