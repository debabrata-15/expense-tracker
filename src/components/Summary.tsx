import { CATS, CURRENCIES, type Expense } from '../data';
import { card, field, labelCls } from '../ui';

interface Props {
  items: Expense[];
  budget: number;
  sym: string;
  money: (n: number) => string;
  onBudgetChange: (n: number) => void;
  onSymChange: (s: string) => void;
}

export default function Summary({ items, budget, sym, money, onBudgetChange, onSymChange }: Props) {
  const total = items.reduce((s, e) => s + e.amount, 0);
  const byCat = CATS.map((cat) => ({
    cat,
    sum: items.filter((e) => e.cat === cat.id).reduce((s, e) => s + e.amount, 0),
  })).filter((x) => x.sum > 0);
  const left = budget - total;
  const denom = Math.max(total, budget) || 1;

  return (
    <section className={`${card} p-[22px]`}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="mb-1.5 text-sm text-muted">Spent this month</div>
          <div className="text-[clamp(2.4rem,8vw,4.2rem)] leading-none font-extrabold tracking-[-0.03em]">{money(total)}</div>
          <div className={`mt-2 text-sm ${left < 0 ? 'font-semibold text-danger' : 'text-muted'}`}>
            {left >= 0 ? `${money(left)} left of your budget` : `${money(-left)} over your budget`}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <label className={labelCls}>
            Monthly budget
            <input
              className={`${field} w-[110px]`}
              type="number"
              min="0"
              value={budget}
              onChange={(e) => onBudgetChange(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </label>
          <label className={labelCls}>
            Currency
            <select className={`${field} w-auto`} value={sym} onChange={(e) => onSymChange(e.target.value)}>
              {CURRENCIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div
        className="mt-[22px] mb-3 flex h-[34px] overflow-hidden rounded-lg bg-line"
        role="img"
        aria-label="Spending by category compared with budget"
      >
        {byCat.map((x) => (
          <div
            key={x.cat.id}
            title={`${x.cat.name}: ${money(x.sum)}`}
            className="h-full transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${(x.sum / denom) * 100}%`, background: x.cat.color }}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-x-[18px] gap-y-1.5 text-sm">
        {byCat.length ? (
          byCat.map((x) => (
            <span key={x.cat.id}>
              <i className="mr-1.5 inline-block size-2.5 rounded-[3px]" style={{ background: x.cat.color }} />
              {x.cat.name} {money(x.sum)}
            </span>
          ))
        ) : (
          <span className="text-muted">No spending recorded for this month yet.</span>
        )}
      </div>
    </section>
  );
}