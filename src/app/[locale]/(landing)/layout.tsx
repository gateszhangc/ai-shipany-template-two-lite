import '@/config/style/galaxy.css';

import { ReactNode } from 'react';

import {
  GalaxyFooter,
  GalaxyHeader,
  GalaxyQueueOverlay,
} from '@/shared/blocks/galaxy/site';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="gx-shell">
      <GalaxyHeader />
      <main className="gx-main">{children}</main>
      <GalaxyFooter />
      <GalaxyQueueOverlay />
    </div>
  );
}
