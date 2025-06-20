import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

interface SideLayoutProps {
    children?: ReactNode;
}

export default function SideLayout({ children }: SideLayoutProps) {
    return (
        <div className="master-column-wrapper">
            <SideNav />
            <div className="center-2">
                {children ?? <Outlet />}
            </div>
        </div>
    );
}
