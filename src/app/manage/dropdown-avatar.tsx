'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useLogoutMutation } from '@/queries/useAuth'
import { toast } from 'sonner'
import { useAccountMe } from '@/queries/useAccount'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'


export default function DropdownAvatar() {
  const { setRole } = useAuth()
  const router = useRouter()
  const useLogout = useLogoutMutation()
  const onClick = async () => {
    const res = await useLogout.mutateAsync()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    if (res.payload) {
      toast.success(res.payload.message)
      setRole(undefined)
      router.push('/login')
    }
  }
  // get me
  const { data } = useAccountMe()
  const account = data?.payload.data
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
          <Avatar>
            <AvatarImage src={account?.avatar ?? undefined} alt={account?.name} />
            <AvatarFallback>{account?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={'/manage/setting'} className='cursor-pointer'>
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onClick()}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
