import { request } from '@/components/http/request'

export function registerUser(username: string, password: string) {
  return request<{ id: number; username: string }>('/auth/register', {
    method: 'POST',
    key: 'account_created',
    body: JSON.stringify({ username, password }),
  })
}
