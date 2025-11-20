'use client';

import { useEffect } from 'react';
import useSeller from '../../app/hook/useSeller';
import { useSidebar } from '../../app/hook/useSidebar';
import { usePathname } from 'next/navigation';
import Box from './Box';

const SidebarWrapper = () => {
  const { activeItem, setActive } = useSidebar();
  const pathname = usePathname();
  const seller = useSeller();

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const getIconColor = (route: string) => {
    return route === activeItem ? '#0085ff' : '#969696';
  };

  return (
    <Box css={{ width: "100%", padding: "1rem" }}>
      {/* sidebar children go here */}
    </Box>
  );
};

export default SidebarWrapper;
