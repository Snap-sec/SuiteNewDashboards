import { useState } from 'react';
import { AlertOctagon, Plug2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchInput } from '@/components/custom/search';
import { useStore } from '../store.js';
import ActiveAdapters from './lists/active-adapter.jsx';
import Adapters from './lists/adapters-list';


export default function AdapterTabs() {
  const [search, setSearch] = useState('');
  const tab = useStore((state) => state.tab);
  const setTab = useStore((state) => state.setTab);

  return (
    <Tabs
      defaultValue="adapters"
      value={tab}
      onValueChange={(val) => {
        setTab(val);
        setSearch('');
      }}
    >
      <TabsList variant="line" size="sm" className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <TabsTrigger value="adapters">
            <Plug2 /> Adapters
          </TabsTrigger>

          <TabsTrigger value="active-adapters">
            <AlertOctagon /> Active Adapters
          </TabsTrigger>
        </div>


        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, description, or type"
          className="w-full md:w-72"
          inputClass="pl-9 pr-9"
        />
      </TabsList>

      <TabsContent value="adapters">
        <Adapters searchQuery={search} />
      </TabsContent>

      <TabsContent value="active-adapters">
        <ActiveAdapters />
      </TabsContent>

    </Tabs>
  );
}
