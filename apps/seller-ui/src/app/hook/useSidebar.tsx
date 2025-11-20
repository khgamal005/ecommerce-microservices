// hooks/useSidebar.ts
'use client'
import { useAtom } from 'jotai';
import { atom } from 'jotai';

// Store atoms
const activeSidebarItemAtom = atom<string>('dashboard');
const isSidebarOpenAtom = atom<boolean>(false);

export const useSidebar = () => {
  const [activeItem, setActiveItem] = useAtom(activeSidebarItemAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);

  const setActive = (itemId: string) => {
    setActiveItem(itemId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return {
    activeItem,
    setActive,
    isSidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
  };
};