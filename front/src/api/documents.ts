/**
 * api/documents.ts
 * Logique d'accès aux données uniquement — pas d'interfaces ici.
 * Les types sont importés depuis @/types.
 */
import client from './client';
import type { IDemande, IStats, IProfile } from '@/types';

export type { IDemande, IStats, IProfile };

export const getDemandes = async (): Promise<IDemande[]> => {
  const response = await client.get<IDemande[]>('/demandes/');
  return response.data;
};

export const getDashboardStats = async (): Promise<IStats> => {
  const response = await client.get<IStats>('/demandes/stats/');
  return response.data;
};

export const createDemande = async (typeDocument: string, files: File[]): Promise<IDemande> => {
  const formData = new FormData();
  formData.append('type_document', typeDocument);
  
  files.forEach((file) => {
    formData.append('pieces_fichiers', file);
  });

  const response = await client.post<IDemande>('/demandes/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getProfile = async (): Promise<IProfile> => {
  const response = await client.get<IProfile>('/auth/me/');
  return response.data;
};

export const updateProfile = async (data: Partial<IProfile>, photoFile?: File): Promise<IProfile> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  if (photoFile) formData.append('photo', photoFile);

  const response = await client.patch<IProfile>('/auth/me/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};