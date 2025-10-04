const routes = [
  {
    path: '/',
    component: () => import('src/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/dashboard' // 👈 redirects immediately
      },

      // Dashboard
      {
        path: 'dashboard',
        component: () => import('pages/Dashboard/IndexPage.vue'),
        meta: { requiresAuth: true },
      },

      // Products
      {
        path: 'products',
        component: () => import('pages/Products/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'products/create',
        component: () => import('pages/Products/CreatePage.vue'),
        meta: { requiresAuth: true },
      },

      // Subscriptions
      {
        path: 'subscriptions',
        component: () => import('pages/Subscriptions/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'subscriptions/create',
        component: () => import('pages/Subscriptions/CreatePage.vue'),
        meta: { requiresAuth: true },
      },

      // Payments
      {
        path: 'payments',
        component: () => import('pages/Payments/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'payments/create',
        component: () => import('pages/Payments/CreatePage.vue'),
        meta: { requiresAuth: true },
      },

      // Customers
      {
        path: 'customers',
        component: () => import('pages/Customers/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'themes',
        component: () => import('pages/Themes/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: ':catchAll(.*)*',
        component: () => import('src/pages/Errors/NotFound.vue'),
      },
    ],
  },

  {
    path: '/',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('pages/Auth/LoginPage.vue'),
      },
      {
        path: 'register',
        component: () => import('pages/Auth/RegisterPage.vue'),
      },
    ],
  },
]

export default routes
