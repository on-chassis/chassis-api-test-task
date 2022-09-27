export class CreatePollDto {
    sections: CreatePollSectionDto[];
}

class CreatePollSectionDto {
    title: string;
    questions: CreatePollQuestionDto[];
}

class CreatePollQuestionDto {
    text: string;
}
