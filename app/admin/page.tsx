'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { obtenerPerfiles, eliminarPerfil, actualizarEstadoPerfil } from '@/lib/api';
import { getToken, signOut } from '@/lib/auth';
import { ProfileTable } from '@/features/admin/ProfileTable';
import type { Psicologo } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const [perfiles, setPerfiles] = useState<Psicologo[]>([]);
  console.log(perfiles)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerPerfiles();
      setPerfiles(data);
    } catch {
      setError('No se pudieron cargar los perfiles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function handleVerificar(id: string, nuevoEstado: 'APPROVED' | 'REJECTED') {
    const token = getToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    try {
      // Llamada a tu API para actualizar el registro en DynamoDB
      await actualizarEstadoPerfil(id, nuevoEstado, token);
      
      toast.success(`Perfil ${nuevoEstado === 'APPROVED' ? 'aprobado' : 'rechazado'}.`);
      
      // Actualizamos el estado localmente para no tener que recargar toda la tabla
      setPerfiles((prev) => 
        prev.map((p) => p.id === id ? { ...p, estadoVerificacion: nuevoEstado } : p)
      );
    } catch {
      toast.error('Error al actualizar el estado del psicólogo.');
    }
  }

  async function handleEliminar(id: string) {
    const token = getToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    try {
      await eliminarPerfil(id, token);
      toast.success('Perfil eliminado correctamente.');
      setPerfiles((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error('Ocurrió un error al intentar eliminar el perfil.');
    }
  }

  function handleSignOut() {
    signOut();
    router.replace('/admin/login');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Panel de administración</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Cargando…' : `${perfiles.length} perfil${perfiles.length !== 1 ? 'es' : ''} registrado${perfiles.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          Cerrar sesión
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
          <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          Cargando perfiles…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={cargar}
            className="ml-4 text-red-800 underline hover:no-underline text-xs"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <ProfileTable 
          perfiles={perfiles} 
          onEliminar={handleEliminar} 
          onVerificar={handleVerificar}
        />
      )}
    </div>
  );
}