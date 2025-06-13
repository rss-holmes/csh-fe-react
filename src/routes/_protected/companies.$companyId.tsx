import { createFileRoute } from '@tanstack/react-router'
import ViewCompany from '@/components/companies/ViewCompany'

export const Route = createFileRoute('/_protected/companies/$companyId')({
  component: ViewCompanyPage,
})

function ViewCompanyPage() {
  return <ViewCompany />
}