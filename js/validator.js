function validateAnswer(userInput, question) {
  const parsed = parseFloat(userInput);

  if (isNaN(parsed) || parsed <= 0) {
    return { valid: false, error: "Please enter a positive number." };
  }

  const [low, high] = question.acceptableRange;

  if (parsed >= low && parsed <= high) {
    return { valid: true, correct: true };
  }

  return {
    valid: true,
    correct: false,
    hint: parsed < low ? "too_low" : "too_high"
  };
}
