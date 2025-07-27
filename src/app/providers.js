"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Modal from "react-modal";
import { useEffect, useState } from "react";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
