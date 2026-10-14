import '@/config/style/udioai.css';

import { ReactNode } from 'react';

import {
  UdioFooter,
  UdioHeader,
  UdioQueueOverlay,
} from '@/shared/blocks/udioai/site';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ua-shell">
      <UdioHeader />
      <main className="ua-main">{children}</main>
      <UdioFooter />
      <UdioQueueOverlay />
    </div>
  );
}
