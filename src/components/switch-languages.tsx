'use client'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Locale, useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { locales } from "@/config"
import { Suspense } from "react"

export const SwitchLanguages = () => {
    return (
        <Suspense>
            <SwitchLanguageMain />
        </Suspense>
    )
}


const SwitchLanguageMain = () => {
    const t = useTranslations('SwitchLanguage')
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    return (
        <Select value={locale} onValueChange={(value) => {
            router.replace(pathname, {
                locale: value as Locale
            })
            router.refresh()
        }}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('title')} />
            </SelectTrigger>
            <SelectContent>
                {locales.map((local) => (
                    <SelectItem key={local} value={local}>{t(local)}</SelectItem>
                ))}
            </SelectContent>
        </Select>

    )
}
