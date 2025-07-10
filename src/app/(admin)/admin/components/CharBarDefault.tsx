"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatDate } from "date-fns"

export const description = "A bar chart"

// const chartData = [
//   { descricao: "Outros", qtde: 186 },
//   { descricao: "Parmetrização", qtde: 305 },
//   { descricao: "Rascunho", qtde: 237 },
//   { descricao: "Unidade Admin.", qtde: 73 },
//   { descricao: "Usuario", qtde: 209 },
// ]

const chartConfig = {
  qtde: {
    label: "Qtde",
    color: "#0891b2",
  },
} satisfies ChartConfig

interface ChartData {
  descricao: string;
  qtde: number;

}

export default function ChartBarDefault({ chartData }: {chartData: ChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>EDoc</CardTitle>
        <CardDescription>Atualizado em {formatDate(new Date(), 'dd/MM/yyyy')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="descricao"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              //tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="qtde" fill="var(--color-qtde)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Atendimentos por tipo
        </div>
        <div className="text-muted-foreground leading-none">
          Total de solicitações da PMCG
        </div>
      </CardFooter>
    </Card>
  )
}
