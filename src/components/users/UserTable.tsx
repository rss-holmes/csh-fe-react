import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  User as UserIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import * as customerApi from '@/api/customer'
import type { Customer } from '@/api/customer'
import { CreateUserSidebar } from './CreateUserSidebar'
import { EditUserSidebar } from './EditUserSidebar'
import { BulkUploadDialog } from '../common/BulkUploadDialog'
import { formatDateTime } from '@/utils/dateFormatter'

export function UserTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [createSidebarOpen, setCreateSidebarOpen] = useState(false)
  const [editSidebarOpen, setEditSidebarOpen] = useState(false)
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null)

  const queryClient = useQueryClient()

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: queryKeys.customers.all,
    queryFn: customerApi.getCustomers,
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => customerApi.deleteCustomer(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
      toast.success('User deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete user')
    },
  })

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium text-left justify-start"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const user = row.original
          return (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <button
                  onClick={() => {
                    // TODO: Navigate to user detail view
                    console.log('View user:', user.id)
                  }}
                  className="font-medium text-primary hover:underline text-left"
                >
                  {user.name}
                </button>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'company.name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium text-left justify-start"
          >
            Company
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const company = row.original.company
          return company ? (
            <span className="text-sm">{company.name}</span>
          ) : (
            <span className="text-sm text-muted-foreground">No company</span>
          )
        },
      },
      {
        accessorKey: 'addedVia',
        header: 'Added Via',
        cell: ({ row }) => {
          const addedVia = row.original.addedVia || 'manual'
          return (
            <Badge variant="secondary" className="text-xs">
              {addedVia}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'segments',
        header: 'Segments',
        cell: ({ row }) => {
          const segments = row.original.segments
          return segments ? (
            <Badge variant="outline" className="text-xs">
              {segments}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )
        },
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
        cell: ({ row }) => {
          const designation = row.original.designation
          return designation ? (
            <span className="text-sm">{designation}</span>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )
        },
      },
      {
        accessorKey: 'country',
        header: 'Country',
        cell: ({ row }) => {
          const country = row.original.country
          return country ? (
            <span className="text-sm">{country}</span>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )
        },
      },
      {
        accessorKey: 'browser',
        header: 'Browser',
        cell: ({ row }) => {
          const browser = row.original.browser
          return browser ? (
            <span className="text-sm">{browser}</span>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )
        },
      },
      {
        accessorKey: 'os',
        header: 'OS',
        cell: ({ row }) => {
          const os = row.original.os
          return os ? (
            <span className="text-sm">{os}</span>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )
        },
      },
      {
        accessorKey: 'device',
        header: 'Device',
        cell: ({ row }) => {
          const device = row.original.device
          return device ? (
            <span className="text-sm">{device}</span>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium text-left justify-start"
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const user = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    // TODO: Navigate to user detail view
                    console.log('View user:', user.id)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(user)
                    setEditSidebarOpen(true)
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteUserMutation.mutate(user.id)}
                  disabled={deleteUserMutation.isPending}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [deleteUserMutation]
  )

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  })

  const handleCreateUser = () => {
    setCreateSidebarOpen(true)
  }

  const handleBulkUpload = () => {
    setBulkUploadOpen(true)
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600">Failed to load users</p>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage your customer database and user information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkUpload}
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button size="sm" onClick={handleCreateUser}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <UserIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No users found</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCreateUser}
                        className="mt-2"
                      >
                        Add your first user
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {table.getPageCount() > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center text-sm text-muted-foreground">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center text-sm">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Sidebar Forms */}
      <CreateUserSidebar
        isOpen={createSidebarOpen}
        onClose={() => setCreateSidebarOpen(false)}
      />

      {selectedUser && (
        <EditUserSidebar
          isOpen={editSidebarOpen}
          onClose={() => {
            setEditSidebarOpen(false)
            setSelectedUser(null)
          }}
          user={selectedUser}
        />
      )}

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        isOpen={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        uploadType="customers"
        title="Bulk Upload Users"
        description="Upload a CSV file with user data to create multiple users at once."
      />
    </div>
  )
}