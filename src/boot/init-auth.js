import { useAuthStore } from 'src/stores/auth'

export default async () => {
  const auth = useAuthStore()
  await auth.initAuth()
}
