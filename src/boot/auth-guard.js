// src/boot/auth-guard.js
import { useAuthStore } from 'src/stores/authStore'

export default ({ router }) => {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    // 🔹 If already logged in, prevent going to login page
    if (authStore.isLoggedIn && to.path === '/login') {
      return { path: '/dashboard' }
    }

    // 🔹 If route requires auth and user is not logged in
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
      return { path: '/login' }
    }

    return true
  })
}
