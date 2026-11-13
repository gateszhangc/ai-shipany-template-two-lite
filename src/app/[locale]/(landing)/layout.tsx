import '@/config/style/swarm.css';

import { ReactNode } from 'react';

import {
  SwarmFooter,
  SwarmHeader,
  SwarmQueueOverlay,
} from '@/shared/blocks/swarm/site';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="sw-shell">
      <SwarmHeader />
      <main className="sw-main">{children}</main>
      <SwarmFooter />
      <SwarmQueueOverlay />
    </div>
  );
}
