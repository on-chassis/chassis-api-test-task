import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class CreatePollDto {
    @IsNotEmpty()
    title: string;

    @IsArray()
    sections: CreatePollSectionDto[];
}

class CreatePollSectionDto {
    title: string;
    questions: CreatePollQuestionDto[];
}

class CreatePollQuestionDto {
    text: string;
}
