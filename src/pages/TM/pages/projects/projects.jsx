import { useState, useEffect } from 'react';
import { ContentLoader } from '@/components/common/content-loader';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '../../../../components/custom/page-heading';
import { useGetProjectsQuery } from '../../../../services/tm/projectApi';
import CreateProjectModel from './components/create-project-model';
import { CardProject } from './components/project-card';
import { Helmet } from 'react-helmet';
import { SearchInput } from '../../../../components/custom/search';
import {NoSearchResultsFound} from "@/components/common/no-search-found.jsx"
import useDebounce from '@/hooks/use-debounce';

function Projects() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce(query, 500);

  // Pass query as param along with page and limit to the query hook
  const { data, isLoading } = useGetProjectsQuery({ page, limit, search: debouncedSearch });

  // Reset page to 1 when query changes to avoid empty page results
  useEffect(() => {
    setPage(1);
  }, [query]);

  const handleChange = (e) => setQuery(e.target.value);

  if (isLoading) {
    return <>
    <ContentLoader className="w-full h-full" />;
    <Helmet>
        <title>Threat Modeler | Projects </title>
      </Helmet>
    </>
  }

  if (data?.total === 0) {
    return (
      <EmptyScreen
        title="No Projects Found"
        subTitle="You have not created any projects yet!"
        engage={<CreateProjectModel />}
      />
    );
  }

  return (
    <>
       <Helmet>
        <title>Threat Modeler | Projects </title>
      </Helmet>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <PageHeading title="Projects" description="Manage your threat modeling projects" />

          <div className="flex items-center gap-2">
            <SearchInput
              value={query}
              onChange={handleChange}
              placeholder="Search Projects..."
              isSearching={false}
            />
            <CreateProjectModel />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-5">
          {data?.projects?.map((item, index) => (
            <CardProject
              key={index}
              id={item?._id}
              name={item?.name}
              description={item?.description}
              startDate={item.createdAt}
              team={item?.collaborators}
              totalEndpoints={item?.endpointsCount}
              totalThreats={item?.closed_threats + item?.open_threats}
              remedation={item?.remediation}
            />
          ))}
        </div>
         {(!isLoading && data?.projects?.length == 0) && 
            <NoSearchResultsFound subTitle="Nothing matched your filters or search criteria"/>
        }
      </div>
    </>
  );
}

export default Projects;
