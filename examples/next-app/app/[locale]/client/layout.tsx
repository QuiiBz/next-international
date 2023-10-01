import { ReactNode } from 'react';
import { Provider } from '../provider';

export default function Layout({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>;
}
