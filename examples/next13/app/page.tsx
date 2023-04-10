import { redirect } from 'next/navigation';

export default function Root() {
  // TODO use a middleware maybe?
  redirect('/en');
}
