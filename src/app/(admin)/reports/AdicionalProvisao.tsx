// src/components/Reports/NomeacoesReportPdf.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Nomeacao } from "@prisma/client";

const HEADER_HEIGHT = 50;
const FOOTER_HEIGHT = 30;

const styles = StyleSheet.create({
  page: {
    paddingTop: HEADER_HEIGHT + 10,
    paddingBottom: FOOTER_HEIGHT + 10,
    paddingHorizontal: 12,
    fontSize: 9,
  },
  headerContainer: {
    position: "absolute",
    top: 10,
    left: 12,
    right: 12,
    height: HEADER_HEIGHT,
    textAlign: "center",
  },
  headerTitle: { fontSize: 12, fontWeight: 500, marginBottom: 4 },
  headerMeta: { fontSize: 9 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    paddingBottom: 4,
    marginTop: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.25,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 4,
    minHeight: 16,
  },
  orgaoHeader: { 
    backgroundColor: "#f0f0f0", 
    padding: 4, 
    marginTop: 6,
    marginBottom: 4 
  },
  tableCell: { padding: 2, fontSize: 10 },
  footerContainer: {
    position: "absolute",
    bottom: 10,
    left: 12,
    right: 12,
    height: FOOTER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 8,
  },
  footerLeft: { textAlign: "left" },
  footerRight: { textAlign: "right" },
});

interface Props {
  nomeacoes: Nomeacao[];
  title?: string;
}

export default function NomeacoesReportPdf({ nomeacoes = [], title = "Relatório" }: Props) {
  // Agrupa por órgão (preserva ordem original)
  const groups: Record<string, Nomeacao[]> = {};
  const groupOrder: string[] = [];
  
  nomeacoes.forEach((item) => {
    const key = item.orgao ?? "NÃO INFORMADO";
    if (!groups[key]) {
      groups[key] = [];
      groupOrder.push(key);
    }
    groups[key].push(item);
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Header fixo */}
        <View style={styles.headerContainer} fixed>
          <Text>PREFEITURA MUNICIPAL DE CAMPO GRANDE</Text>
          <Text>Secretaria Municipal de Administração e Inovação</Text>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerMeta}>
            Gerado em: {new Date().toLocaleString("pt-BR")} — Total de nomeações: {nomeacoes.length}
          </Text>
        </View>

        {/* Cabeçalho da tabela */}
        <View style={styles.tableHeader} fixed>
          <Text style={[styles.tableCell, { width: "15%" }]}>Órgão</Text>
          <Text style={[styles.tableCell, { width: "20%" }]}>Nome</Text>
          <Text style={[styles.tableCell, { width: "10%" }]}>Matrícula</Text>
          <Text style={[styles.tableCell, { width: "10%" }]}>Símb.</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>Função</Text>
          <Text style={[styles.tableCell, { width: "10%" }]}>Tipo Vaga</Text>          
          <Text style={[styles.tableCell, { width: "20%" }]}>Autoridade</Text>
        </View>

        {/* Renderização por grupo de órgão */}
        {groupOrder.map((orgao, gIndex) => (
          <React.Fragment key={orgao}>
            {/* Quebra de página para todos os grupos, exceto o primeiro */}
            {gIndex > 0 && <View break />}

            {/* Cabeçalho do órgão */}
            <View style={styles.orgaoHeader}>
              <Text style={{ fontSize: 10, fontWeight: "bold" }}>{orgao}</Text>
            </View>

            {/* Renderiza linhas do órgão */}
            {groups[orgao].map((n, i) => (
              <View key={(n as any).id ?? `${orgao}-${i}`} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "15%" }]}>{n.orgao ?? "N/A"}</Text>
                <Text style={[styles.tableCell, { width: "20%" }]}>{n.nome ?? "N/A"}</Text>
                <Text style={[styles.tableCell, { width: "10%" }]}>{n.matricula ?? "N/A"}</Text>
                <Text style={[styles.tableCell, { width: "10%" }]}>{n.simbolo ?? "N/A"}</Text>
                <Text style={[styles.tableCell, { width: "15%" }]}>{n.funcao ?? "N/A"}</Text>
                <Text style={[styles.tableCell, { width: "10%" }]}>{n.tipoVaga ?? "N/A"}</Text>                
                <Text style={[styles.tableCell, { width: "20%" }]}>{`${n.cargoAutoridade ?? ""} ${n.autoridade ?? ""}`}</Text>
              </View>
            ))}
          </React.Fragment>
        ))}

        {/* Rodapé com paginação */}
        <View style={styles.footerContainer} fixed>
          <Text style={styles.footerLeft}>Superintendência de Divulgação Institucional (SUDIV)</Text>
          <Text style={styles.footerRight} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}