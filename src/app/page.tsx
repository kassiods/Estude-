import { redirect } from 'next/navigation';

export default function RootPage() {
  // In a real app, you would check authentication status here.
  // For this scaffold, we redirect directly to the dashboard.
  redirect('/dashboard');
  return null; 
}
