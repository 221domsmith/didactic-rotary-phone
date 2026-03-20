export default function Results({ score, leakage, recs }) {
  return (
    <div>
      <h2>Score: {score}</h2>
      <p>Leakage: ${leakage}</p>

      {recs.map((r, i) => (
        <div key={i}>{r.text}</div>
      ))}
    </div>
  );
}