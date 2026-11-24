export type CategoryId = 'food' | 'transport' | 'home' | 'fun' | 'health' | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  color: string;
}

export interface Expense {
  id: number;
  desc: string;
  amount: number;
  cat: CategoryId;
  date: string; // YYYY-MM-DD
}

export interface SavedState {
  expenses: Expense[];
  budget: number;
  sym: string;
}

export const CATS: Category[] = [
  { id: 'food', name: 'Food', color: 'var(--c1)' },
  { id: 'transport', name: 'Transport', color: 'var(--c2)' },
  { id: 'home', name: 'Home', color: 'var(--c3)' },
  { id: 'fun', name: 'Fun', color: 'var(--c4)' },
  { id: 'health', name: 'Health', color: 'var(--c5)' },
  { id: 'other', name: 'Other', color: 'var(--c6)' },
];

export const CURRENCIES = ['$', '€', '£', '₹', '¥'];

const KEY = 'expense-tracker-v1';

const pad = (n: number) => String(n).padStart(2, '0');
export const ymOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
export const catOf = (id: CategoryId): Category => CATS.find((c) => c.id === id) ?? CATS[CATS.length - 1];

export function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as SavedState;
  } catch {}
  return null;
}

export function saveState(state: SavedState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

// A few sample expenses dated within the current month.
export function seedExpenses(): Expense[] {
  const now = new Date();
  const ym = ymOf(now);
  const day = (n: number) => `${ym}-${pad(Math.min(n, now.getDate()))}`;
  return [
    { id: 1, desc: 'Groceries', amount: 64.2, cat: 'food', date: day(2) },
    { id: 2, desc: 'Metro card top-up', amount: 20, cat: 'transport', date: day(3) },
    { id: 3, desc: 'Electricity bill', amount: 78, cat: 'home', date: day(5) },
    { id: 4, desc: 'Movie night', amount: 24, cat: 'fun', date: day(8) },
    { id: 5, desc: 'Pharmacy', amount: 18.5, cat: 'health', date: day(11) },
    { id: 6, desc: 'Lunch with friends', amount: 32, cat: 'food', date: day(14) },
  ];
}
