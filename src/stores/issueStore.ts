import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface IssueState {
  searchQuery: string
  page: number
  statusFilters: string[]
  creatorFilters: string[]
}

export interface IssueActions {
  setSearchQuery: (query: string) => void
  setPage: (page: number) => void
  setStatusFilters: (filters: string[]) => void
  setCreatorFilters: (filters: string[]) => void
  resetFilters: () => void
}

export type IssueStore = IssueState & IssueActions

export const useIssueStore = create<IssueStore>()(
  immer((set) => ({
    // State
    searchQuery: '',
    page: 1,
    statusFilters: [],
    creatorFilters: [],

    // Actions
    setSearchQuery: (query: string) => {
      set((state) => {
        state.searchQuery = query
        state.page = 1 // Reset page when searching
      })
    },

    setPage: (page: number) => {
      set((state) => {
        state.page = page
      })
    },

    setStatusFilters: (filters: string[]) => {
      set((state) => {
        state.statusFilters = filters
        state.page = 1 // Reset page when filtering
      })
    },

    setCreatorFilters: (filters: string[]) => {
      set((state) => {
        state.creatorFilters = filters
        state.page = 1 // Reset page when filtering
      })
    },

    resetFilters: () => {
      set((state) => {
        state.searchQuery = ''
        state.page = 1
        state.statusFilters = []
        state.creatorFilters = []
      })
    },
  }))
)