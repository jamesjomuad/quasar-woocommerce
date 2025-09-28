// src/boot/auth-guard.js
import { useAuthStore } from 'src/stores/auth'

export default ({ router }) => {
  router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()

    // Try to restore user if token exists but no user loaded
    if (auth.token && !auth.user) {
      try {
        await auth.fetchUser()
      } catch (error) {
        console.error('Failed to fetch user:', error)
        auth.logout()
      }
    }

    // If route needs auth but no user, redirect to login
    if (to.meta.requiresAuth && !auth.user) {
      next({ path: '/login' })
    } else {
      next()
    }
  })
}
