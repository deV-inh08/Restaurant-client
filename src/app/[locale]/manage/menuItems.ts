import { Roles } from '@/constants/type'
import { Home, LineChart, ShoppingCart, Users2, Salad, Table } from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    Icon: Home,
    href: '/manage/dashboard',
    roles: [Roles.Owner, Roles.Employee]
  },
  {
    title: 'Đơn hàng',
    Icon: ShoppingCart,
    href: '/manage/orders',
    roles: [Roles.Owner, Roles.Employee]

  },
  {
    title: 'Bàn ăn',
    Icon: Table,
    href: '/manage/tables',
    roles: [Roles.Owner, Roles.Employee]
  },
  {
    title: 'Món ăn',
    Icon: Salad,
    href: '/manage/dishes',
    roles: [Roles.Owner, Roles.Employee]
  },

  {
    title: 'Phân tích',
    Icon: LineChart,
    href: '/manage/analytics',
    roles: [Roles.Owner, Roles.Employee]
  },
  {
    title: 'Nhân viên',
    Icon: Users2,
    href: '/manage/accounts',
    roles: [Roles.Owner]
  }
]

export default menuItems
