import { ButtonLogin } from "@/components/ButtonLogin";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    // Usuário está logado, redirecione ou renderize outra página
    redirect("/admin");  // redireciona para dashboard, por exemplo
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-5 text-zinc-600">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-[5rem] text-center">
            Sistema de <span className="text-[hsl(204,45%,37%)]">Gestão das Pastas</span> Funcionais
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
            <div
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            >
              <h3 className="text-2xl font-bold">Pastas Funcionais</h3>
              <div className="text-lg">
                Encontre os documentos funcionais 
              </div>
            </div>
            <div
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            >
              <h3 className="text-2xl font-bold">Acompanhamento de empréstimo</h3>
              <div className="text-lg">
                Localize a pasta funcional retirada por alguma unidade administrativa
              </div>
            </div>
            
          </div>
          <ButtonLogin />          
        </div>
      </main>
    </HydrateClient>
  );
}
