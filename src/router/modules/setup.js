/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const groupRouter = {
  path: '/setup',
  component: Layout,
  redirect: '/setup/groups',
  name: 'Setup',
  meta: {
    title: 'Setup',
    icon: 'peoples'
  },
  children: [
    {
      path: 'groups',
      component: () => import('@/views/setups/groups'),
      name: 'GroupsTable',
      meta: { title: 'Groups' }
    },
    {
      path: 'users',
      component: () => import('@/views/setups/users'),
      name: 'Users',
      meta: { title: 'Users' }
    },
    {
      path: 'menus',
      component: () => import('@/views/setups/menus'),
      name: 'Menu',
      meta: { title: 'Menu' }
    },
    {
      path: 'roles',
      component: () => import('@/views/setups/roles'),
      name: 'Roles',
      meta: { title: 'Roles' }
    },
    {
      path: 'dynamic-table',
      component: () => import('@/views/table/dynamicTable/index'),
      name: 'setting',
      meta: { title: 'setting' }
    }
  ]
}
export default groupRouter
