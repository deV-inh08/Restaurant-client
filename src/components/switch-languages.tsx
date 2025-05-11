'use client'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { locales, Locale } from "@/i18n/config"
import { setUserLocale } from "@/services/locale"
import { useLocale, useTranslations } from "next-intl"

export const SwitchLanguages = () => {
    const t = useTranslations('SwitchLanguage')
    const locale = useLocale()
    return (
        <Select defaultValue={locale} onValueChange={(value) => {
            setUserLocale(value as Locale)
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
