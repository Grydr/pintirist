import Masonry from '@/components/Masonry';
import PinCard from '@/components/PinCard';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const seedPins = [
    "https://picsum.photos/400/600",
    "https://picsum.photos/600/600",
    "https://picsum.photos/400/600",
    "https://picsum.photos/600/600",
    "https://picsum.photos/400/600",
    "https://picsum.photos/600/600",
    "https://picsum.photos/400/600",
    "https://picsum.photos/600/600",
    "https://picsum.photos/600/600",
    "https://picsum.photos/400/600",
    "https://picsum.photos/600/400",
    "https://picsum.photos/400/600",
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Masonry
                columns='columns-2 md:columns-3 lg:columns-4'
                gap='gap-4'
                padding='p-4'
                ySpace='space-y-4'>
                {seedPins.map((pin, i) => (
                    <PinCard src={pin} key={i}/>
                ))}
            </Masonry>
        </AppLayout>
    );
}
