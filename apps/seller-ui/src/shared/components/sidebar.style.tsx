// sidebar.style.tsx
'use client';

import styled from 'styled-components';
import Link from 'next/link';

// SidebarWrapper Styles
export const SidebarWrapper = styled.div`
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  padding: 1.5rem 1rem;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  border-right: 1px solid #334155;
  
  /* Scrollbar Styling */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1e293b;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #475569;
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }
`;

// SidebarMenu Styles
export const SidebarMenuContainer = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const SidebarMenuTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04rem;
  color: #94a3b8;
  margin-bottom: 0.75rem;
  padding-left: 0.25rem;
`;

// SidebarItem Styles
export const SidebarItemLink = styled(Link)<{ $isActive: boolean }>`
  display: block;
  margin: 0.5rem 0;
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateX(0.5rem);
  }
`;

export const SidebarItemContainer = styled.div<{ $isActive: boolean }>`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  min-height: 3rem;
  align-items: center;
  padding: 0 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  /* Base styles */
  background: ${props => props.$isActive ? '#374151' : 'transparent'};
  transform: ${props => props.$isActive ? 'scale(1.05)' : 'scale(1)'};
  
  /* Hover styles */
  &:hover {
    background: ${props => props.$isActive ? '#f3cccc' : '#1e293b'};
  }
`;

export const SidebarItemIcon = styled.span<{ $isActive: boolean }>`
  font-size: 1.125rem;
  color: ${props => props.$isActive ? '#60a5fa' : '#cbd5e1'};
  width: 1.25rem;
  display: flex;
  justify-content: center;
`;

export const SidebarItemTitle = styled.h5<{ $isActive: boolean }>`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.$isActive ? '#e2e8f0' : '#cbd5e1'};
  margin: 0;
  flex: 1;
  
  ${SidebarItemContainer}:hover & {
    color: ${props => props.$isActive ? '#1e293b' : '#f1f5f9'};
  }
`;

// Additional wrapper for the entire sidebar layout
export const SidebarLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const SidebarContent = styled.div`
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  background-color: #f8fafc;
`;