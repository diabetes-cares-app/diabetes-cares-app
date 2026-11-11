import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '../components/AppShell'
import { CareProvider } from '../lib/store'

export const Route = createFileRoute('/app')({
  head: () => ({ meta: [{ title: 'Today · SteadySugar' }] }),
  component: () => (
    <CareProvider>
      <AppShell />
    </CareProvider>
  ),
})