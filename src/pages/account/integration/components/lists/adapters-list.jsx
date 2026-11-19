import { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import { AdapterInfoCard } from '../cards/adapter-info-card';
import newAdapters from "../../data.json";

import { useStore } from '../../store';



const InstallSection = ({ searchQuery = '' }) => {
  const setAdapterModalOpen = useStore(state => state.setAdapterModalOpen);
  const setAdapterType = useStore(state => state.setAdapterType);

  function open_adapter(adapter) {
      setAdapterModalOpen(true);
      setAdapterType(adapter.type);
  }

  const adapters = newAdapters.map(a => ({ ...a, preinstall: <Button variant="outline" onClick={() => open_adapter(a)}>Install</Button> }));

  const filteredAdapters = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return adapters.filter(
      (adapter) =>
        adapter.name.toLowerCase().includes(q) ||
        adapter.description.toLowerCase().includes(q) ||
        adapter.type.toLowerCase().includes(q),
    );
  }, [searchQuery, adapters]);


  const renderItem = (item, index) => {
    return (
      <AdapterInfoCard
        logo={item.logo}
        logoUrl={item.logoUrl}
        path={item.path}
        name={item.name}
        description={item.description}
        preinstall={item.preinstall}
        postinstall={item.postinstall}
        installed={item.installed}
        key={index}
      />
    );
  };
  

  return (
    <div id="integrations_cards">
      {filteredAdapters.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
          {filteredAdapters.length > 0 &&
            filteredAdapters.map((adapter, index) =>
              renderItem(adapter, index),
            )}
        </div>
      ) : (
        <div className="flex justify-center w-full">
          <NoSearchResultsFound />
        </div>
      )}
    </div>
  );
};

export default InstallSection;
