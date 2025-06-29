import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import Navbar from "../containers/Navbar";
import Header from "../containers/Header";
import Footer from "../containers/Footer";
import { Suspense } from "react";
import Loading from "../containers/Loading";

export default function Layout({ children }) {

  return (
    <div >
      <Navbar />

      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden transition-all duration-200 ease-in-out">
            <Suspense fallback={<Loading />}>
            {children}
            </Suspense>
          </main>
      <Footer />
           
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
