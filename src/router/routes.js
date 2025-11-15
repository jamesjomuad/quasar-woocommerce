const routes = [
  {
    path: '/',
    component: () => import('src/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/dashboard', // 👈 redirects immediately
      },

      // Dashboard
      {
        path: 'dashboard',
        component: () => import('pages/Dashboard/IndexPage.vue'),
        name: 'Dashboard',
        meta: { requiresAuth: true },
      },

      // Products
      {
        path: 'products',
        component: () => import('pages/Products/IndexPage.vue'),
        name: 'Products',
        meta: { requiresAuth: true },
      },
      {
        path: 'products/create',
        component: () => import('pages/Products/CreatePage.vue'),
        name: 'CreateProduct',
        meta: { requiresAuth: true },
      },
      {
        path: 'products/:id',
        component: () => import('pages/Products/UpdatePage.vue'),
        name: 'UpdateProduct',
        meta: { requiresAuth: true },
      },

      // Subscriptions
      {
        path: 'subscriptions',
        component: () => import('pages/Subscriptions/IndexPage.vue'),
        name: 'Subscriptions',
        meta: { requiresAuth: true },
      },
      {
        path: 'subscriptions/create',
        component: () => import('pages/Subscriptions/CreatePage.vue'),
        name: 'CreateSubscription',
        meta: { requiresAuth: true },
      },

      // Payments
      {
        path: 'payments',
        component: () => import('pages/Payments/IndexPage.vue'),
        name: 'Payments',
        meta: { requiresAuth: true },
      },
      {
        path: 'payments/create',
        component: () => import('pages/Payments/CreatePage.vue'),
        name: 'CreatePayment',
        meta: { requiresAuth: true },
      },

      // Customers
      {
        path: 'customers',
        component: () => import('pages/Customers/IndexPage.vue'),
        name: 'Customers',
        meta: { requiresAuth: true },
      },
      {
        path: 'themes',
        component: () => import('pages/Themes/IndexPage.vue'),
        name: 'Themes',
        meta: { requiresAuth: true },
      },

      // Cart
      {
        path: 'cart',
        component: () => import('pages/Cart/IndexPage.vue'),
        name: 'Themes',
        meta: { requiresAuth: true },
      },

      // Not found
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
