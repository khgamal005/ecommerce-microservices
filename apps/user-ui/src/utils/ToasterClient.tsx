// components/ToasterClient.tsx
"use client";

import { Toaster } from "react-hot-toast";

export function ToasterClient() {
  return <Toaster       position="bottom-right"
      reverseOrder={false}
      toastOptions={{ duration: 3000 }} />;
}
