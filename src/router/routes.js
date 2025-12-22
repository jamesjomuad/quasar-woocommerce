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
        meta: {
          requiresAuth: true,
          breadcrumb: [{ label: 'Products', icon: 'shopping_cart' }],
        },
      },
      {
        path: 'products/create',
        component: () => import('pages/Products/CreatePage.vue'),
        name: 'CreateProduct',
        meta: {
          requiresAuth: true,
          breadcrumb: [
            { label: 'Products', icon: 'shopping_cart', to: '/products' },
            { label: 'Create', icon: 'mode_edit' },
          ],
        },
      },
      {
        path: 'products/:id',
        component: () => import('pages/Products/UpdatePage.vue'),
        name: 'UpdateProduct',
        meta: {
          requiresAuth: true,
          breadcrumb: [
            { label: 'Products', icon: 'shopping_cart', to: '/products' },
            { label: 'Update', icon: 'mode_edit' },
          ],
        },
      },

      // Subscriptions
      {
        path: 'subscriptions',
        component: () => import('pages/Subscriptions/IndexPage.vue'),
        name: 'Subscriptions',
        meta: {
          requiresAuth: true,
          breadcrumb: [{ label: 'Subscriptions', icon: 'rss_feed', to: '/subscriptions' }],
        },
      },
      {
        path: 'subscriptions/create',
        component: () => import('pages/Subscriptions/CreatePage.vue'),
        name: 'CreateSubscription',
        meta: {
          requiresAuth: true,
          breadcrumb: [
            { label: 'Subscriptions', icon: 'rss_feed', to: '/subscriptions' },
            { label: 'Create', icon: 'mode_edit' },
          ],
        },
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

      // Media
      {
        path: 'media',
        component: () => import('pages/Media/IndexPage.vue'),
        name: 'Media',
        meta: { requiresAuth: true },
      },

      // Cart
      {
        path: 'cart',
        component: () => import('pages/Cart/IndexPage.vue'),
        name: 'Cart',
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
