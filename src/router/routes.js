const routes = [
  {
    path: '/',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard',
        component: () => import('pages/Dashboard/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
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
      {
        path: 'payments',
        component: () => import('pages/Payments/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
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
