import { api, HydrateClient } from "@/trpc/server";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    // Usuário está logado, redirecione ou renderize outra página
    redirect("/");  // redireciona para dashboard, por exemplo
  }

  return (
    <HydrateClient>
      <h2>Home</h2>
    </HydrateClient>
  );
}
