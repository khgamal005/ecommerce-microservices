// components/SidebarWrapper.tsx
'use client';

import { SidebarWrapper } from './sidebar.style';

interface SidebarWrapperProps {
  children: React.ReactNode;
}

const SidebarWrapperComponent: React.FC<SidebarWrapperProps> = ({ children }) => {
  return (
    <SidebarWrapper>
      {children}
    </SidebarWrapper>
  );
};

export default SidebarWrapperComponent;