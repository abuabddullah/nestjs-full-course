import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class NoteService {
  private logger = new Logger(NoteService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async create(createNoteDto: CreateNoteDto, userId: number) {
    const note = await this.prismaService.note.create({
      data: {
        title: createNoteDto.title,
        body: createNoteDto.body,
        userId,
      },
    });
    this.logger.log(`New note has been created: ${note.id}`);

    return note;
  }

  async findAll(
    { skip, take }: { skip: number; take: number },
    userId: number,
  ) {
    const notes = await this.prismaService.note.findMany({
      skip,
      take,
      where: {
        userId,
      },
    });

    return notes;
  }

  async findOne(id: number, userId: number) {
    const note = await this.prismaService.note.findFirst({ where: { id } });

    if (!note) {
      throw new NotFoundException('Not found.');
    }

    if (note?.userId !== userId) {
      throw new ForbiddenException('Not allowed!');
    }

    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    const note = await this.prismaService.note.findFirst({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException('Not found.');
    }

    if (note?.userId !== userId) {
      throw new ForbiddenException('Not allowed!');
    }

    const updated = await this.prismaService.note.update({
      where: {
        id,
      },
      data: updateNoteDto,
    });

    return updated;
  }

  async remove(id: number, userId: number) {
    try {
      return await this.prismaService.note.delete({ where: { id, userId } });
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new ForbiddenException();
        }
      }

      throw err;
    }
  }
}
