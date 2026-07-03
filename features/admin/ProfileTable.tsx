'use client';

import { useState } from 'react';
import type { Psicologo } from '@/types';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { CheckCircle, XCircle, Clock, X, Eye, FileQuestion } from 'lucide-react';

interface ProfileTableProps {
  perfiles: Psicologo[];
  onEliminar: (id: string) => Promise<void>;
  onVerificar: (id: string, estado: 'APPROVED' | 'REJECTED') => Promise<void>;
}

const MODALIDAD_LABEL: Record<string, string> = {
  online: 'Online',
  presencial: 'Presencial',
  ambas: 'Ambas',
};

export function ProfileTable({ perfiles, onEliminar, onVerificar }: ProfileTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // Estado para controlar qué perfil está abierto en el modal de la credencial
  const [credencialPerfil, setCredencialPerfil] = useState<Psicologo | null>(null);

  async function handleEliminar(id: string) {
    setLoadingId(id);
    try {
      await onEliminar(id);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleVerificarAccion(id: string, estado: 'APPROVED' | 'REJECTED') {
    setVerifyingId(id);
    try {
      await onVerificar(id, estado);
      setCredencialPerfil(null); // Cierra el modal tras verificar
    } finally {
      setVerifyingId(null);
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
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Nombre', 'Especialidad', 'País', 'Modalidad', 'Registrado', 'Verificación', 'Credencial', 'Acción'].map((col) => (
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
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{p.nombre} {p.apellido}</td>
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
                
                {/* Columna: Verificación */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex flex-col items-start gap-1.5">
                    {p.estadoVerificacion === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs font-medium border border-green-100">
                        <CheckCircle className="w-3.5 h-3.5" /> Aprobado
                      </span>
                    )}
                    {p.estadoVerificacion === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1 rounded-full text-xs font-medium border border-red-100">
                        <XCircle className="w-3.5 h-3.5" /> Rechazado
                      </span>
                    )}
                    {(!p.estadoVerificacion || p.estadoVerificacion === 'PENDING') && (
                      <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full text-xs font-medium border border-yellow-100">
                        <Clock className="w-3.5 h-3.5" /> Pendiente
                      </span>
                    )}
                  </div>
                </td>

                {/* Nueva Columna: Credencial */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => setCredencialPerfil(p)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition-colors text-xs"
                  >
                    <Eye className="w-4 h-4" /> Ver
                  </button>
                </td>

                {/* Columna Modificada: Acciones (Solo eliminar) */}
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
                          Vas a eliminar el perfil de <strong>{p.nombre} {p.apellido}</strong>. Esta acción no se
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

      {/* Modal Global para ver la credencial y aprobar/rechazar */}
      <AlertDialog.Root 
        open={!!credencialPerfil} 
        onOpenChange={(open) => !open && setCredencialPerfil(null)}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            
            {/* Header del modal */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <AlertDialog.Title className="text-lg font-semibold text-gray-900">
                Credencial de {credencialPerfil?.nombre} {credencialPerfil?.apellido}
              </AlertDialog.Title>
              <AlertDialog.Cancel asChild>
                <button className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </AlertDialog.Cancel>
            </div>

            {/* Contenido de la foto */}
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1 flex flex-col items-center justify-center min-h-[300px]">
              {credencialPerfil?.credencialUrl ? (
                <img 
                  src={credencialPerfil.credencialUrl} 
                  alt={`Credencial de ${credencialPerfil.nombre}`} 
                  className="max-w-full h-auto max-h-[50vh] object-contain rounded-lg shadow-sm border border-gray-200 bg-white"
                />
              ) : (
                <div className="text-center text-gray-400 flex flex-col items-center">
                  <FileQuestion className="w-16 h-16 mb-3 text-gray-300" />
                  <p>Este usuario no adjuntó una credencial válida.</p>
                </div>
              )}
            </div>

            {/* Footer con los botones de acción */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">
                Estado actual: {
                  credencialPerfil?.estadoVerificacion === 'APPROVED' ? 'Aprobado' :
                  credencialPerfil?.estadoVerificacion === 'REJECTED' ? 'Rechazado' : 'Pendiente'
                }
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => credencialPerfil && handleVerificarAccion(credencialPerfil.id, 'REJECTED')}
                  disabled={verifyingId === credencialPerfil?.id}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  {verifyingId === credencialPerfil?.id ? 'Procesando...' : 'Rechazar'}
                </button>
                <button
                  onClick={() => credencialPerfil && handleVerificarAccion(credencialPerfil.id, 'APPROVED')}
                  disabled={verifyingId === credencialPerfil?.id}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  {verifyingId === credencialPerfil?.id ? 'Procesando...' : 'Aprobar'}
                </button>
              </div>
            </div>

          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}