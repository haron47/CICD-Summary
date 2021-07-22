import { IsNumber, IsString } from 'class-validator';

export class CreateMovieDTO {
  @IsString()
  readonly title: string;
  @IsNumber()
  readonly year: number;
  @IsString({ each: true })
  readonly genre: string[];
}
