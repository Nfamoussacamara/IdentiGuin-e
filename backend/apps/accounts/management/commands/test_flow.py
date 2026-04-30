from django.core.management.base import BaseCommand
from apps.accounts.services import inscrire_citoyen
from apps.documents.services import creer_demande
from apps.accounts.models import CitoyenUser
from apps.documents.models import DemandeDocument
import json

class Command(BaseCommand):
    help = 'Teste le flux complet IdentiGuinée (Inscription -> Demande -> Blockchain)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('--- DÉBUT DU TEST IDENTIGUINÉE ---'))

        # 1. Nettoyage
        self.stdout.write('Nettoyage des données de test...')
        CitoyenUser.objects.filter(email='test@identiguinee.gn').delete()

        # 2. Inscription
        self.stdout.write('Étape 1 : Inscription du citoyen...')
        data_citoyen = {
            'email': 'test@identiguinee.gn',
            'username': 'test_citoyen',
            'password': 'password123',
            'first_name': 'Mamadou',
            'last_name': 'Diallo',
            'date_naissance': '1995-05-15',
            'lieu_naissance': 'Conakry',
            'numero_registre_naissance': 'REG-2026-999',
            'telephone': '+224620000000'
        }
        
        citoyen = inscrire_citoyen(data_citoyen)
        self.stdout.write(f'  - Citoyen créé : {citoyen.nom_complet}')
        self.stdout.write(f'  - Numéro Citoyen : {citoyen.numero_citoyen}')

        # 3. Création de demande
        self.stdout.write('Étape 2 : Soumission d\'une demande d\'Extrait de Naissance...')
        try:
            demande = creer_demande(
                citoyen_id=citoyen.id,
                type_document='EXTRAIT_NAIS',
                pieces_data=[] # Pas de fichiers pour le test simple
            )
            self.stdout.write(f'  - Demande créée : {demande.reference}')
            
            # 4. Vérification du pipeline automatisé
            # Dans notre version actuelle, traiter_demande_automatiquement est appelé en synchrone 
            # à la fin de creer_demande pour faciliter les tests.
            
            self.stdout.write('Étape 3 : Vérification du traitement automatique...')
            demande.refresh_from_db()
            
            self.stdout.write(f'  - Statut final : {demande.get_statut_display()}')
            self.stdout.write(f'  - Hash Blockchain : {demande.blockchain_tx_hash}')
            self.stdout.write(f'  - Token QR Code : {demande.qr_code_token}')
            
            if demande.statut == 'PRET':
                self.stdout.write(self.style.SUCCESS('  => SUCCÈS : Le document est prêt sans intervention humaine !'))
            else:
                self.stdout.write(self.style.ERROR('  => ÉCHEC : Le statut n\'est pas celui attendu.'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erreur pendant le flux : {str(e)}'))

        self.stdout.write(self.style.SUCCESS('--- FIN DU TEST ---'))
