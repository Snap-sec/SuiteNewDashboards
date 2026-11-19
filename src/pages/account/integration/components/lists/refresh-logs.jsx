import { useGetApiSecIntegrationQuery } from '@/services/apisec/integrationApi';
import { TimelineActivities } from './timeline-activity';
import { ContentLoader } from '@/components/common/content-loader';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyScreen } from '@/components/common/empty-screen';

function RefreshLogs(){

  const {
    data: integrations,
    isLoading: adaptersLoading,
    isError,
  } = useGetApiSecIntegrationQuery();

  // try to extract logs from apisec integration response; fall back to empty
  const adapters = integrations?.data?.[0]?.logs || [];

    if (adaptersLoading) {
       return(
        <ContentLoader />
       ) 
    }

    if (adapters?.length === 0) {
      return(
        <EmptyScreen 
          showTitle={false}
          subTitle="No logs available at the moment. Please refresh or check back later."
        />
      )
    }

    return (
        <div>
           
          <Card>
            <CardHeader>
                <CardTitle>Refresh Logs </CardTitle>
            </CardHeader>
            <CardContent>
                <TimelineActivities logs={adapters}/>
            </CardContent>
          </Card>
         
        </div>
    );

}


export default RefreshLogs;