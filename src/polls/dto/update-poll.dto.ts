export class UpdatePollDto {
    title?: string;
    sections?: CreatePollSectionDto[];
}
class CreatePollSectionDto {
    title?: string;
    questions?: CreatePollQuestionDto[];
}

class CreatePollQuestionDto {
    text?: string;
}
