import { fileBlob, request, upload } from '@/components/http/request'

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

export function logoutUser() {
  return request<{ ok: boolean }>('/auth/logout', {
    method: 'POST',
    key: 'logout',
  })
}

export function listPublicDocuments() {
  return request<{ id: number; filename: string; category: string; summary: string; username: string }[]>('/documents/public')
}

export function listDocuments() {
  return request<{ id: number; filename: string; is_public: boolean; category: string; summary: string; created_at: string; updated_at: string }[]>(
    '/documents/files',
  )
}

export function documentFile(id: number) {
  return fileBlob(`/documents/files/${id}`)
}

export function updateDocument(id: number, category: string, isPublic: boolean, summary: string) {
  return request<{ id: number; filename: string; is_public: boolean; category: string }>(`/documents/files/${id}`, {
    method: 'PATCH',
    key: 'edit',
    body: JSON.stringify({ category, is_public: isPublic, summary }),
  })
}

export function uploadDocument(file: File, category: string, isPublic: boolean, summary: string, onProgress: (loaded: number, total: number) => void) {
  const body = new FormData()
  body.append('file', file)
  body.append('category', category)
  body.append('is_public', isPublic ? 'true' : 'false')
  body.append('summary', summary)
  return upload<{ id: number; filename: string; is_public: boolean; category: string }>('/documents/upload', body, onProgress, 'upload')
}
