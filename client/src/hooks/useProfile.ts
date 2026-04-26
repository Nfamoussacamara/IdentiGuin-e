import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/api/documents';
import type { IProfile } from '@/types';


export const useProfile = () => {
  const { data: profile, isLoading, error } = useQuery<IProfile>({
    queryKey: ['userProfile'],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // Cache de 5 minutes — le profil ne change pas souvent
  });

  // Génère les initiales pour l'avatar (ex: "NC" pour N'famoussa Camara)
  const initiales = profile
    ? `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase()
    : '...';

  return { profile, isLoading, error, initiales };
};
