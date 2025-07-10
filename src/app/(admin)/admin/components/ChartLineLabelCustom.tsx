"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart } from "recharts"

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

export const description = "A line chart with a custom label"


const chartConfig = {
  qtde: {
    label: "Qtde",
    color: "#0891b2",
  },
  Computador: {
    label: "Computador",
    color: "#0891b2",
  },
  Telefone: {
    label: "Telefone",
    color: "#0891b2",
  },
  Impressora: {
    label: "Impressora",
    color: "#0891b2",
  },
  Monitor: {
    label: "Monitor",
    color: "#0891b2",
  },
} satisfies ChartConfig


interface ChartData {
  equipamento: string;
  qtde: number;
}

export default function ChartLineLabelCustom({ chartData }: {chartData: ChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parque Tecnológico</CardTitle>
        <CardDescription>Atualizado em {formatDate(new Date(), 'dd/MM/yyyy')}</CardDescription>
      </CardHeader>
      <CardContent className="m-5">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer            
            data={chartData}
            margin={{
              top: 24,
              left: 34,
              right: 34,
            }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="qtde"
                  hideLabel
                />
              }
            />
            <Line
              dataKey="qtde"
              type="natural"
              stroke="var(--color-qtde)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-qtde)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                dataKey="equipamento"
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Qtde. de equipamentos no Órgão
        </div>
        <div className="text-muted-foreground leading-none">
          Inventário GETT
        </div>
      </CardFooter>
    </Card>
  )
}
