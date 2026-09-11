import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
export const DashboardLayout: React.FC = () => { const [sidebarOpen, setSidebarOpen] = useState(false); return <div className="min-h-screen bg-background flex"><Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} /><div className="flex min-w-0 flex-1 flex-col lg:pl-[290px]"><Topbar onMenuClick={() => setSidebarOpen(true)} /><main className="mx-auto w-full max-w-[1600px] flex-1 p-5 md:p-8"><Outlet /></main></div></div>; };
