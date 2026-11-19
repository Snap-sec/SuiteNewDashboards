import AboutCard from '../cards/AboutCard';
import SuggestionCard from '../cards/SuggestionCard';
import DescriptionCard from '../cards/DescriptionCard';

export default function AboutTab({ group, isLoading }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
      {/* Left Column: Descriptions and Suggestions */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <AboutCard about={group?.about} isLoading={isLoading} />
        <SuggestionCard suggestion={group?.suggestion} isLoading={isLoading} />
        {/* <DescriptionCard description={group?.description} isLoading={isLoading} /> */}
      </div>

    </div>
  );
}
