import PinterestSideNav from "@/components/pinterest-side-nav";
import { ReactNode } from "react";

interface PinterestLayoutProps {
    active: string;
    children: ReactNode;
}

export default function PinterestLayout({ active, children }: PinterestLayoutProps) {
    return (
        <div className="flex min-h-screen bg-white">
            <PinterestSideNav active={active} />
            <main className="flex-1 ml-[72px]">{children}</main>
        </div>
    );
}
