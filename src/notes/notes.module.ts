import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Note } from './entities/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Note])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
