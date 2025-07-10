import { ButtonLogin } from "@/components/ButtonLogin";
import { api, HydrateClient } from "@/trpc/server";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { redirect } from "next/navigation";
import { ChartAreaInteractive } from "./components/ChartAreaInterative";
import { ChartRadialLabel } from "./components/RadialChart";
import { mergeChartData } from "@/lib/mergeChartData";
import ChartBarDefault from "./components/CharBarDefault";
import ChartLineStep from "./components/CharLineStep";
import ChartAreaLinear from "./components/ChartAreaLinear";
import ChartLineLabelCustom from "./components/ChartLineLabelCustom";
import { pivotChartData } from "@/lib/pivotChartData";
import { ChartAreaInteractiveEdoc } from "./components/ChartAreaInterativeEdoc";

export default async function Home() {
  const session = await auth();
  const internos = await api.interno.getAtendimentosPorData();
  const ordemServicos = await api.ordemServico.getOrdemServicoPorData();
  const dataEdoc = await api.atendimentoEdoc.getAtendimentosPorDataDescricao();
  const qtdeMonitores = await api.monitor.getQtdeMonitores();
  const qtdeComputadores = await api.computador.getQtdeComputador();
  const qtdeTelefones = await api.telefone.getQtdeTelefone();
  const qtdeImpressoras = await api.impressora.getQtdeImpressora();

  const charDataLineStep = [
    {equipamento: 'Computador', qtde: qtdeComputadores},
    {equipamento: 'Monitor', qtde: qtdeMonitores},
    {equipamento: 'Telefone', qtde: qtdeTelefones},
    {equipamento: 'Impressora', qtde: qtdeImpressoras}            
  ]
  // Garanta que sejam arrays
  const safeInternos = Array.isArray(internos) ? internos : [];
  const safeOrdemServicos = Array.isArray(ordemServicos) ? ordemServicos : [];

  // Mescle os dados
  const chartData = mergeChartData(safeInternos, safeOrdemServicos);
  const chartDataEdoc = pivotChartData(dataEdoc)

  if (!session) {
    // Usuário está logado, redirecione ou renderize outra página
    redirect("/");  // redireciona para dashboard, por exemplo
  }

  return (
    <HydrateClient>
      <ChartAreaInteractive chartData={chartData} />
      <ChartAreaInteractiveEdoc chartData={chartDataEdoc} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartLineLabelCustom chartData={charDataLineStep} />     
        <ChartLineStep />
      </div>
    </HydrateClient>
  );
}
