//internal dependencies
import type { ReactNode } from 'react';
import BreadcrumbApp from '../BreadcrumbApp';

interface PageLayoutProps {
    index: boolean,
    link: string,
    label: string,
    description: string,
    notBreadcrumb?: boolean,
    children: ReactNode
}

export default function PageLayout(props: PageLayoutProps) {
    return (
        <div className='flex flex-col w-full p-0 md:py-5'>
            <div className="flex flex-col w-full pb-3">
                <h1 className="text-2xl font-bold tracking-tight">{props.label}</h1>
                <p className="text-muted-foreground">
                    {props.description}
                </p>
            </div>            
            <div className="flex flex-col w-full border p-5 bg-slate-50">
                {!props.notBreadcrumb && 
                <div className='flex justify-start w-[98%] md:w-3/4 pb-1 pt-2'>
                    <BreadcrumbApp index={props.index} link={props.link} label={props.label}/>
                </div>
                }
                <div className="flex flex-col space-y-2 bg-white p-5 border ">
                    {props.children}
                </div>                    
            </div> 
        </div>        
    )
}