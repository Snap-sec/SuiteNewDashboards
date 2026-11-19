import { Button } from "@/components/ui/button";
import { CircleAlert } from 'lucide-react';
import { useState } from "react";
import { Modal } from '@/components/custom/modal';
import { Badge } from '@/components/ui/badge';


function AutoRiskCardHover({risk, otherData}){

    const [isModalOpen, setIsModalOpen] = useState(false);

    return(
          <Modal
                open={isModalOpen}
                setOpen={setIsModalOpen}
                title="Asset Risk Calculation"
                description="Overall Calculation of Risk."
                trigger={
                   <CircleAlert />
                }
                className="w-[700px]"
           >
            <div className="flex flex-col gap-4">
                
                <div className="p-3 border rounded-lg border-default">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-6">
                            <h3 className="text-base font-semibold leading-none tracking-tight">
                                Overall Risk Score
                            </h3>
                            <span class="text-sm text-secondary-foreground">
                                Asset Type : {` `}
                                <span class="text-sm font-medium text-foreground">
                                {otherData?.type}
                                </span>
                            </span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <h3 className="text-3xl font-semibold text-mono">
                              {risk?.autoRiskScore?.score}
                            </h3>

                            <span class="text-sm text-secondary-foreground capitalize">
                              {risk?.autoRiskScore?.severity} Risk Score 
                            </span>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-3 gap-5 lg:gap-2 h-full items-stretch">

                    <div className='border border-default p-3 flex items-center justify-between gap-1 rounded-lg w-full'>
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-semibold leading-none tracking-tight">
                              Vulnerabilities
                            </p>
                            <h2 className='text-sm font-normal text-muted-forehead'>
                              C:{otherData?.properties?.vulnerabilityStats?.critical || 0} 
                              {` `}
                              H:{otherData?.properties?.vulnerabilityStats?.high || 0} 
                              {` `}
                              M:{otherData?.properties?.vulnerabilityStats?.medium || 0} 
                              {` `}
                              L:{otherData?.properties?.vulnerabilityStats?.low || 0} 
                            </h2>


                            <div className="flex justify-between">
                                <p className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                                    Score × 60%
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-xl font-medium leading-none text-mono">
                                {risk?.autoRiskScore?.finalScores?.vulnerabilityScore.toFixed(0)}
                            </p>
                            <p className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                                ({risk?.autoRiskScore?.factors?.vulnerabilityScore.toFixed(0)})
                            </p>
                        </div>                        
                    </div>


                    <div className='border border-default p-3 flex items-center justify-between gap-1 rounded-lg w-full'>
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-semibold leading-none tracking-tight">
                              Exposure
                            </p>
                            <Badge variant={`${risk?.exposure ? "destructive" : "success"}`} appearance="outline">
                              {risk?.exposure ? "Exposed" : "Safe"}
                            </Badge>


                            <div className="flex justify-between">
                                <p className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                                    Score × 30%
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-xl font-medium leading-none text-mono">
                                {risk?.autoRiskScore?.finalScores?.exposureScore.toFixed(0)}
                            </p>
                            <p className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                                ({risk?.autoRiskScore?.factors?.exposureScore.toFixed(0)})
                            </p>
                        </div>                        
                    </div>


                    <div className='border border-default p-3 flex items-center justify-between gap-1 rounded-lg w-full'>
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-semibold leading-none tracking-tight">
                              Inherent Risk
                            </p>
                            <h2 className='text-sm font-normal text-muted-forehead'>
                              {otherData?.type}
                            </h2>


                            <div className="flex justify-between">
                                <p className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                                    Score × 10%
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-xl font-medium leading-none text-mono">
                                {risk?.autoRiskScore?.finalScores?.assetTypeScore.toFixed(0)}
                            </p>
                            <p className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                                ({risk?.autoRiskScore?.factors?.assetTypeRisk.toFixed(0)})
                            </p>
                        </div>                        
                    </div>

                </div>

                <div className="border border-default p-3 flex items-center justify-between rounded-lg">
                    <p className="text-base font-semibold leading-none tracking-tight">
                        Final Calculation
                    </p>

                    <span className="text-sm text-secondary-foreground">
                         {risk?.autoRiskScore?.finalScores?.vulnerabilityScore.toFixed(1)} + 
                         {risk?.autoRiskScore?.finalScores?.exposureScore.toFixed(1)} + 
                         {risk?.autoRiskScore?.finalScores?.assetTypeScore.toFixed(1)} = {` `}
                       <span className="text-lg font-medium text-primary">
                        {Math.round(risk?.autoRiskScore?.finalScores?.vulnerabilityScore + risk?.autoRiskScore?.finalScores?.exposureScore + risk?.autoRiskScore?.finalScores?.assetTypeScore)}
                       </span>
                    </span>
                </div>
            </div>
      </Modal>
    )
}


export default AutoRiskCardHover;