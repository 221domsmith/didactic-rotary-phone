export default function Header({ go }) {
  return (
    <div className="flex justify-between w-full max-w-xl pt-8">
      <div onClick={() => go("landing")} className="cursor-pointer">
        Peakrate
      </div>

      <button onClick={() => go("why")}>
        Why Peakrate?
      </button>
    </div>
  );
}