import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to Pintirist">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50 p-6 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    {/* Logo Pintirist */}
                    <div className="mb-12 flex justify-center">
                        <h1 className="text-6xl font-bold text-red-600 dark:text-red-500">
                            Pintirist
                        </h1>
                    </div>

                    {/* Tagline */}
                    <p className="mb-12 text-xl text-gray-600 dark:text-gray-400">
                        Discover and save creative ideas
                    </p>

                    {/* Action Buttons */}
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="inline-block rounded-full bg-red-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-red-700 hover:shadow-xl dark:bg-red-500 dark:hover:bg-red-600"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <Link
                                href={login()}
                                className="inline-block w-full rounded-full bg-red-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-red-700 hover:shadow-xl sm:w-auto dark:bg-red-500 dark:hover:bg-red-600"
                            >
                                Log in
                            </Link>
                            <Link
                                href={register()}
                                className="inline-block w-full rounded-full border-2 border-red-600 bg-white px-8 py-3 text-base font-semibold text-red-600 shadow-lg transition-all hover:bg-red-50 hover:shadow-xl sm:w-auto dark:border-red-500 dark:bg-gray-800 dark:text-red-500 dark:hover:bg-gray-700"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
