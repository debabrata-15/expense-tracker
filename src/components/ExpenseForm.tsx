import { useState, type ChangeEvent, type FormEvent } from 'react';
import { CATS, type CategoryId, type Expense } from '../data';
import { card, field, labelCls } from '../ui';

export type NewExpense = Omit<Expense, 'id'>; // an Expense without the id

interface FormState {
  desc: string;
  amount: string;
  cat: CategoryId;
  date: string;
}

interface Props {
  onAdd: (expense: NewExpense) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ onAdd }: Props) {
  const [form, setForm] = useState<FormState>({ desc: '', amount: '', cat: 'food', date: today() });

  const setField =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.desc.trim() || !(amount > 0) || !form.date) return;
    onAdd({ desc: form.desc.trim(), amount, cat: form.cat, date: form.date });
    setForm((f) => ({ ...f, desc: '', amount: '' }));
  };

  return (
    <section className={`${card} p-[18px]`}>
      <h2 className="mb-3.5 text-base font-semibold">Add expense</h2>
      <form className="grid gap-2.5" onSubmit={handleSubmit}>
        <label className={labelCls}>
          Description
          <input className={field} value={form.desc} onChange={setField('desc')} placeholder="Coffee, rent, bus fare…" required />
        </label>
        <label className={labelCls}>
          Amount
          <input className={field} type="number" step="0.01" min="0.01" value={form.amount} onChange={setField('amount')} required />
        </label>
        <label className={labelCls}>
          Category
          <select className={field} value={form.cat} onChange={setField('cat')}>
            {CATS.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          Date
          <input className={field} type="date" value={form.date} onChange={setField('date')} required />
        </label>
        <button type="submit" className="cursor-pointer rounded-lg bg-accent px-3.5 py-2.5 font-semibold text-accent-ink">
          Add expense
        </button>
      </form>
    </section>
  );
}