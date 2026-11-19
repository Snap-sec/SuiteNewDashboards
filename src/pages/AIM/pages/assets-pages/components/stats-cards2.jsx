import Cards from './card/card';
import { Skeleton } from '@/components/ui/skeleton';

const StatsCards = ({stats, statsLoading}) => {
    console.log('Stat',stats)
    const items =stats && Object.entries(stats).map(
      ([key, value]) => ({
        number: value,      
        label: key   
      })
    );
    
    if(statsLoading){
        return <Skeleton className="w-full h-[90px]" />
    }
  return (
    <Cards items={items} isLoading={statsLoading} />
  )
}

export default StatsCards
