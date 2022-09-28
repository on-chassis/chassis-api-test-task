export class CollectAnswersDto {
    answers: Answer[];
}

class Answer {
    questionId: string;
    text: string;
}