import client from './client';

export const getDemandes = async () => {
  const response = await client.get('/demandes/');
  return response.data;
};

export const createDemande = async (formData) => {
  const response = await client.post('/demandes/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
