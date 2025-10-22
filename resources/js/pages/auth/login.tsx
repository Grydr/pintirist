import EyeIcon from '@/components/eye-icon';
import PinterestIcon from '@/components/pinterest-icon';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleToggle = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Head title="Log in" />

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="relative w-[484px] max-h-[90vh] overflow-auto rounded-[32px] bg-white shadow-xl backdrop-blur-[5px] backdrop-filter">
                    <div className="flex w-full min-h-[400px] flex-col items-center">
                        <div className="box-border content-stretch flex w-full flex-col items-center gap-[6px] px-[10px] pb-[24px] pt-[28px]">
                            {/* Pinterest Icon */}
                            <div className="content-stretch relative flex size-[45px] shrink-0 flex-col items-start">
                                <PinterestIcon />
                            </div>

                            {/* Heading */}
                            <div className="content-stretch relative flex w-[300px] shrink-0 flex-col items-start">
                                <div className="relative w-full shrink-0">
                                    <div className="flex size-full flex-col items-center">
                                        <div className="box-border content-stretch flex w-full flex-col items-center px-[16px] py-0">
                                            <div className="flex w-full flex-col justify-center font-['Helvetica',_sans-serif] text-[32px] font-bold not-italic leading-[normal] text-[#333333] tracking-[-1.2px] text-center">
                                                <p className="leading-[normal]">
                                                    Welcome back!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="box-border content-stretch flex w-full shrink-0 flex-col items-center px-0 pb-0 pt-[16px]"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="relative w-[268px]">
                                            {/* Email Field */}
                                            <div className="mb-6">
                                                <label className="mb-1 flex flex-col justify-center font-['Helvetica',_sans-serif] text-[14px] not-italic leading-[0] text-black">
                                                    <p className="whitespace-pre leading-[19.6px]">
                                                        Email
                                                    </p>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        placeholder="Email"
                                                        required
                                                        autoFocus
                                                        autoComplete="email"
                                                        className="w-full min-h-[48px] rounded-[16px] border-2 border-[#91918c] bg-white px-[15.8px] py-[14.4px] font-['Helvetica',_sans-serif] text-[16px] text-black placeholder:text-[#767676] outline-none focus:border-[#0095f6]"
                                                    />
                                                </div>
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Password Field */}
                                            <div className="mb-6">
                                                <label className="mb-1 flex flex-col justify-center font-['Helvetica',_sans-serif] text-[14px] not-italic leading-[0] text-black">
                                                    <p className="whitespace-pre leading-[19.6px]">
                                                        Password
                                                    </p>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        placeholder="Password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        autoComplete="current-password"
                                                        className="w-full min-h-[48px] rounded-[16px] border-2 border-[#91918c] bg-white px-[15.8px] py-[14.4px] pr-[48px] font-['Helvetica',_sans-serif] text-[16px] text-black placeholder:text-[#767676] outline-none focus:border-[#0095f6]"
                                                    />
                                                    <span
                                                        className="absolute right-[12px] top-1/2 -translate-y-1/2 flex cursor-pointer items-center justify-center rounded-[8px] p-1 hover:bg-gray-100"
                                                        onClick={handleToggle}
                                                    >
                                                        <EyeIcon isVisible={showPassword} />
                                                    </span>
                                                </div>
                                                {errors.password && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.password}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full min-h-[40px] cursor-pointer rounded-[12px] border-0 bg-[#e60023] px-[11.6px] py-[7.4px] transition-colors hover:bg-[#d0001d] disabled:opacity-50"
                                            >
                                                <div className="content-stretch flex items-center justify-center">
                                                    <div className="flex flex-col justify-center font-['Helvetica',_sans-serif] text-center text-[14px] font-medium not-italic leading-[0] text-white">
                                                        <p className="whitespace-pre leading-[19.6px]">
                                                            {processing
                                                                ? 'Loading...'
                                                                : 'Log In'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </Form>

                            {/* Switch Mode Link */}
                            <div className="content-stretch relative mt-6 flex w-full max-w-[464px] shrink-0 items-center justify-center">
                                <Link
                                    href={register()}
                                    className="box-border content-stretch flex shrink-0 cursor-pointer items-start justify-center border-0 bg-transparent py-0 pl-[4px] pr-0 hover:underline"
                                >
                                    <div className="flex flex-col justify-center font-['Helvetica',_sans-serif] text-[12px] font-bold not-italic leading-[0] text-black">
                                        <p className="whitespace-pre leading-[18px]">
                                            Not on Pintirist yet? Sign Up
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
