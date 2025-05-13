import dishApiRequest from '@/apiRequests/dish'
import { DishListResType } from '@/schema/dish.schema'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Locale } from 'next-intl';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function Home(props: {
    params: Promise<{ locale: string }>
}) {
    const params = await props.params

    const { locale } = params
    setRequestLocale(locale as Locale)
    const t = await getTranslations('HomePage');
    let dishList: DishListResType['data'] = []
    try {
        const result = await dishApiRequest.list()
        const { data } = result.payload
        dishList = data
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return (
            <div>Something went wrong</div>
        )
    }
    return (
        <div className='w-full space-y-4'>
            <div className='relative'>
                <span className='absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10'></span>
                <Image
                    src='/banner.png'
                    width={400}
                    height={200}
                    quality={100}
                    alt='Banner'
                    className='absolute top-0 left-0 w-full h-full object-cover'
                />
                <div className='z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20'>
                    <h1 className='text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold'>{t('title')}</h1>
                    <p className='text-center text-sm sm:text-base mt-4'>{t('slogan')}</p>
                </div>
            </div>
            <section className='space-y-10 py-16'>
                <h2 className='text-center text-2xl font-bold'>{t('h2')}</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
                    {dishList
                        .map((dish, index) => (
                            <Link href={`/dishes/${dish.id}`} className='flex gap-4 w' key={index}>
                                <div className='flex-shrink-0'>
                                    <Image
                                        src={dish.image}
                                        alt='image'
                                        className='object-cover w-[150px] h-[150px] rounded-md'
                                        width={150}
                                        height={150}
                                        quality={100}
                                    />
                                </div>
                                <div className='space-y-1'>
                                    <h3 className='text-xl font-semibold'>{dish.name}</h3>
                                    <p className=''>{dish.description}</p>
                                    <p className='font-semibold'>{dish.price}đ</p>
                                </div>
                            </Link>
                        ))}
                </div>
            </section>
        </div>
    )
}
