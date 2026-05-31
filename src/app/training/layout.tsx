import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RIO Training Dashboard — Rinse It Off',
  description: 'Internal training portal for Rinse It Off team members. 8 modules covering equipment, sales, objection handling, and pricing.',
  robots: { index: false, follow: false },
};

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
