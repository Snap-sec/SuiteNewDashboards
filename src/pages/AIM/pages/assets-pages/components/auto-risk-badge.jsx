
import { Badge } from "@/components/ui/badge"
import AutoRiskCardHover from "./auto-risk-hover-card"


const getRiskScoreVariant = (score) => {
  if (!score) return 'secondary';
  if (score >= 70) return 'destructive';
  if (score >= 40) return 'warning';
  return 'success';
};


function AutoRiskBadge({risk, otherData}){

    
    return(
        <Badge
            variant={getRiskScoreVariant(risk?.autoRiskScore?.score)}
            appearance="outline"
            className="font-medium"
            >
             {risk?.autoRiskScore?.score || 0}
            <AutoRiskCardHover risk={risk} otherData={otherData}/>
        </Badge>
    )
}


export default AutoRiskBadge;