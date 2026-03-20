export default function Questions({
  questions,
  currentQ,
  answer,
}) {
  const q = questions[currentQ];

  return (
    <div>
      <h2>{q.label}</h2>

      {q.options.map((opt) => (
        <button key={opt} onClick={() => answer(q.id, opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}