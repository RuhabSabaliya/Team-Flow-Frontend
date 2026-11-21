import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';
import { WorkspaceProvider } from '@/context/WorkspaceContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'TeamFlow — Kanban Board & Issue Tracking',
  description: 'Fast, high-density project management and issue tracking for engineering teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <html lang="en" suppressHydrationWarning>
    <body className="bg-light-canvas dark:bg-dark-canvas text-light-on-surface dark:text-dark-on-surface font-body antialiased selection:bg-accent/20">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange={false}
      >
        <AuthProvider>
          <WorkspaceProvider>
            {children}
          </WorkspaceProvider>
        </AuthProvider>
      </ThemeProvider>
    </body>
  </html>
  );
}
