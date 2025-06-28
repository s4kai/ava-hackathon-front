import { AppHeader } from "@/components/app-header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      <div className="flex-1 flex  justify-center"> {children}</div>
    </>
  );
}
