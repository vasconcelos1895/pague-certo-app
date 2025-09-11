// src/components/Reports/NomeacoesReportPdf.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { AdditionalProvisionLevel } from "@prisma/client";

const HEADER_HEIGHT = 70;
const FOOTER_HEIGHT = 30;

const styles = StyleSheet.create({
  page: {
    paddingTop: HEADER_HEIGHT + 10,
    paddingBottom: FOOTER_HEIGHT + 10,
    paddingHorizontal: 50,
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
  headerTitle: { fontSize: 12, fontWeight: 500, marginBottom: 4, marginTop: 15 },
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
  additionalProvisionLevel: AdditionalProvisionLevel[];
  title?: string;
}

export function AdditionalProvisionLevelPdf({ additionalProvisionLevel = [], title = "Relatório" }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Header fixo */}
        <View style={styles.headerContainer} fixed>
          <Text>PREFEITURA MUNICIPAL DE CAMPO GRANDE</Text>
          <Text>Secretaria Municipal de Administração e Inovação</Text>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerMeta}>
            Gerado em: {new Date().toLocaleString("pt-BR")} — Total de registros: {additionalProvisionLevel.length}
          </Text>
        </View>

        {/* Cabeçalho da tabela */}
        <View style={styles.tableHeader} fixed>
          <Text style={[styles.tableCell, { width: "20%" }]}>Período de Atraso</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>Prazo inicial (meses)</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>Prazo Final</Text>
          <Text style={[styles.tableCell, { width: "10%" }]}>C1 (%)</Text>
          <Text style={[styles.tableCell, { width: "10%" }]}>C2 (%)</Text>
          <Text style={[styles.tableCell, { width: "10%" }]}>C3 (%)</Text>          
          <Text style={[styles.tableCell, { width: "10%" }]}>C4 (%)</Text>
          <Text style={[styles.tableCell, { width: "10%" }]}>C5 (%)</Text>          
        </View>

 

        {/* Renderiza linhas do órgão */}
        {additionalProvisionLevel.map((n, i) => (
          <View key={(n as any).id ?? i} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "20%" }]}>{n.delayPeriod ?? " - "}</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>{n.initialDeadline ?? " - "}</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>{n.finalDeadline ?? " - "}</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>{n.percentageC1?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) ?? " - "}</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>{n.percentageC2?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) ?? " - "}</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>{n.percentageC3?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) ?? " - "}</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>{n.percentageC4?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) ?? " - "}</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>{n.percentageC5?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) ?? " - "}</Text>                                                
          </View>
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