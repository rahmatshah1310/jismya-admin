import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
//mutatioin for login
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await authService.login(data)
      if (!response) throw new Error('Login failed')
      return response.data
    },
  })
}

