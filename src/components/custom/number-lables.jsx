import { Badge } from '@/components/ui/badge';

const getScoreConfig = (score) => {
    const numScore = parseFloat(score) || 0;

    if (numScore <= 3.9) {
        return {
            variant: "success"
        };
    } else if (numScore >= 4.0 && numScore <= 6.9) {
        return {
            variant: "primary"
        };
    } else if (numScore >= 7.0 && numScore <= 8.9) {
        return {
            variant: "warning"
        };
    } else {
        return {
            variant: "destructive"
        };
    }
}

function NumberLables({ severity, score }) {
    const scoreConfig = getScoreConfig(score);

    return (
        <Badge variant={scoreConfig.variant} appearance="outline" shape="circle">
            {score || '0.0'}
        </Badge>
    )
};

export default NumberLables;
