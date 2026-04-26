import client from './client';

export interface IDemande {
  id: number;
  reference: string;
  type_document: string;
  statut: string;
  citoyen: any;
  hash_blockchain?: string;
  created_at: string;
  updated_at: string;
}

export interface IStats {
  SOUMIS: number;
  EN_TRAITEMENT: number;
  REJETE: number;
  ACCEPTE: number;
}

export const getDemandes = async (): Promise<IDemande[]> => {
  const response = await client.get<IDemande[]>('/demandes/');
  return response.data;
};

export const createDemande = async (formData: FormData): Promise<IDemande> => {
  const response = await client.post<IDemande>('/demandes/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getDashboardStats = async (): Promise<IStats> => {
  const response = await client.get<IStats>('/demandes/stats/');
  return response.data;
};