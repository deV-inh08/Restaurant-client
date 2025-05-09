import useAuth from "@/hooks/useAuth"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
export const useListenLogoutSocket = ({

}) => {
    const pathName = usePathname()
    const router = useRouter()

    const { socket, setSocket } = useAuth()
    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathName)) return
        function onLogout() {

        }
    }, [pathName])
}
