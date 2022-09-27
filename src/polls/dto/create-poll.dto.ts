export class CreatePollDto {
    title: string;
    sections: CreatePollSectionDto[];
}

class CreatePollSectionDto {
    title: string;
    questions: CreatePollQuestionDto[];
}

class CreatePollQuestionDto {
    text: string;
}
