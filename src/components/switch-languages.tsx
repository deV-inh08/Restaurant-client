// 'use client'
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Locale, useLocale, useTranslations } from "next-intl"
// import { useParams, usePathname, useRouter } from "next/navigation"
// import { locales } from "@/config"
// import SearchParamsLoader, { useSearchParamsLoader } from "@/components/search-params-loader"


// export const SwitchLanguages = () => {
//     const t = useTranslations('SwitchLanguage')
//     let getLocale = useLocale()
//     const { searchParams, setSearchParams } = useSearchParamsLoader()
//     const pathname = usePathname()
//     const router = useRouter()
//     const params = useParams()
//     return (
//         <>
//             <SearchParamsLoader onParamsReceived={setSearchParams} />
//             <Select value={getLocale} onValueChange={(value) => {
//                 getLocale = value as ('vi' | 'en')
//                 const locale = params.locale as Locale
//                 const newPathName = pathname.replace(`${locale}`, `${value}`)
//                 const fullUrl = `${newPathName}?${searchParams?.toString()}`
//                 router.replace(fullUrl)
//                 router.refresh()
//             }}>
//                 <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder={t('title')} />
//                 </SelectTrigger>
//                 <SelectContent>
//                     {locales.map((local) => (
//                         <SelectItem key={local} value={local}>{t(local)}</SelectItem>
//                     ))}
//                 </SelectContent>
//             </Select>
//         </>


//     )
// }
'use client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Locale, locales } from '@/config'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'

export function SwitchLanguages() {
    const t = useTranslations('SwitchLanguage')
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    return (
        <Select
            value={locale}
            onValueChange={(value) => {
                router.replace(pathname, {
                    locale: value as Locale
                })
                router.refresh()
            }}
        >
            <SelectTrigger className='w-[140px]'>
                <SelectValue placeholder={t('title')} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {locales.map((locale) => (
                        <SelectItem value={locale} key={locale}>
                            {t(locale)}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}