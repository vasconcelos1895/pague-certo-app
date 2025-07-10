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
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            GETT <span className="text-[hsl(204,45%,37%)]">Help</span> Desk
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
            <div
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            >
              <h3 className="text-2xl font-bold">Inventário</h3>
              <div className="text-lg">
                Computadores, telefones, impressoras e periféricos
              </div>
            </div>
            <div
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            >
              <h3 className="text-2xl font-bold">Atendimento</h3>
              <div className="text-lg">
                Suporte interno ao órgão, controle de chamados externos
              </div>
            </div>
            <div
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            >
              <h3 className="text-2xl font-bold">Processos</h3>
              <div className="text-lg">
                Acompanhamento dos históricos dos processos 
              </div>
            </div>
            <div
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            >
              <h3 className="text-2xl font-bold">Sistemas</h3>
              <div className="text-lg">
                Soluções de inovação para atendimento do órgão
              </div>
            </div>  

          </div>
          <ButtonLogin />          
        </div>
      </main>
    </HydrateClient>
  );
}
