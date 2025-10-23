import Masonry from '@/components/Masonry';
import PinCard from '@/components/PinCard';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type Pin = {
    id: number;
    title: string;
    description: string | null;
    image_url: string;
    created_at: string;
};

type DashboardProps = {
    pins: Pin[];
};

export default function Dashboard({ pins }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {pins.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                    <svg
                        className="w-32 h-32 text-gray-300 mb-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        No pins yet
                    </h2>
                    <p className="text-gray-600 text-lg mb-8">
                        Create your first pin to get started
                    </p>
                    <Link
                        href="/pins/create"
                        className="bg-red-600 text-white px-8 py-3 rounded-full font-medium hover:bg-red-700 transition"
                    >
                        Create pin
                    </Link>
                </div>
            ) : (
                <Masonry
                    columns='columns-2 md:columns-3 lg:columns-4'
                    gap='gap-4'
                    padding='p-4'
                    ySpace='space-y-4'>
                    {pins.map((pin) => (
                        <Link 
                            href={`/pin/${pin.id}`} 
                            key={pin.id}
                            className="block cursor-pointer transform transition-transform duration-200 hover:scale-105"
                        >
                            <PinCard src={pin.image_url} />
                        </Link>
                    ))}
                </Masonry>
            )}
        </AppLayout>
    );
}
