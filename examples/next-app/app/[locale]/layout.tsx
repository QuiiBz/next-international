import { ReactElement } from 'react';
import './globals.css';
import { Switch } from './switch';
import Link from 'next/link';

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: ReactElement }) {
  return (
    <html lang="en">
      <body>
        <Switch />
        <ul>
          <li>
            <Link href="/">Go to / (SSR/SSG + RSC)</Link>
          </li>
          <li>
            <Link href="/subpage">Go to /subpage (SSR/SSG + RSC)</Link>
          </li>
          <li>
            <Link href="/ssr">Go to /ssr (SSR + CSR)</Link>
          </li>
          <li>
            <Link href="/client">Go to /client (CSR)</Link>
          </li>
        </ul>
        {children}
      </body>
    </html>
  );
}
