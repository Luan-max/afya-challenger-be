import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateNoteDto } from './dto/notes.dto';
import { Note } from './entities/note.entity';
import { NotesService } from './notes.service';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ summary: 'Create a new notes' })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'medical consultation notes created successfully..',
    type: Note,
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot create a note for an appointment that does not exist',
    type: BadRequestException,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server expection error trying create note',
    type: InternalServerErrorException,
  })
  @ApiBody({ type: CreateNoteDto })
  async create(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return await this.notesService.create(createNoteDto);
  }
}
