"use client";
import { useSession, signIn } from "next-auth/react";
import { api } from "@/trpc/react"; // Ajuste conforme seu setup
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function DriveList() {
  const { data: session, status } = useSession();
  const [folderId, setFolderId] = useState("");
  const [submittedFolder, setSubmittedFolder] = useState("");

  // TRPC query - só executa se a pasta for fornecida e usuário logado  
  const listQuery = api.driver.listFiles.useQuery(
    { folderId: submittedFolder },
    {
      enabled: !!submittedFolder && status === "authenticated",
      // Retry only once on error  
      retry: 1
    }
  );

  if (status === "loading") return <div>Carregando...</div>;


  return (
    <div className="flex flex-col w-full py-4">
      <h2 className="text-md font-bold mb-4">Buscar arquivos de configurações técnicas</h2>
      <form
        onSubmit={e => {  
          e.preventDefault();  
          // Trim and validate folder ID  
          const trimmedFolderId = folderId.trim();  
          if (trimmedFolderId) {  
            setSubmittedFolder(trimmedFolderId);  
          }  
        }}  
        className="flex gap-2 mb-6"
      >
        <input
          className="border rounded px-2 py-1 flex-1"
          type="text"
          placeholder="Cole o ID da pasta do Drive aqui"
          value={folderId}  
          onChange={e => setFolderId(e.target.value)}  
        />
        <button className="px-4 py-1 bg-blue-500 text-white rounded" type="submit"
          disabled={!folderId.trim()}  >
          Listar
        </button>
      </form>

      {listQuery.isFetching && <div>Carregando arquivos...</div>}
      {listQuery.error && (
        <div className="text-red-500">{listQuery.error.message}</div>
      )}

      {listQuery.data && listQuery.data.length === 0 && (
        <p className="text-gray-500">Nenhum arquivo encontrado nesta pasta.</p>
      )}


      <div className="flex gap-2">
        {listQuery.data?.map((file: any, key: any) => (
          <Card key={file.id} className="p-3">
            <CardHeader className="m-0 p-0">
              <CardTitle className="p-0">{key + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={file.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 underline"
              >
                {file.name}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}