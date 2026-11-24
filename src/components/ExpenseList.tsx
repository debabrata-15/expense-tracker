import { useState } from 'react';
import { CATS, catOf, type CategoryId, type Expense } from '../data';
import { card } from '../ui';

interface Props {
  items: Expense[];
  money: (n: number) => string;
  onDelete: (id: number) => void;
}

export default function ExpenseList({ items, money, onDelete }: Props) {
  const [filter, setFilter] = useState<CategoryId | 'all'>('all');
  const shown = filter === 'all' ? items : items.filter((e) => e.cat === filter);

  return (
    <section className={`${card} p-[18px]`}>
      <h2 className="mb-3.5 text-base font-semibold">Expenses</h2>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {[{ id: 'all' as const, name: 'All' }, ...CATS].map((c) => (
          <button
            key={c.id}
            className="cursor-pointer rounded-full border border-line px-3 py-1 text-sm aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg"
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {shown.length ? (
        <ul>
          {shown.map((e) => {
            const c = catOf(e.cat);
            const when = new Date(`${e.date}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
            return (
              <li key={e.id} className="grid grid-cols-[10px_1fr_auto_auto] items-center gap-3 border-t border-line py-[11px] first:border-t-0">
                <span className="size-2.5 rounded-full" style={{ background: c.color }} />
                <span>
                  {e.desc}
                  <small className="block text-sm text-muted">{c.name} · {when}</small>
                </span>
                <b className="tabular-nums">{money(e.amount)}</b>
                <button
                  className="cursor-pointer rounded-md px-2 py-1 text-lg text-muted hover:text-danger"
                  aria-label={`Delete ${e.desc}`}
                  onClick={() => onDelete(e.id)}
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="py-[18px] text-muted">Nothing here yet. Add an expense to start tracking this month.</div>
      )}
    </section>
  );
}