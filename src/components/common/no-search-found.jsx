import React from 'react';
import { toAbsoluteUrl } from '../../lib/helpers';
import { Starter } from '../../partials/custom/starter';

export const NoSearchResultsFound = ({ title, subTitle }) => {
  return (
    <Starter
      image={
        <>
          <img
            src={toAbsoluteUrl('/media/illustrations/3.svg')}
            className="dark:hidden max-h-[200px]"
          />

          <img
            src={toAbsoluteUrl('/media/illustrations/3-dark.svg')}
            className="light:hidden max-h-[200px]"
          />
        </>
      }
      title={title || 'No Results Found'}
      subTitle={
        subTitle ||
        'Looks like we didn’t find what you’re looking for. Want to try again?'
      }
    />
  );
};
