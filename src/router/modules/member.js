/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const memberRouter = {
  path: '/member',
  component: Layout,
  redirect: '/member/groups',
  name: 'Member',
  meta: {
    title: 'Member',
    icon: 'peoples'
  },
  children: [
    {
      path: 'customer',
      component: () => import('@/views/member/customer'),
      name: 'CustomerTable',
      meta: { title: 'Customer' }
    },
    {
      path: 'addcustomer',
      component: () => import('@/views/member/addcustomer'),
      name: 'AddCustomer',
      meta: { title: 'AddCustomer' },
      hidden: true
    },
    {
      path: 'editcustomer',
      component: () => import('@/views/member/addcustomer'),
      name: 'EditCustomer',
      meta: { title: 'EditCustomer' },
      hidden: true
    },
    {
      path: 'appointment',
      component: () => import('@/views/member/appointment'),
      name: 'AppointmentTable',
      meta: { title: 'Appointment' }
    }
  ]
}
export default memberRouter
