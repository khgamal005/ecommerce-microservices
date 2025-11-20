import { SidebarWrapper } from 'apps/seller-ui/src/shared/component/sidebar.style';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full min-h-screen ">
      {/* {sidebar} */}
      <aside className=" w-[280px] min-w-[250px] max-w-[300px] border-r border-r-slate bg-white">
        <div className=" sticky top-0">
          <SidebarWrapper />
        </div>
      </aside>
      {/* {maincontent} */}
      <main className="flex-1 bg-yellow-300">
        <div className="overflow-y-auto">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
