import { createFileRoute } from '@tanstack/react-router'
import CompanyTable from '@/components/companies/CompanyTable'

export const Route = createFileRoute('/_protected/companies')({
  component: CompaniesPage,
})

function CompaniesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Companies</h1>
        <p className="text-muted-foreground">
          Manage companies and their associated users in your workspace
        </p>
      </div>
      <CompanyTable />
    </div>
  )
}