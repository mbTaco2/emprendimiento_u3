import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-cover bg-center pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900 bg-fondo">
            <div className="flex justify-center w-full">
                <Link href="/">
                    <ApplicationLogo className="h-32 w-32 sm:h-48 sm:w-48 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white bg-opacity-75 px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
}
