import React, { Suspense } from 'react';

import { ContentLoader } from '@/components/common/content-loader';

const Error500 = React.lazy(() => import("@/pages/error/500-error"));


import { Route, Routes } from 'react-router';

export function ErrorRoutesSetup() {
  return (
    <Routes>

        <Route path="/error" element={
            <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                <Error500 />
            </Suspense>
        } />


    </Routes>
  );
}