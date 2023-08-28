import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as _ from 'lodash';
import * as qs from 'qs';

// 出題する問題数
const QUIZ_LENGTH = 20;
const type = [
  '保護猫について',
  '猫の基礎知識',
  '豆知識',
  '猫と人間の関係性',
  '保護猫の福祉とケア',
];

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  // 出題するクイズを格納
  quizzes: any;
  // 現在出題している問題数
  currentQuizCount = 1;
  correctCount: number = 0;

  constructor(private apiSvc: ApiService) {}

  // クイズがスタートした時に呼び出したい
  public getQuizzes() {
    this.currentQuizCount = 1;

    // 出題する問題を取得する(20問)

    const query = {
      pagination: {
        pageSize: 200,
      },
      filters: {
        category: {
          category: {
            $eq: '保護猫について',
          },
        },
      },
      populate: '*',
    };
    this.apiSvc.getQuizzes(query).subscribe(
      (quizzes) => {
        // this.quizzes = quizzes.data;
        this.quizzes = this.randomSelectQuizzes(quizzes.data);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  // 各type4問ずつランダムに抜き出す
  public randomSelectQuizzes(quizzes: any) {
    let incrementRandomRange: number = 0;
    let typeCounts: any = {};

    let shuffledQuizzes = _.shuffle(quizzes);
    const _quizzes: any = [];
    shuffledQuizzes.forEach((quiz) => {
      const typeId = quiz.attributes.type.data.id;
      if (typeCounts[typeId] < 4 || !typeCounts[typeId]) {
        typeCounts[typeId] = typeCounts[typeId] ? typeCounts[typeId] + 1 : 1;
        _quizzes.push(quiz);
      }
    });
    console.log(_quizzes);
    return _quizzes;

    // 保護猫についての問題を４問randomに取得する
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < 4; i++) {
        let num =
          Math.floor(
            Math.random() *
              (16 + incrementRandomRange + 1 - (7 + incrementRandomRange))
          ) +
          (7 + incrementRandomRange);
      }
      incrementRandomRange += 10;
    }

    // 出題する問題1問を取得(返却)する
  }
  public getCurrentQuiz() {
    return this.quizzes[this.currentQuizCount - 1].attributes;
  }

  public returnQuizCount() {
    return this.currentQuizCount;
  }

  public incrementQuizCount() {
    return this.currentQuizCount++;
  }

  public calcRemainingQuizCount(): number {
    return this.quizzes.length - this.currentQuizCount;
  }

  public hasNextQuiz(): boolean {
    return this.currentQuizCount - 1 < this.quizzes.length;
  }

  public countCorrectAnswer() {
    this.correctCount++;
    return;
  }
  public quizCorrectCountInit() {
    if (this.currentQuizCount == 1) {
      this.correctCount = 0;
    }
  }
}
