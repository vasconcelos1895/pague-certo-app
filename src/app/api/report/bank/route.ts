import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { BankPdf }  from "@/app/(admin)/reports/BankPdf"
import { Readable as NodeReadable } from "stream";

/**
 * Converte NodeJS Readable para Web ReadableStream<Uint8Array>
 */
function nodeReadableToWeb(nodeStream: NodeReadable): ReadableStream<Uint8Array> {
  // Use Readable.toWeb quando disponível (Node 17+)
  // @ts-ignore runtime check
  if (typeof (NodeReadable as any).toWeb === "function") {
    // @ts-expect-error runtime check
    return (NodeReadable as any).toWeb(nodeStream) as ReadableStream<Uint8Array>;
  }

  return new ReadableStream<Uint8Array>({
    start(controller) {
      const onData = (chunk: Buffer | string) => {
        try {
          const chunkUint8 = typeof chunk === "string" ? new TextEncoder().encode(chunk) : new Uint8Array(chunk);
          controller.enqueue(chunkUint8);
        } catch (err) {
          controller.error(err as any);
        }
      };

      const onEnd = () => controller.close();
      const onError = (err: any) => controller.error(err);

      nodeStream.on("data", onData);
      nodeStream.on("end", onEnd);
      nodeStream.on("error", onError);
    },
    cancel(reason) {
      if (typeof nodeStream.destroy === "function") {
        try {
          nodeStream.destroy(reason as any);
        } catch (_) {
          // ignore
        }
      }
    },
  });
}

export async function POST(req: Request) {
  try {
    // Recebe os dados diretamente no corpo da requisição
    const bank = await req.json();


    // Validação simples
    if (!bank || !Array.isArray(bank)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    if (!BankPdf || typeof BankPdf !== "function") {
      console.error("BankPdf inválido:", BankPdf);
      return NextResponse.json({ error: "BankPdf inválido" }, { status: 500 });
    }

    // renderToStream retorna Node Readable
    const nodeStream = (await renderToStream(
      React.createElement(BankPdf, {
        bank,
        title: "Níveis de provisão adicional para perda esperada",
      })
    )) as unknown as NodeReadable;

    const webStream = nodeReadableToWeb(nodeStream);

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="rel-BankPdf.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("Erro ao gerar relatório:", err);
    return NextResponse.json({ 
      error: `Erro ao gerar relatório. ${err?.message ?? String(err)}` 
    }, { status: 500 });
  }
}