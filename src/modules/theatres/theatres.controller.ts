import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TheatresService } from './theatres.service';
import { CreateTheatreDto } from './dto/create-theatre.dto';
import { UpdateTheatreDto } from './dto/update-theatre.dto';

@Controller('theatres')
export class TheatresController {
  constructor(private readonly theatresService: TheatresService) {}

  @Post()
  create(@Body() createTheatreDto: CreateTheatreDto) {
    return this.theatresService.create(createTheatreDto);
  }

  @Get()
  findAll() {
    return this.theatresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.theatresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTheatreDto: UpdateTheatreDto) {
    return this.theatresService.update(+id, updateTheatreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.theatresService.remove(+id);
  }
}
