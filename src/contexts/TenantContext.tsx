import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant } from '../types';

interface TenantContextType {
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant | null) => void;
  getTenantPath: (path: string) => string;
}

export const TenantContext = createContext<TenantContextType>({ 
  currentTenant: null, 
  setCurrentTenant: () => {},
  getTenantPath: (path: string) => path
});

export const useCurrentTenant = () => useContext(TenantContext);

export function TenantProvider({ children, tenant }: { children: React.ReactNode, tenant: Tenant | null }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(tenant);

  useEffect(() => {
    setCurrentTenant(tenant);
  }, [tenant?.id, tenant?.name, tenant?.slug, tenant?.customDomain, tenant?.primaryColor, tenant?.logoUrl]);

  const getTenantPath = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    if (!currentTenant) return normalizedPath;
    
    const isCustomDomain = currentTenant.customDomain && window.location.hostname === currentTenant.customDomain;
    if (isCustomDomain) {
      return normalizedPath;
    }
    return `/${currentTenant.slug}${normalizedPath}`;
  };

  return (
    <TenantContext.Provider value={{ currentTenant, setCurrentTenant, getTenantPath }}>
      {children}
    </TenantContext.Provider>
  );
}
