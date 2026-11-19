import { Badge } from "@/components/ui/badge"
import VulnsHoverModel from "./vulns-hover-model";


function VulnCountBadge({ score, data }) {

  const getRiskScoreVariant = (score) => {
    if (!score) return 'secondary';
    if (score >= 7) return 'destructive';
    if (score >= 4) return 'warning';
    return 'success';
  };


  return (
    <Badge
      variant={getRiskScoreVariant(score)}
      appearance="outline"
      shape="circle"
      className="font-medium"
    >
      {score || '0'}
      {score > 1 && (
        <VulnsHoverModel data={data} />
      )}
    </Badge>
  )
}


export default VulnCountBadge;