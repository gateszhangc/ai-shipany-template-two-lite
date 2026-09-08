import { ReactNode } from 'react';

import '@/config/style/genjutsu.css';

import {
  GenjutsuFooter,
  GenjutsuHeader,
} from '@/shared/blocks/genjutsu/site-chrome';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="gen-shell">
      <GenjutsuHeader />
      {children}
      <GenjutsuFooter />
    </div>
  );
}
