// Layout.tsx
import { SideWrapper } from 'apps/seller-ui/src/shared/components/Sidebar/sidebar.style';
import SidebarWrapper from 'apps/seller-ui/src/shared/components/Sidebar/SidebarWrapper';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
<div className="flex h-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
  {/* {sidebar} */}
  <SideWrapper>
    <SidebarWrapper />
  </SideWrapper>
  {/* {maincontent} */}
  <main className="flex-1 ml-[280px]">
<div className="overflow-y-auto min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {children}
    </div>
  </main>
</div>
  );
};

export default Layout;