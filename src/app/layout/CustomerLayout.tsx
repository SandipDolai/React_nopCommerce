// src/app/layout/CustomerLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../../features/profile/SideBar';


export default function CustomerLayout() {
    return (
        <div className="master-column-wrapper" style={{ display: "flex" }}>
            <Sidebar />
            <div className="center-2" style={{ flex: 1 }}>
                <Outlet />
            </div>
        </div>
    );
}
