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
import { setUserLocale } from '@/i18n/services/locale'
import { useLocale, useTranslations } from 'next-intl'

export function SwitchLanguages() {
    const t = useTranslations('SwitchLanguage')
    const locale = useLocale()
    return (
        <Select
            defaultValue={locale}
            onValueChange={(value) => {
                console.log(value)
                setUserLocale(value as Locale)
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