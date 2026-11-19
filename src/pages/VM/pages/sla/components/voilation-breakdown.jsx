
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Table from './table';

function VoilationBreakDownTable({ data, isLoading }) {

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="font-normal text-sm text-gray-500">Violation Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table data={data} isLoading={isLoading} />
            </CardContent>
        </Card>
    )
}


export default VoilationBreakDownTable;