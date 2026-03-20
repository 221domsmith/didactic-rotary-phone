export const scoreAnswer = (questionId, answer) => {
  const low = {
    pricing: ["Same rate year-round"],
  };

  const high = {
    pricing: ["I use a dynamic pricing tool"],
  };

  if (low[questionId]?.includes(answer)) return 1;
  if (high[questionId]?.includes(answer)) return 4;
  return 2;
};