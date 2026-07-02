'use client';

import { useState } from 'react';
import type { Psicologo } from '@/types';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

interface ProfileTableProps {
  perfiles: Psicologo[];
  onEliminar: (id: string) => Promise<void>;
}

const MODALIDAD_LABEL: Record<string, string> = {
  online: 'Online',
  presencial: 'Presencial',
  ambas: 'Ambas',
};

export function ProfileTable({ perfiles, onEliminar }: ProfileTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleEliminar(id: string) {
    setLoadingId(id);
    try {
      await onEliminar(id);
    } finally {
      setLoadingId(null);
    }
  }

  if (perfiles.length === 0) {
    return (
      <p className="text-center text-gray-500 py-16 text-sm">
        No hay perfiles registrados.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Nombre', 'Especialidad', 'País', 'Modalidad', 'Registrado', 'Acción'].map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {perfiles.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{p.nombre}</td>
              <td className="px-4 py-3 text-gray-600">{p.especialidad}</td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.pais}</td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                {MODALIDAD_LABEL[p.modalidad] ?? p.modalidad}
              </td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {new Date(p.creadoEn).toLocaleDateString('es-VE', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
              <td className="px-4 py-3">
                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <button
                      disabled={loadingId === p.id}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loadingId === p.id ? 'Eliminando…' : 'Eliminar'}
                    </button>
                  </AlertDialog.Trigger>

                  <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                      <AlertDialog.Title className="text-base font-semibold text-gray-900">
                        ¿Eliminar perfil?
                      </AlertDialog.Title>
                      <AlertDialog.Description className="mt-2 text-sm text-gray-600">
                        Vas a eliminar el perfil de <strong>{p.nombre}</strong>. Esta acción no se
                        puede deshacer.
                      </AlertDialog.Description>
                      <div className="mt-5 flex justify-end gap-3">
                        <AlertDialog.Cancel asChild>
                          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancelar
                          </button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                          <button
                            onClick={() => handleEliminar(p.id)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                          >
                            Sí, eliminar
                          </button>
                        </AlertDialog.Action>
                      </div>
                    </AlertDialog.Content>
                  </AlertDialog.Portal>
                </AlertDialog.Root>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
