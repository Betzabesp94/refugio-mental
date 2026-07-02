'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Guard: redirect to login if no valid session token is present.
    // Real security is enforced by the JWT Authorizer on API Gateway.
    if (!isAuthenticated()) {
      router.replace('/admin/login');
    }
  }, [router]);

  // Render children even before the effect fires (SSR-safe: getToken returns null on server)
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
