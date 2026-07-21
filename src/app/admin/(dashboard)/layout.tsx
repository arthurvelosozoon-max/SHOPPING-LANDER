import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-sl-black lg:flex-row">
      <AdminNav />
      <div className="flex-1 overflow-x-auto p-4 sm:p-6 lg:p-10">{children}</div>
    </div>
  );
}
