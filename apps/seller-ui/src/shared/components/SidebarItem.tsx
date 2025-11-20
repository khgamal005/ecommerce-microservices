// components/SidebarItem.tsx
'use client';

import { useSidebar } from '../../app/hook/useSidebar';
import {
  SidebarItemLink,
  SidebarItemContainer,
  SidebarItemIcon,
  SidebarItemTitle
} from './sidebar.style';

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  itemId: string;
  href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, title, itemId, href }) => {
  const { activeItem, setActive } = useSidebar();
  const isActive = activeItem === itemId;

  const handleClick = () => {
    setActive(itemId);
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