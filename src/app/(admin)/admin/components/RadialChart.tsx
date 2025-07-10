"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, RadialBar, RadialBarChart } from "recharts"

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

export const description = "A radial chart with a label"

const chartData = [
  { browser: "Impressoras", equipamentos: 200, fill: "var(--color-impressora)" },
  { browser: "Telefones", equipamentos: 173, fill: "var(--color-telefone)" },
  { browser: "Monitores", equipamentos: 187, fill: "var(--color-monitor)" },
  { browser: "Computadores", equipamentos: 275, fill: "var(--color-computador)" },
]

const chartConfig = {
  equipamentos: {
    label: "Equipamentos",
  },
  computador: {
    label: "Computadores",
    color: "#172554",
  },
  impressora: {
    label: "Impressoras",
    color: "#1d4ed8",
  },
  monitor: {
    label: "Monitores",
    color: "#1e3a8a",
  },
  telefone: {
    label: "Telefones",
    color: "#1e40af",
  },
} satisfies ChartConfig

export function ChartRadialLabel() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Parque Tecnológico</CardTitle>
        <CardDescription>Atualizado em {formatDate(new Date(), 'dd/MM/yyyy')}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar dataKey="equipamentos" background>
              <LabelList
                position="insideStart"
                dataKey="browser"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Inventário GETT 
        </div>
        <div className="text-muted-foreground leading-none">
          Total de equipamentos na Secretaria
        </div>
      </CardFooter>
    </Card>
  )
}
