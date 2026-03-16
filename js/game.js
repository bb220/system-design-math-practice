const Game = (() => {
  let questions = [];
  let currentIndex = 0;
  let results = []; // { question, result: 'correct'|'incorrect'|'skipped', userAnswer }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startGame() {
    questions = shuffle(QUESTIONS);
    currentIndex = 0;
    results = [];
  }

  function getCurrentQuestion() {
    return questions[currentIndex] || null;
  }

  function getProgress() {
    return { current: currentIndex + 1, total: questions.length };
  }

  function submitAnswer(userInput) {
    const question = questions[currentIndex];
    const validation = validateAnswer(userInput, question);

    if (!validation.valid) {
      return { error: validation.error };
    }

    const entry = {
      question,
      userAnswer: parseFloat(userInput),
      result: validation.correct ? "correct" : "incorrect",
      hint: validation.hint || null
    };
    results.push(entry);
    return entry;
  }

  function skipQuestion() {
    results.push({
      question: questions[currentIndex],
      userAnswer: null,
      result: "skipped",
      hint: null
    });
  }

  function advance() {
    currentIndex++;
    return currentIndex < questions.length;
  }

  function getResults() {
    const answered = results.filter(r => r.result !== "skipped");
    const correct = results.filter(r => r.result === "correct");
    const skipped = results.filter(r => r.result === "skipped");

    // Per-topic breakdown
    const topicMap = {};
    for (const r of results) {
      const t = r.question.topic;
      if (!topicMap[t]) topicMap[t] = { correct: 0, total: 0, skipped: 0 };
      if (r.result === "skipped") {
        topicMap[t].skipped++;
      } else {
        topicMap[t].total++;
        if (r.result === "correct") topicMap[t].correct++;
      }
    }

    return {
      total: results.length,
      answered: answered.length,
      correct: correct.length,
      skipped: skipped.length,
      accuracy: answered.length > 0 ? Math.round((correct.length / answered.length) * 100) : 0,
      topics: topicMap
    };
  }

  return { startGame, getCurrentQuestion, getProgress, submitAnswer, skipQuestion, advance, getResults };
})();
