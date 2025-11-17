import type { Quiz } from "~/types/scheme";

export const useQuiz = () => {
  let timer: any = null;

  const state = reactive({
    started: false,
    finished: false,
    questions: [] as Quiz[],
    currentIndex: 0,
    score: 0,
    timeLeft: 60 * 60, // 60 menit dalam detik
    selectedIndex: null as number | null,
    isCorrect: null as boolean | null,
    canAnswer: false,
  });

  const startQuiz = (questions: Quiz[]) => {
    state.started = true;
    state.questions = questions;
    state.currentIndex = 0;
    state.score = 0;
    state.finished = false;
    state.timeLeft = 60 * 60;
    state.selectedIndex = null;
    state.isCorrect = null;
    state.canAnswer = true;
  };

  const pickAnswer = (choiceIndex: number) => {
    if (!state.started || state.finished) return;

    if (state.canAnswer === false) return;

    state.canAnswer = false;
    state.selectedIndex = choiceIndex;

    const currentQuestion = state.questions[state.currentIndex];

    if (choiceIndex === currentQuestion?.answer) {
      state.isCorrect = true;
      state.score += 1;
    } else {
      state.isCorrect = false;
    }
  };

  const nextQuestion = () => {
    if (state.currentIndex + 1 == state.questions.length) {
      state.finished = true;
      return;
    }

    state.currentIndex++;
    state.selectedIndex = null;
    state.isCorrect = null;
    state.canAnswer = true;
  };

  const startTimer = () => {
    if (timer) clearInterval(timer);

    timer = setInterval(() => {
      if (state.timeLeft > 0) {
        state.timeLeft--;
      } else {
        state.finished = true;
        clearInterval(timer);
      }
    }, 1000);
  };

  const getScorePercentage = () => {
    if (state.questions.length === 0) return 0;
    return Math.round((state.score / state.questions.length) * 100);
  };

  return {
    state,
    startQuiz,
    pickAnswer,
    nextQuestion,
    startTimer,
    getScorePercentage,
  };
};
