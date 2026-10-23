import { request } from '@/components/http/request'

export function registerUser(username: string, password: string) {
  return request<{ id: number; username: string }>('/auth/register', {
    method: 'POST',
    key: 'account_created',
    body: JSON.stringify({ username, password }),
  })
}

export function loginUser(username: string, password: string) {
  return request<{ access_token: string; token_type: string }>('/auth/login', {
    method: 'POST',
    key: 'login',
    body: JSON.stringify({ username, password }),
  })
}
