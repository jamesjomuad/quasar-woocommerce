import { useAuthStore } from 'src/stores/authStore'

export default async () => {
  const auth = useAuthStore()
  await auth.initAuth()
}
