/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http"
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { toast } from 'sonner'
import jwt from 'jsonwebtoken'
import authApiRequest from "@/apiRequests/auth"
import { DishStatus, OrderStatus, Roles, TableStatus } from "@/constants/type"
import envConfig from "@/config"
import { RoleType, TokenPayload } from "@/types/jwt.type"
import guestApiRequest from "@/apiRequests/guest"
import { format } from 'date-fns'
import { BookX, CookingPot, HandCoins, Loader, Truck } from 'lucide-react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// remove symbol '/' of path
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
  error,
  setError,
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast(error?.payload?.message ?? 'Lỗi không xác định')
  }
}

// check in client
const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('accessToken') : null
}

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('refreshToken') : null
}

export const removeTokensFromLS = () => {
  if (isBrowser) {
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')
  }
}


export const setAccessTokenFromLocalStorage = (value: string) => {
  return isBrowser ? localStorage.setItem('accessToken', value) : null
}

export const setRefreshTokenFromLocalStorage = (value: string) => {
  return isBrowser ? localStorage.setItem('refreshToken', value) : null
}

export const checkAndRefreshToken = async (params: {
  onError?: () => void
  onSuccess?: () => void
  force?: boolean
}) => {

  // get accessToken & refreshToken moi nhat
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  // khong co accessToken & refreshToken => return
  if (!accessToken || !refreshToken) return

  const decodedAccessToken = jwt.decode(accessToken) as {
    exp: number, // time het han
    iat: number,
  }
  const decodeRefreshToken = jwt.decode(refreshToken) as {
    exp: number, // time het han
    iat: number,
    role: RoleType
  }

  // time now (thoi gian hien tai)
  // const now = Math.round(new Date().getTime() / 1000) khong lam tron 
  // khi set cookie thuong se bi lech (200ms ~ 1000ms)
  const now = (new Date().getTime() / 1000) - 1

  // refreshToken het han thi khong refresh-token(accessToken) nua

  // 20/5 <= 19/5(round) = 20/5 
  if (decodeRefreshToken.exp <= now) {
    console.log('Refresh token expires')
    removeTokensFromLS()

    return params.onError && params.onError()
  }


  /**
   * thoi gian ton tai cua token: token.exp - token.iat
   * thoi gian con lai: token.exp - now
   */
  if (params.force || (decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3)
  ) {
    // Gọi API refresh token
    try {
      const role = decodeRefreshToken.role
      const res = role === Roles.Guest ? await guestApiRequest.refreshToken() : await authApiRequest.refreshToken()
      setAccessTokenFromLocalStorage(res.payload.data.accessToken)
      setRefreshTokenFromLocalStorage(res.payload.data.refreshToken)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (params.onError) {
        params.onError()
      }
    }
  }
}

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseOrdersStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  switch (status) {
    case OrderStatus.Delivered:
      return 'Đã giao'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang nấu'
    default:
      return 'Từ chối'
  }
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
}

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss dd/MM/yyyy')
}

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}