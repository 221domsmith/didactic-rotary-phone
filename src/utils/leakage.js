export const getLeakage = (answers, bType) => {
  const rateMap = {
    str: { "Under $75": 65 },
  };

  const rate = rateMap[bType]?.[answers.rate] || 150;

  return rate * 100; // simplified (keep your full logic here)
};