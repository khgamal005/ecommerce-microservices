// SidebarWrapper.tsx
'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';
import Box from '../Box';
import Link from 'next/link';
import EasyShopLogo from '../../../assets/svgs/EasyShopLogo';
import SidebarHeader from './SidebarHeader';
import SidebarBody from './SidebarBody';
import SidebarItem from './SidebarItem';
import {
  BellPlus,
  BellRing,
  Calendar,
  Headset,
  HomeIcon,
  ListOrdered,
  LogOut,
  Mail,
  PartyPopper,
  SearchCheck,
  Settings,
  SquareMousePointer,
  TicketPercent,
} from 'lucide-react';
import SidebarMenu from './SidebarMenu';
import { useSidebar } from 'apps/seller-ui/src/app/hook/useSidebar';
import useSeller from 'apps/seller-ui/src/app/hook/useSeller';

const SidebarWrapper = () => {
  const { activeItem, setActive } = useSidebar();
  const pathname = usePathname();
  const { seller, isLoading, error, logout, isLoggingOut, refetch } =useSeller();

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const getIconColor = (route: string) => {
    return route === activeItem ? '#0085ff' : '#94a3b8';
  };

  return (
    <Box
      css={{
        width: '100%',
        padding: '8px',
        minHeight: '100vh',
        position: 'relative',
        background: 'transparent',
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}
      className="sidebar-wrapper"
    >
      <SidebarHeader>
<Box>
  <Link href="/" className="flex flex-col justify-center items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg">
    <EasyShopLogo />
    <Box className="text-center">
      <h3 className="text-lg font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">
        {seller?.shop?.name}
      </h3>
      <h5 className="text-xs text-slate-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px] mt-1">
        {seller?.shop?.address}
      </h5>
    </Box>
  </Link>
</Box>
      </SidebarHeader>
      <div className="block h-full my-6">
        <SidebarBody>
          <SidebarItem
            title="Dashboard"
            icon={<HomeIcon size={20} color={getIconColor('/dashboard')} />}
            isActive={activeItem === '/dashboard'}
            href="/dashboard"
          />
          <div className="mt-4 block space-y-1">
            <SidebarMenu title="Orders">
              <SidebarItem
                title="Orders"
                icon={<ListOrdered size={20} color={getIconColor('/dashboard/orders')} />}
                isActive={activeItem === '/dashboard/orders'}
                href="/dashboard/orders"
              />
              <SidebarItem
                title="Payments"
                icon={<PartyPopper size={20} color={getIconColor('/dashboard/Payments')} />}
                isActive={activeItem === '/dashboard/Payments'}
                href="/dashboard/Payments"
              />
            </SidebarMenu>
            <SidebarMenu title="Products">
              <SidebarItem
                title="Create Product"
                icon={<SquareMousePointer size={20} color={getIconColor('/dashboard/create-product')} />}
                isActive={activeItem === '/dashboard/create-product'}
                href="/dashboard/create-product"
              />
              <SidebarItem
                title="All Products"
                icon={<SearchCheck size={20} color={getIconColor('/dashboard/all-products')} />}
                isActive={activeItem === '/dashboard/all-products'}
                href="/dashboard/all-products"
              />
            </SidebarMenu>
            <SidebarMenu title="Events">
              <SidebarItem
                title="Events"
                icon={<Calendar size={20} color={getIconColor('/dashboard/events')} />}
                isActive={activeItem === '/dashboard/events'}
                href="/dashboard/events"
              />
              <SidebarItem
                title="All Events"
                icon={<BellPlus size={20} color={getIconColor('/dashboard/all-events')} />}
                isActive={activeItem === '/dashboard/all-events'}
                href="/dashboard/all-events"
              />
            </SidebarMenu>
            <SidebarMenu title="Controllers">
              <SidebarItem
                title="Inbox"
                icon={<Mail size={20} color={getIconColor('/dashboard/inbox')} />}
                isActive={activeItem === '/dashboard/inbox'}
                href="/dashboard/inbox"
              />
              <SidebarItem
                title="Settings"
                icon={<Settings size={20} color={getIconColor('/dashboard/settings')} />}
                isActive={activeItem === '/dashboard/settings'}
                href="/dashboard/settings"
              />
              <SidebarItem
                title="Notifications"
                icon={<BellRing size={20} color={getIconColor('/dashboard/notifications')} />}
                isActive={activeItem === '/dashboard/notifications'}
                href="/dashboard/notifications"
              />
            </SidebarMenu>
            <SidebarMenu title="Extras">
              <SidebarItem
                title="Discount Codes"
                icon={<TicketPercent size={20} color={getIconColor('/dashboard/discount-codes')} />}
                isActive={activeItem === '/dashboard/discount-codes'}
                href="/dashboard/discount-codes"
              />
              <SidebarItem
                title="Support"
                icon={<Headset size={20} color={getIconColor('/dashboard/support')} />}
                isActive={activeItem === '/dashboard/support'}
                href="/dashboard/support"
              />
              <SidebarItem
                title="Logout"
                icon={<LogOut size={20} color={getIconColor('/logout')} />}
                isActive={activeItem === '/logout'}
                href="/logout"
              />
            </SidebarMenu>
          </div>
        </SidebarBody>
      </div>
    </Box>
  );
};

export default SidebarWrapper;