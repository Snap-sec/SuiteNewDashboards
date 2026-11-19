/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const BreadcrumbContext = createContext(null);

export function BreadcrumbProvider({ children }) {
  const [dynamicTitle, setDynamicTitle] = useState(null);
  const [entityType, setEntityType] = useState(null);
  const [customCrumbs, setCustomCrumbs] = useState(null);
  const location = useLocation();

  // Reset breadcrumbs state on route navigation to prevent stale titles
  useEffect(() => {
    setDynamicTitle(null);
    setEntityType(null);
    setCustomCrumbs(null);
  }, [location.pathname]);

  return (
    <BreadcrumbContext.Provider
      value={{
        dynamicTitle,
        setDynamicTitle,
        entityType,
        setEntityType,
        customCrumbs,
        setCustomCrumbs,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}

/**
 * Hook to set the dynamic breadcrumb title and optional entity type from a details page.
 * Automatically cleans up on unmount.
 */
export function useBreadcrumbTitle(title, type = null) {
  const { setDynamicTitle, setEntityType } = useBreadcrumb();

  useEffect(() => {
    if (title) {
      setDynamicTitle(title);
    }
    if (type) {
      setEntityType(type);
    }
    return () => {
      setDynamicTitle(null);
      setEntityType(null);
    };
  }, [title, type, setDynamicTitle, setEntityType]);
}
