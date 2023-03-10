import { CreateNoteDto } from './dto/notes.dto';
import { Note } from './entities/note.entity';
export class NoteMock {
  public expectedNote: Note = {
    date: new Date(),
    note: 'Lorem ipsum dolor sit amet',
    appointmentId: '1',
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  public mockCreateNoteDto: CreateNoteDto = {
    date: new Date(),
    notes: 'Lorem ipsum dolor sit amet',
    appointmentId: '1',
  };

  public mockNotes = [
    {
      date: new Date(),
      note: 'Lorem ipsum dolor sit amet',
      appointmentId: '1',
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}
