import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class CreatePollDto {
    @IsNotEmpty()
    title: string;

    @IsArray()
    sections: CreatePollSectionDto[];
}

class CreatePollSectionDto {
    @IsNotEmpty()
    title: string;

    @IsArray()
    questions: CreatePollQuestionDto[];
}

class CreatePollQuestionDto {
    @IsNotEmpty()
    text: string;
}
