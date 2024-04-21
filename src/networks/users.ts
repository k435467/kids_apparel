import useSWR from 'swr'
import qs from 'query-string'
import { IGetMemberUsersResponse } from '@/app/api/member/users/route'
import { fetcher } from '@/networks/network'
import { IPagination } from '@/hooks/usePagination'

export const useUsers = (pagination: IPagination) =>
  useSWR<IGetMemberUsersResponse>(`/api/member/users?${qs.stringify(pagination)}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })
