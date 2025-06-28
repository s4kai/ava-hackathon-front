import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-4">
      <h1 className="text-9xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
      <p className="text-center mb-6 text-gray-600">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <Link href="/">
        <Button>Voltar para a página inicial</Button>
      </Link>
    </div>
  );
}
