"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "A linear area chart"

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

export default function ChartAreaLinear({ chartData }: {chartData: ChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>EDoc</CardTitle>
        <CardDescription>Atualizado em {formatDate(new Date(), 'dd/MM/yyyy')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 24,
              right: 24,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="descricao"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                switch (value) {
                  case 'usuario':
                    return 'Usuário'
                    break;
                  case 'unidade_administrativa':
                    return 'Uni. Admin.'
                    break;
                  case 'outros':
                    return 'Outros'
                    break;
                  case 'parametrizacao':
                    return 'Parametr.'
                    break;            
                  case 'rascunho':
                    return 'Rascunho'
                    break;                                                                            
                  default:
                    return ''
                    break;
                }
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel/>}
            />
            <Area
              dataKey="qtde"
              type="step"
              fill="var(--color-qtde)"
              fillOpacity={0.4}
              stroke="var(--color-qtde)"
            />
          </AreaChart>
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
