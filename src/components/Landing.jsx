import { BUSINESS_TYPES } from "../data/questions";

export default function Landing({ selectBiz }) {
  return (
    <div>
      <h1>Find out how much you're leaving behind</h1>

      {BUSINESS_TYPES.map((bt) => (
        <button key={bt.id} onClick={() => selectBiz(bt.id)}>
          {bt.icon} {bt.label}
        </button>
      ))}
    </div>
  );
}