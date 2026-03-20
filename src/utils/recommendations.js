export const getRecs = (answers, bType) => {
  const recs = [];

  if (answers.pricing?.includes("flat")) {
    recs.push({
      text: "Switch to dynamic pricing",
      event: false,
    });
  }

  return recs;
};