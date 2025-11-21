import React from 'react'
import Box from '../Box';

const SidebarBody = ({ children }: { children: React.ReactNode }) => {
   return (
    <Box
      css={{
        width: "100%",
        padding: "12px 0",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "center",
        borderBottom: "1px solid #f1f1f1",
      }}
      className="sidebar-header"
    >
      {children}
    </Box>
  );
}

export default SidebarBody