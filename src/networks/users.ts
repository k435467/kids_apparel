import useSWR from 'swr'
import qs from 'query-string'
import { IGetMemberUsersCondition, IGetMemberUsersResponse } from '@/app/api/member/users/route'
import { fetcher } from '@/networks/network'

export const useUsers = (condition: IGetMemberUsersCondition) =>
  useSWR<IGetMemberUsersResponse>(`/api/member/users?${qs.stringify(condition)}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })
