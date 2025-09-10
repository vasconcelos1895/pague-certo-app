"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import React from "react";

interface ButtonExportPdfProps {
  data: any[]; // Dados filtrados do DataTable
  onLoadingChange?: (isLoading: boolean) => void; // Callback para controlar loading
  urlReport: string
}

export default function ButtonExportPdf({ data, onLoadingChange, urlReport }: ButtonExportPdfProps) {
  
  const handleExportPdf = async () => {
    try {
      // Notificar início do loading
      onLoadingChange?.(true);

      const response = await fetch(`/api/report/${urlReport}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar relatório PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-${urlReport}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      // Opcional: Adicione um toast ou mensagem de erro para o usuário
    } finally {
      // Notificar fim do loading
      onLoadingChange?.(false);
    }
  };

  return (
    <Button
      onClick={handleExportPdf}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Printer className="w-4 h-4" /> Gerar PDF
    </Button>
  );
}