// components/SidebarItem.tsx
'use client';

import Link from 'next/link';
import { useSidebar } from '../../../app/hook/useSidebar';
import {
  SidebarItemLink,
  SidebarItemContainer,
  SidebarItemIcon,
  SidebarItemTitle
} from './sidebar.style';

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, title, href, isActive }) => {
  const { activeItem, setActive } = useSidebar();

  const handleClick = () => {
    setActive(href);
  };

  return (
    <SidebarItemLink 
      href={href} 
      $isActive={isActive}
      onClick={handleClick}
    >
      <SidebarItemContainer $isActive={isActive}>
        <SidebarItemIcon $isActive={isActive}>
          {icon}
        </SidebarItemIcon>
        <SidebarItemTitle $isActive={isActive}>
          {title}
        </SidebarItemTitle>
      </SidebarItemContainer>
    </SidebarItemLink>
  );
};

export default SidebarItem;