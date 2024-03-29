import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { QuizService } from 'src/app/services/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  questionsCount: number = 1;
  quiz: any;
  selectedAnswer = false;
  isCorrect = false;
  correctAnswer: string = '';

  constructor(
    private apiSvc: ApiService,
    public quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit() {
    this.questionsCount = this.quizService.returnQuizCount();
    console.log('今の問題数' + this.questionsCount);
    // クイズデータを取得する
    this.quiz = this.quizService.getCurrentQuiz();
  }

  public clickAnswer(choice: any) {
    if (this.selectedAnswer) {
      // console.log('既に選択済みの選択肢があります。');
      return;
    }

    console.log('選択肢が選択されました', choice);
    this.selectedAnswer = true;
    this.isCorrect = choice.is_correct;
    this.correctAnswer = this.getCorrectAnswer();
    this.quizService.quizCorrectCountInit();
    if (this.isCorrect) {
      this.quizService.countCorrectAnswer();
      const typeId: number = this.quiz.type.data.id;
      this.quizService.quizTypeCount(typeId);
    }
  }

  public getCorrectAnswer(): string {
    const correctAnswer = this.quiz.choices.find(
      (choice: any) => choice.is_correct
    );
    return correctAnswer?.text;
  }
  public nextPage() {
    this.quizService.incrementQuizCount();
    this.selectedAnswer = false;
    if (this.quizService.hasNextQuiz()) {
      this.ngOnInit();
    } else {
      this.router.navigateByUrl('/quiz-result');
    }
  }
}
