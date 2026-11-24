interface Props {
  label: string;
  onShift: (n: number) => void;
}

export default function MonthNav({ label, onShift }: Props) {
  const btn = 'size-9 cursor-pointer rounded-lg border border-line bg-surface';
  return (
    <div className="flex items-center gap-1.5">
      <button className={btn} onClick={() => onShift(-1)} aria-label="Previous month">‹</button>
      <span className="min-w-[130px] text-center font-semibold">{label}</span>
      <button className={btn} onClick={() => onShift(1)} aria-label="Next month">›</button>
    </div>
  );
}