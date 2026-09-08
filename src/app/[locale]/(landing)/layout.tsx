import { ReactNode } from 'react';

import '@/config/style/falcon2.css';

import { FalconFooter, FalconHeader } from '@/shared/blocks/falcon2/site';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="gen-shell">
      <FalconHeader />
      {children}
      <FalconFooter />
    </div>
  );
}
