'use client'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ItemTab = {
    name: string
    ariallabel: string
    icon?: React.ReactNode
    content: React.ReactNode
    isDisabled?: boolean    
}

interface TabContentProps {
    activeTab: string
    dataTab: ItemTab[]
}


export default function TabContent({ activeTab, dataTab }: TabContentProps) {
    const [tabActive, setTabActive] = useState(activeTab);

    const handleClick = (tabname:string) => {
        setTabActive(tabname)
    }

    return (
        <>
            <Tabs defaultValue={activeTab} className="w-full" orientation="vertical">
                <ScrollArea className="whitespace-nowrap overflow-hidden text-ellipsis ">              
                    <TabsList>
                            {dataTab.map(tab => (                    
                                <TabsTrigger value={tab.name} key={tab.name} onClick={() => handleClick(tab.name)} disabled={tab.isDisabled}>
                                    <div className="flex flex-row gap-1">
                                        {/* <span className={`prose prose-sm `}>{tab.icon}</span> */}
                                        <span className={`hidden md:block prose prose-sm `}>{tab.ariallabel}</span>                        
                                    </div>
                                </TabsTrigger>
                            ))}                    
                    </TabsList>
                    <ScrollBar orientation={"horizontal"} /> 
                </ScrollArea>    

                {dataTab.map(tab => (
                <TabsContent value={tab.name} key={tab.name}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tabActive ? tabActive : "empty"}
                            //initial={{ y: 10, opacity: 0 }}
                            //animate={{ y: 0, opacity: 1 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}                            
                            //exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                        {tab.content}
                        </motion.div>
                    </AnimatePresence> 
                </TabsContent>
                ))}                                  
            </Tabs>
        </>
    )
}