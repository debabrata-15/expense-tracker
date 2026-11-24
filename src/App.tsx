import { useEffect, useMemo, useState } from 'react';
import { loadState, saveState, seedExpenses, ymOf, type Expense } from './data';
import MonthNav from './components/MonthNav';
import Summary from './components/Summary';
import ExpenseForm, { type NewExpense } from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

export default function App() {
  const saved = useMemo(loadState, []);
  const [expenses, setExpenses] = useState<Expense[]>(saved?.expenses ?? seedExpenses());
  const [budget, setBudget] = useState<number>(saved?.budget ?? 500);
  const [sym, setSym] = useState<string>(saved?.sym ?? '$');
  const [month, setMonth] = useState<string>(ymOf(new Date()));

  useEffect(() => saveState({ expenses, budget, sym }), [expenses, budget, sym]);

  const money = (n: number) =>
    sym + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  const monthItems = useMemo(
    () =>
      expenses
        .filter((e) => e.date.slice(0, 7) === month)
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id)),
    [expenses, month]
  );

  const [y, m] = month.split('-').map(Number);
  const monthLabel = new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const shift = (n: number) => setMonth(ymOf(new Date(y, m - 1 + n, 1)));

  const addExpense = (data: NewExpense) => {
    setExpenses((list) => [...list, { id: Date.now(), ...data }]);
    setMonth(data.date.slice(0, 7)); // jump to the month of the new expense
  };

  const removeExpense = (id: number) => setExpenses((list) => list.filter((x) => x.id !== id));

  return (
    <div className="mx-auto max-w-[1040px] px-[18px] pt-6 pb-12">
      <div className="mb-[22px] flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold tracking-tight">Expense tracker</h1>
        <MonthNav label={monthLabel} onShift={shift} />
      </div>

      <Summary
        items={monthItems}
        budget={budget}
        sym={sym}
        money={money}
        onBudgetChange={setBudget}
        onSymChange={setSym}
      />

      <div className="mt-4 grid gap-4 md:grid-cols-[300px_1fr]">
        <ExpenseForm onAdd={addExpense} />
        <ExpenseList key={month} items={monthItems} money={money} onDelete={removeExpense} />
      </div>
    </div>
  );
}