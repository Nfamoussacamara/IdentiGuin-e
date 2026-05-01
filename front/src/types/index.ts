/**
 * types/index.ts
 * Point d'entrée unique pour toutes les interfaces du projet frontend.
 * Séparation stricte : les types ne dépendent d'aucune logique métier.
 */

export interface IProfile {
  id: number;
  numero_citoyen: string;
  nom_complet: string;
  email: string;
  first_name: string;
  last_name: string;
  date_naissance: string;
  lieu_naissance: string;
  numero_registre_naissance: string;
  telephone: string;
  est_verifie_naissancechain: boolean;
  profil_complet: boolean;
  
  // Nouveaux champs Phase 2
  nin?: string;
  genre?: 'M' | 'F';
  taille?: number;
  pere_nom_complet?: string;
  mere_nom_complet?: string;
  adresse?: string;
  region?: string;
  prefecture?: string;
  commune?: string;
  quartier?: string;
  secteur?: string;
  profession?: string;
  photo?: string;
}

export interface IDemande {
  id: number;
  reference: string;
  type_document: string;
  statut: string;
  citoyen: any;
  blockchain_tx_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface IStats {
  SOUMIS: number;
  EN_TRAITEMENT: number;
  REJETE: number;
  ACCEPTE: number;
}
