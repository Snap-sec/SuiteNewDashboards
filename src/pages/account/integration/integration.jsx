import { Helmet } from 'react-helmet';
import PageHeading from '@/components/custom/page-heading';
import AdapterTabs from './components/adapter-tabs';
import ModalRegister from './components/modal-register';



export default function Integration() {

  return (
    <div className="p-4">
      <Helmet>
        <title>Auth | Integrations</title>
      </Helmet>

      <PageHeading title="Integrations" description="Integrate External tooling with Suite" />


      <div className=" mt-6">
        <AdapterTabs />
      </div>


      <ModalRegister />
    </div>
  );
}