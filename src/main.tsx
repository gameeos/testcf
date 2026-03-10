import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { ThemeProvider } from "@/components/theme-provider";
import { Web3Provider } from "@/lib/web3-provider";
import { RPCProvider } from "@/lib/rpc-client";
import "@/lib/web3-modal";
import "@/i18n";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RPCProvider url="https://test-ooapi.orbit.show">
      <Web3Provider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </Web3Provider>
    </RPCProvider>
  </StrictMode>
);
