
import { useEffect } from 'react';
import Exposures from './exposures';
import useStore from './store';
import { Helmet } from 'react-helmet';
import PageHeading from '@/components/custom/page-heading';

export default function FalseExposures() {
  const setFilters = useStore((state) => state.setFilters);

  useEffect(() => {
    // Set falsePositive filter to true when mounting this page
    setFilters((prev) => ({ ...prev, falsePositive: true }));
    
    // Clean up when unmounting (optional, depending on desired behavior when navigating away)
    // For now, we might want to keep the state if they navigate back? 
    // Actually, distinct pages usually imply distinct state or resetting when leaving context.
    // But since they share the store, we should be careful.
    
    return () => {
        // Reset filter when leaving this page to avoid it persisting on the main page if they share state?
        // If the main page also sets state on mount, it might be fine.
        setFilters((prev) => {
            const newFilters = { ...prev };
            delete newFilters.falsePositive;
            return newFilters;
        });
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Xpose | False Positive Exposures</title>
      </Helmet>
         {/* We reuse the Exposures component but we might need to adjust it to not show the "False Positives" toggle 
          or show it as active/different. 
          However, since `Exposures` is the default export and contains the layout, 
          we might just want to render it. 
          
          The issue is `Exposures` component has its own `useEffect` that resets pagination and refetches.
          And it has its own Helmet and PageHeading. 
          
          If we simple reuse `Exposures`, it will render "Xpose | Exposures" title etc.
          
          Let's see if we can pass props to `Exposures` to control this.
      */}
      <Exposures isFalsePositiveView={true} />
    </>
  );
}
