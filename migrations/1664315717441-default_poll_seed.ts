import {MigrationInterface, QueryRunner} from "typeorm";
import { Poll, PollQuestion, PollSection } from '../src/polls/entities/poll.entity'

export class defaultPollSeed1664315717441 implements MigrationInterface {
    name = 'defaultPollSeed1664315717441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const poll = new Poll();
        poll.default = 1;
        poll.public = 1;
        poll.title = 'Default poll (always public)';
        poll.sections = []

        const section1 = new PollSection();
        section1.orderNumber = 0;
        section1.title = 'Company info (section)';
        section1.questions = [];

        const question11 = new PollQuestion();
        question11.orderNumber = 0;
        question11.text = 'What\'s your company name?';
        section1.questions.push(question11);
        const question12 = new PollQuestion();
        question12.orderNumber = 1;
        question12.text = 'How many people in a company?';
        section1.questions.push(question12);
        poll.sections.push(section1);

        const section2 = new PollSection();
        section2.orderNumber = 1;
        section2.title = 'Personal info (section)';
        section2.questions = [];

        const question21 = new PollQuestion();
        question21.orderNumber = 0;
        question21.text = 'What is your name?';
        section2.questions.push(question21);
        const question22 = new PollQuestion();
        question22.orderNumber = 1;
        question22.text = 'How old are you?';
        section2.questions.push(question22);
        poll.sections.push(section2);

        await queryRunner.manager.save<Poll>(poll);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
