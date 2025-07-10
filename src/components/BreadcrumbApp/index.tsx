import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent } from "../ui/card"
import { cn } from "@/lib/utils"


interface BreadcrumbAppProps extends React.HtmlHTMLAttributes<HTMLElement> {
  index: boolean,
  link: string,
  label: string
}

export default function BreadcrumbApp({ index, link, label }: BreadcrumbAppProps) {
  return (
    <Card className={cn('bg-slate-50 dark:bg-zinc-800 shadow-none border-none p-3')}>
        <Breadcrumb>
          <BreadcrumbList className={cn('self-center')}>
            <BreadcrumbItem>
              {/* <BreadcrumbLink> */}
                {index ?
                  <BreadcrumbLink href={link}>Início</BreadcrumbLink> :
                  <BreadcrumbLink href={link}>voltar</BreadcrumbLink>
                }
              {/* </BreadcrumbLink> */}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{label}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
    </Card>
  )
}