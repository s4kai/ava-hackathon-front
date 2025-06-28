import type { Metadata } from "next";
import "./globals.css";
import "@mdxeditor/editor/style.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title:
    "AcadIA - Plataforma de Personalização Acadêmica com IA | Solução para Faculdades e Professores",
  description:
    "Solução inovadora que utiliza IA para personalizar o ensino superior, reduzir evasão e auxiliar professores com materiais adaptados e monitoramento individualizado de alunos.",
  keywords: [
    "educação superior",
    "personalização acadêmica",
    "IA na educação",
    "redução de evasão",
    "ensino adaptativo",
    "ferramentas para professores",
    "monitoramento de alunos",
    "materiais personalizados",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col bg-gray-50">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
