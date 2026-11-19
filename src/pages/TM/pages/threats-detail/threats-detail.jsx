import { useEffect, useState } from 'react';
import { MoveLeft, MoveRight } from 'lucide-react';
import { Link } from 'react-router';
import { useGetProjectsQuery } from '@/services/tm/projectApi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ContentLoader } from '@/components/common/content-loader';
import PageHeading from '../../../../components/custom/page-heading';
import { useGetThreatByIdQuery } from '../../../../services/tm/threatApi';
import { Activity } from './components/activity';
import CommentBox from './components/comment-box';
import ExplinationCard from './components/explination-cards';
import { ThreatDetailsCard } from './components/threat-details-card';
import { Helmet } from 'react-helmet';

function buildMitigation(mitigations) {
  let doc = [];

  for (let mitigation of mitigations) {
    doc.push(<li className="">{mitigation}</li>);
  }

  return <ol className="list-decimal list-inside">{doc}</ol>;
}

function Refrences(refrences) {
  let doc = [];

  for (let refrence of refrences) {
    doc.push(
      <li className="text-primary">
        <Link to={refrence} target="_blank" className="">
          {refrence}
        </Link>
      </li>,
    );
  }

  return <ol className="list-decimal list-inside">{doc}</ol>;
}

function ThreatsDetail() {
  // Get initial threat ID from URL
  const initialThreatId = window.location.pathname.split('/').pop();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [queryParam, setQueryParam] = useState({ threatId: initialThreatId });

  const { data: threat, error, isLoading } = useGetThreatByIdQuery(queryParam);

  const { data: Project, isLoading: isThreatsLoading } = useGetProjectsQuery({
    page,
    limit,
  });

  // When threat changes, update the id in queryParam (for direct navigation)
  useEffect(() => {
    if (threat?._id && queryParam.id !== threat._id) {
      setQueryParam({ threatId: threat._id });
    }
  }, [threat?._id]);

  if (isLoading || isThreatsLoading) {
    return <>
    <Helmet>
        <title>Threat Modeler | Threat Detials</title>
      </Helmet>
    <ContentLoader className="w-full h-full" />;
    </>
  }

  return (
    <div className="p-4">
      <Helmet>
        <title>Threat Modeler | Threat Detials</title>
      </Helmet>
      
      <div className="flex justify-between items-center">
        <PageHeading
          title={threat?.title}
          description={`Threat ID: ${threat?._id || ''}`}
        />
        <div className="flex items-center gap-2">
          {threat?.hasPrev ? (
            <Button
              variant="secondary"
              onClick={() =>
                setQueryParam({
                  params: { prevOf: threat?._id },
                  threatId: threat?._id,
                })
              }
            >
              <MoveLeft /> Previous
            </Button>
          ) : (
            ''
          )}

          {threat?.hasNext ? (
            <Button
              variant="primary"
              onClick={() =>
                setQueryParam({
                  params: { nextOf: threat?._id },
                  threatId: threat?._id,
                })
              }
            >
              Next <MoveRight />
            </Button>
          ) : (
            ''
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-row gap-4">
        <div className="flex flex-col gap-4 flex-grow">
          <ExplinationCard
            threat={threat}
            threatId={threat?._id}
            title="Explaination"
            summary={threat?.explaination}
            updateField={'explaination'}
            allowEditing={true}
          />

          <ExplinationCard
            threat={threat}
            threatId={threat?._id}
            title="Mitigations"
            summary={buildMitigation(threat?.mitigations || [])}
            updateField={'mitigations'}
            allowEditing={true}
          />

          <ExplinationCard
            threat={threat}
            threatId={threat?._id}
            title="References"
            summary={Refrences(threat?.references || [])}
            allowEditing={true}
            updateField={'references'}
          />

          <ExplinationCard
            threat={threat}
            threatId={threat?._id}
            title="Conclusion"
            summary={
              threat?.conclusion ||
              'This threat is yet to reach its final stage'
            }
          />
        </div>

        <ThreatDetailsCard data={threat} project={Project} />
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <Card className="py-3">
          <CommentBox threat={threat} />
        </Card>

        <Activity threat={threat} />
      </div>
    </div>
  );
}

export default ThreatsDetail;
