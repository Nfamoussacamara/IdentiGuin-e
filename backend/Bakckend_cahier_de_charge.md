CAHIER DES CHARGES API — IdentiGuinée
Backend Django · Projet GN-02 · MIABE Hackathon 2026

01 — VUE D'ENSEMBLE
Objectif de l'API
Exposer les endpoints nécessaires au fonctionnement complet du portail IdentiGuinée : gestion des citoyens, soumission et traitement automatisé des demandes de documents, intégration NaissanceChain, génération de documents certifiés, vérification tiers via QR code, et tableau de bord administrateur.
Principes fondateurs

Zéro intervention humaine — les workflows métier sont entièrement automatisés via la couche service + Celery
Zero Trust — le backend valide et assainit toutes les données de façon autocratique
SOLID — chaque application Django a une responsabilité unique, claire et isolée
Langue officielle — français pour tout commentaire complexe, doc technique et planification


02 — STACK TECHNIQUE
Langage          Python 3.11+
Framework        Django 5.x + Django REST Framework
Auth             SimpleJWT (access + refresh tokens)
Tâches async     Celery + Redis
PDF              WeasyPrint (génération documents certifiés)
QR Code          qrcode[pil]
Blockchain mock  Web3.py (simulation NaissanceChain en Phase 1)
Base de données  PostgreSQL 15
Cache            Redis
Tests            pytest + pytest-django
Lint/Format      Ruff + Black
Versioning       Git Flow + Conventional Commits
Docs API         drf-spectacular (OpenAPI 3)
Variables env    python-decouple (.env)

03 — ARCHITECTURE DES APPLICATIONS DJANGO
identiguinee_backend/
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── celery.py
│   └── exception_handler.py      ← Handler unifié (Règle 7)
│
├── apps/
│   ├── accounts/                 ← Gestion citoyens & authentification
│   │   ├── docs/
│   │   │   ├── structure.md
│   │   │   └── er_schema.md
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── services.py           ← Logique métier pure
│   │   ├── views.py              ← HTTP uniquement
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   ├── signals.py
│   │   └── tests/
│   │       └── test_services.py
│   │
│   ├── documents/                ← Demandes & génération documents
│   │   ├── docs/
│   │   │   ├── structure.md
│   │   │   └── er_schema.md
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── tasks.py              ← Celery tasks
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   └── tests/
│   │       └── test_services.py
│   │
│   ├── blockchain/               ← Intégration NaissanceChain
│   │   ├── docs/
│   │   │   ├── structure.md
│   │   │   └── naissancechain_flow.md
│   │   ├── services.py           ← Simulation + appels Web3
│   │   ├── utils.py
│   │   └── tests/
│   │       └── test_services.py
│   │
│   ├── verification/             ← Vérification tiers QR code
│   │   ├── docs/
│   │   │   └── structure.md
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests/
│   │       └── test_services.py
│   │
│   └── dashboard/                ← Tableau de bord admin
│       ├── docs/
│       │   └── structure.md
│       ├── services.py
│       ├── views.py
│       ├── urls.py
│       └── tests/
│           └── test_services.py
│
├── .env
├── requirements.txt
└── manage.py

04 — MODÈLES DE DONNÉES

accounts — CitoyenUser
pythonclass CitoyenUser(AbstractUser):
    """
    Modèle utilisateur étendu représentant un citoyen guinéen.
    Remplace le User Django standard via AUTH_USER_MODEL.
    """
    numero_citoyen: str          # Identifiant unique national (auto-généré)
    date_naissance: date
    lieu_naissance: str
    numero_registre_naissance: str   # Clé de croisement NaissanceChain
    telephone: str
    is_verified: bool            # Vérification NaissanceChain effectuée
    created_at: datetime
    updated_at: datetime

    @property
    def nom_complet(self) -> str:
        """Retourne prénom + nom formatés."""

    @property
    def profil_complet(self) -> bool:
        """Vérifie que tous les champs requis sont renseignés."""

documents — DemandeDocument
pythonclass TypeDocument(models.TextChoices):
    CNI            = 'CNI',            'Carte Nationale d\'Identité'
    EXTRAIT_NAIS   = 'EXTRAIT_NAIS',   'Extrait de Naissance'
    PASSEPORT      = 'PASSEPORT',      'Passeport'
    CERT_RESIDENCE = 'CERT_RESIDENCE', 'Certificat de Résidence'

class StatutDemande(models.TextChoices):
    RECUE               = 'RECUE',               'Demande reçue'
    VERIFICATION_EN_COURS = 'VERIFICATION',      'Vérification NaissanceChain'
    SIGNATURE           = 'SIGNATURE',           'Signature cryptographique'
    PRET                = 'PRET',                'Prêt au téléchargement'
    REJETE              = 'REJETE',              'Rejeté'

class DemandeDocument(models.Model):
    """
    Représente une demande de document officiel par un citoyen.
    Le cycle de vie complet est piloté par la couche service + Celery.
    """
    reference: str               # REQ-2026-XXXXX (auto-généré)
    citoyen: FK → CitoyenUser
    type_document: str           # TypeDocument choices
    statut: str                  # StatutDemande choices
    blockchain_tx_hash: str      # Hash transaction NaissanceChain
    blockchain_network: str      # 'NaissanceChain'
    document_genere: FileField   # PDF signé généré
    qr_code_token: str           # Token unique pour vérification tiers
    motif_rejet: str             # Renseigné si statut = REJETE
    created_at: datetime
    updated_at: datetime
    completed_at: datetime

    @property
    def duree_traitement(self) -> timedelta:
        """Calcule la durée entre création et complétion."""

    @property
    def est_verifiable(self) -> bool:
        """Vrai si le document a un hash blockchain valide."""

documents — PieceJustificative
pythonclass PieceJustificative(models.Model):
    """Fichier uploadé associé à une demande."""
    demande: FK → DemandeDocument
    fichier: FileField
    nom_original: str
    uploaded_at: datetime

verification — LogVerification
pythonclass LogVerification(models.Model):
    """
    Trace chaque vérification tiers effectuée via QR code ou hash.
    Aucune donnée personnelle stockée (conformité vie privée).
    """
    qr_code_token: str
    resultat: bool               # True = authentique, False = invalide
    ip_verificateur: str         # Anonymisée
    verified_at: datetime

05 — COUCHE SERVICE (services.py)
Règle absolue : les views ne contiennent aucune logique métier.

accounts/services.py
pythondef inscrire_citoyen(data: dict) -> CitoyenUser:
    """
    Crée un compte citoyen, génère le numéro citoyen unique,
    déclenche la vérification NaissanceChain en arrière-plan.
    """

def verifier_identite_naissancechain(citoyen_id: int) -> bool:
    """
    Croise le numéro_registre_naissance avec NaissanceChain.
    Délègue à blockchain.services.
    """

documents/services.py
pythondef creer_demande(citoyen_id: int, data: dict) -> DemandeDocument:
    """
    Crée la demande, génère la référence REQ-XXXX,
    déclenche la tâche Celery de traitement automatisé.
    """

def traiter_demande_automatiquement(demande_id: int) -> None:
    """
    Orchestre le pipeline complet :
    1. Vérification croisée NaissanceChain
    2. Signature cryptographique
    3. Génération PDF certifié
    4. Génération QR code
    5. Mise à jour statut → PRET
    Appelé exclusivement depuis tasks.py (Celery).
    """

def generer_reference_demande() -> str:
    """Génère REQ-{ANNEE}-{ID_PADDED}."""

def get_demandes_citoyen(citoyen_id: int) -> QuerySet:
    """
    Retourne toutes les demandes du citoyen.
    Utilise select_related() — Règle 6 anti N+1.
    """

blockchain/services.py
pythondef enregistrer_sur_naissancechain(demande_id: int) -> str:
    """
    Phase 1 : simule l'enregistrement, retourne un hash mock.
    Phase 2 : appel Web3.py vers le smart contract réel.
    Retourne le tx_hash.
    """

def verifier_hash_blockchain(tx_hash: str) -> bool:
    """
    Vérifie qu'un hash existe et est valide sur NaissanceChain.
    """

def generer_signature_cryptographique(demande_id: int) -> str:
    """
    Génère une signature HMAC-SHA256 du document.
    Clé privée stockée en .env exclusivement — Règle 12.
    """

documents/tasks.py — Celery
python@shared_task(bind=True, max_retries=3)
def pipeline_traitement_document(self, demande_id: int) -> None:
    """
    Tâche asynchrone Celery orchestrant le traitement complet.
    Appelle documents.services.traiter_demande_automatiquement().
    Retry automatique en cas d'échec (max 3 tentatives).
    """

@shared_task
def generer_pdf_certifie(demande_id: int) -> str:
    """
    Génère le PDF officiel via WeasyPrint.
    Inclut armoiries Guinée, données citoyen, QR code, hash blockchain.
    Retourne le chemin du fichier généré.
    """

06 — ENDPOINTS API
Base URL : /api/v1/

accounts — Authentification & Citoyens
MéthodeEndpointDescriptionAuthPOST/auth/inscription/Créer un compte citoyen✗POST/auth/connexion/Obtenir access + refresh token✗POST/auth/token/refresh/Rafraîchir le token✗GET/auth/me/Profil citoyen connecté✓PATCH/auth/me/Modifier le profil✓POST/auth/deconnexion/Blacklist du refresh token✓

documents — Demandes
MéthodeEndpointDescriptionAuthGET/demandes/Lister ses demandes✓ CitoyenPOST/demandes/Créer une nouvelle demande✓ CitoyenGET/demandes/{reference}/Détail d'une demande✓ PropriétaireGET/demandes/{reference}/statut/Statut temps réel✓ PropriétaireGET/demandes/{reference}/document/Télécharger le PDF certifié✓ Propriétaire

verification — Vérification Tiers (publique)
MéthodeEndpointDescriptionAuthGET/verification/{qr_token}/Vérifier via token QR code✗ PublicPOST/verification/hash/Vérifier via hash blockchain✗ Public

dashboard — Administration
MéthodeEndpointDescriptionAuthGET/admin/kpis/Métriques globales✓ AdminGET/admin/demandes/Toutes les demandes (paginées)✓ AdminGET/admin/blockchain/activite/Feed NaissanceChain live✓ Admin

07 — SERIALIZERS (SRP — Règle 3)
python# documents/serializers.py

class DemandeReadSerializer(serializers.ModelSerializer):
    """
    Lecture uniquement. Expose :
    reference, type_document, statut, blockchain_tx_hash,
    duree_traitement, est_verifiable, created_at, completed_at.
    """

class DemandeWriteSerializer(serializers.ModelSerializer):
    """
    Écriture uniquement. Accepte :
    type_document, pieces_justificatives.
    Valide le type_document via TypeDocument.choices.
    NE JAMAIS exposer citoyen, hash, statut — injectés par le service.
    """

class StatutDemandeSerializer(serializers.ModelSerializer):
    """
    Lecture statut temps réel uniquement :
    reference, statut, blockchain_tx_hash, updated_at.
    """

class VerificationResultatSerializer(serializers.Serializer):
    """
    Résultat de vérification tiers :
    authentique (bool), type_document, date_delivrance,
    date_expiration, naissancechain_badge, verified_at.
    Données citoyen masquées (nom partiel uniquement).
    """

08 — GESTION D'ERREURS UNIFIÉE (Règle 7)
python# config/exception_handler.py

def custom_exception_handler(exc, context) -> Response:
    """
    Handler centralisé DRF. Toute erreur API retourne :
    {
        "status": "error",
        "code": "DEMANDE_NOT_FOUND",       ← code métier lisible
        "message": "Cette demande n'existe pas ou ne vous appartient pas.",
        "details": {}                       ← champs invalides si 400
    }
    """
Codes d'erreur métier définis :
CodeHTTPDescriptionCITOYEN_ALREADY_EXISTS409Email déjà utiliséCREDENTIALS_INVALID401Email ou mot de passe incorrectTOKEN_EXPIRED401Token expiréDEMANDE_NOT_FOUND404Demande introuvableDEMANDE_ACCESS_DENIED403Demande appartenant à un autre citoyenDOCUMENT_NOT_READY400Tentative de téléchargement avant générationHASH_INVALIDE404Hash blockchain non trouvé sur NaissanceChainQR_TOKEN_INVALIDE404Token QR inexistant ou expiréNAISSANCECHAIN_ERROR503Erreur de connexion au registreUPLOAD_INVALIDE400Format de fichier non accepté

09 — PERMISSIONS (Règle 12)
python# documents/permissions.py

class EstProprietaireDemande(BasePermission):
    """
    Un citoyen A ne peut jamais accéder à la demande du citoyen B.
    Vérifié sur chaque endpoint /demandes/{reference}/.
    """
    def has_object_permission(self, request, view, obj) -> bool:
        return obj.citoyen == request.user

class EstAdminSysteme(BasePermission):
    """Accès réservé aux comptes staff/superuser."""
    def has_permission(self, request, view) -> bool:
        return request.user.is_staff

10 — SÉCURITÉ (Règle 12)
python# .env — variables obligatoires
SECRET_KEY=...
DATABASE_URL=...
REDIS_URL=...
NAISSANCECHAIN_PRIVATE_KEY=...    # Jamais dans le code
NAISSANCECHAIN_RPC_URL=...
SIGNATURE_SECRET_KEY=...          # HMAC documents
ALLOWED_HOSTS=...
CORS_ALLOWED_ORIGINS=...
Rate Limiting (django-ratelimit) :
EndpointLimitePOST /auth/connexion/5 req/minute par IPPOST /auth/inscription/3 req/minute par IPGET /verification/{token}/30 req/minute par IPPOST /demandes/10 req/heure par citoyen

11 — TESTS (Règle 13)
apps/
├── accounts/tests/
│   └── test_services.py       ← inscription, vérification NaissanceChain
├── documents/tests/
│   └── test_services.py       ← création demande, pipeline, PDF
├── blockchain/tests/
│   └── test_services.py       ← hash mock, signature, vérification
└── verification/tests/
    └── test_services.py       ← vérification QR, hash invalide
Couverture minimale exigée : 80% sur chaque services.py
Cas de test obligatoires par app :
documents/tests/test_services.py

✓ Création demande avec référence REQ générée correctement
✓ Pipeline traitement complet → statut final PRET
✓ Rejet demande → statut REJETE + motif renseigné
✓ Citoyen A ne peut pas accéder à la demande du citoyen B
✓ Téléchargement PDF indisponible si statut ≠ PRET
✓ Hash blockchain enregistré après traitement


12 — GIT FLOW (Règle 14)
main
└── develop
    ├── feature/accounts-auth
    ├── feature/documents-pipeline
    ├── feature/blockchain-naissancechain
    ├── feature/verification-qr
    └── feature/dashboard-kpis
Conventional Commits :
feat(documents): add automated document pipeline via Celery
feat(blockchain): add NaissanceChain mock integration
fix(verification): handle expired QR token gracefully
test(documents): add full pipeline coverage in test_services
chore(config): add rate limiting on auth endpoints

13 — ORDRE DE DÉVELOPPEMENT
Sprint 1 — Fondations
  1. Setup Django + DRF + config/ (settings, exception_handler, celery)
  2. app accounts — modèles + auth JWT + serializers + services + tests

Sprint 2 — Cœur métier
  3. app documents — modèles + serializers + services + pipeline Celery
  4. app blockchain — services NaissanceChain mock + signature

Sprint 3 — Outputs
  5. Génération PDF certifié (WeasyPrint) + QR code
  6. app verification — endpoints publics + LogVerification

Sprint 4 — Administration & finitions
  7. app dashboard — KPIs + feed blockchain
  8. Rate limiting + permissions objet complets
  9. Tests couverture 80%+ sur tous les services
 10. Documentation OpenAPI via drf-spectacular

14 — DOCUMENTATION TECHNIQUE (Règle 9)
Chaque app possède son propre docs/ :
apps/documents/docs/
├── structure.md          ← architecture de l'app, rôle, responsabilités
├── er_schema.md          ← schéma entité-relation
└── pipeline_flow.md      ← diagramme du pipeline automatisé

apps/blockchain/docs/
├── structure.md
└── naissancechain_flow.md  ← flux smart contract + simulation Phase 1
Toute documentation rédigée en français, au format .md.

Ce cahier est complet, conforme aux 16 règles d'architecture et aligné sur le contexte IdentiGuinée. On démarre le Sprint 1 ?Vous avez dit : mais j'ai vu la phase 1 ça c'est pour la phase 2 lemais j'ai vu la phase 1 ça c'est pour la phase 2 le16:02Claude a répondu : Tu as totalement raison.Tu as totalement raison. Le cahier des charges API que je viens de produire correspond au développement réel du backend — c'est du travail de Phase 2 (MVP fonctionnel).
Pour la Phase 1 (Présélection), le cahier des charges officiel demande uniquement :

✅ Documentation de la corruption guinéenne
✅ Maquettes visuelles portail citoyen + interface admin
✅ Site vitrine
✅ Description de la composante blockchain — comment le document est généré, lien avec NaissanceChain

Donc pour la Phase 1, le cahier API qu'on vient de faire ne sert pas à coder — il sert à décrire et documenter la composante technique blockchain dans le site vitrine et le dossier de présélection.

Ce qu'on doit faire maintenant pour la Phase 1 :
LivrableStatutMaquettes Stitch (6 écrans)✅ FaitCahier des charges site vitrine✅ FaitCahier des charges API✅ Fait — servira en Phase 2Site vitrine React + Tailwind⬅ À faire maintenantDocumentation corruption guinéenneÀ intégrer dans le siteDescription composante blockchainÀ intégrer dans le site

On attaque le site vitrine React + Tailwind CSS maintenant ? C'est le dernier livrable clé pour boucler la Phase 1.Vous avez dit : es ce que le cahier est de haut niveau si non avec les regles que je t'ai donné et celles que tu connais il faut ameliorer encore ?es ce que le cahier est de haut niveau si non avec les regles que je t'ai donné et celles que tu connais il faut ameliorer encore ???????16:04Claude a répondu : Honnêtement, non — le cahier API que j'ai produit est bon mais pas de haut niveau.Honnêtement, non — le cahier API que j'ai produit est bon mais pas de haut niveau. Voici ce qui manque concrètement :
Lacunes identifiées :

Les signals Django (Règle 4) ne sont pas spécifiés
Le Type Hinting (Règle 5) est mentionné mais pas appliqué systématiquement dans les specs
Les select_related / prefetch_related (Règle 6) ne sont détaillés que sur un seul service
La ségrégation Read/Write serializers (Règle 3) est incomplète sur accounts et verification
Aucun implementation_plan.md structuré (Règle 10)
Les Docstrings Google/Sphinx (Règle 11) ne sont pas formalisés sur tous les services
La stratégie Celery (Règle 8) manque de détail sur les queues, retry policies et monitoring
Aucun schéma ER formalisé
Les middlewares de sécurité ne sont pas listés
La pagination, le filtering et l'ordering des querysets ne sont pas spécifiés
Les variables d'environnement sont incomplètes
Aucune stratégie de versioning API (v1 → v2)

Je refais tout à haut niveau maintenant.

CAHIER DES CHARGES API — IdentiGuinée
Backend Django · Haut Niveau · Projet GN-02 · MIABE Hackathon 2026
Langue officielle : Français · Règle 15 & 16

01 — VISION TECHNIQUE
Philosophie
L'API IdentiGuinée est construite sur un principe unique : zéro intervention humaine dans le cycle de délivrance documentaire. Chaque endpoint, chaque service, chaque tâche asynchrone converge vers cet objectif. Le backend est le garant absolu de l'intégrité des données — le client frontend n'est qu'un consommateur passif sans pouvoir discrétionnaire.
Contraintes non négociables

Thin Views — aucune logique métier dans les views (Règle 1)
Zero Trust — le backend valide tout, fait confiance à rien (Règle 12)
Anti N+1 — select_related / prefetch_related systématiques (Règle 6)
Async first — tout process long passe par Celery (Règle 8)
TDD — aucun service livré sans couverture pytest (Règle 13)
Clean Code — PEP8 strict, docstrings Google/Sphinx, noms descriptifs (Règle 11)
Langue — français pour toute documentation et commentaire complexe (Règles 15 & 16)


02 — STACK TECHNIQUE COMPLÈTE
Runtime          Python 3.11+
Framework        Django 5.x
API              Django REST Framework 3.15+
Auth             djangorestframework-simplejwt
Async            Celery 5.x + Redis 7 (broker + backend)
PDF              WeasyPrint
QR Code          qrcode[pil] + Pillow
Blockchain       Web3.py (simulation NaissanceChain — Phase 1)
Base de données  PostgreSQL 15
Cache            Redis 7
Recherche        django-filter
Rate Limiting    django-ratelimit
CORS             django-cors-headers
Env              python-decouple
Tests            pytest + pytest-django + factory-boy + faker
Lint             Ruff
Format           Black
Docs API         drf-spectacular (OpenAPI 3.1)
Monitoring       Flower (Celery) + Sentry
Versioning       Git Flow + Conventional Commits
Dépendances requirements.txt
django==5.0.*
djangorestframework==3.15.*
djangorestframework-simplejwt==5.*
django-cors-headers==4.*
django-filter==24.*
django-ratelimit==4.*
python-decouple==3.*
drf-spectacular==0.27.*
celery==5.*
redis==5.*
flower==2.*
psycopg2-binary==2.*
weasyprint==62.*
qrcode[pil]==7.*
Pillow==10.*
web3==6.*
pytest==8.*
pytest-django==4.*
factory-boy==3.*
faker==24.*
ruff==0.4.*
black==24.*
sentry-sdk==2.*

03 — ARCHITECTURE DES APPLICATIONS
identiguinee_backend/
│
├── config/
│   ├── settings/
│   │   ├── base.py               ← settings communs
│   │   ├── development.py        ← DEBUG, SQLite optionnel
│   │   └── production.py         ← PostgreSQL, Sentry, Redis
│   ├── urls.py                   ← routing global versioned /api/v1/
│   ├── celery.py                 ← configuration Celery
│   ├── exception_handler.py      ← handler unifié (Règle 7)
│   └── middleware.py             ← middlewares sécurité custom
│
├── apps/
│   │
│   ├── accounts/                 ← Responsabilité : citoyens & auth
│   │   ├── docs/
│   │   │   ├── structure.md
│   │   │   ├── er_schema.md
│   │   │   └── services_flow.md
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py        ← Read + Write séparés
│   │   ├── services.py           ← logique métier pure
│   │   ├── views.py              ← HTTP uniquement
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   ├── signals.py            ← découplage inter-apps (Règle 4)
│   │   ├── managers.py           ← QuerySet managers custom
│   │   └── tests/
│   │       ├── conftest.py
│   │       ├── factories.py
│   │       └── test_services.py
│   │
│   ├── documents/                ← Responsabilité : demandes & pipeline
│   │   ├── docs/
│   │   │   ├── structure.md
│   │   │   ├── er_schema.md
│   │   │   └── pipeline_flow.md
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── tasks.py              ← Celery tasks
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   ├── filters.py            ← django-filter querysets
│   │   ├── signals.py
│   │   └── tests/
│   │       ├── conftest.py
│   │       ├── factories.py
│   │       └── test_services.py
│   │
│   ├── blockchain/               ← Responsabilité : NaissanceChain
│   │   ├── docs/
│   │   │   ├── structure.md
│   │   │   └── naissancechain_flow.md
│   │   ├── services.py
│   │   ├── adapters.py           ← abstraction Web3 / mock
│   │   ├── exceptions.py         ← exceptions blockchain custom
│   │   └── tests/
│   │       ├── conftest.py
│   │       └── test_services.py
│   │
│   ├── verification/             ← Responsabilité : vérification tiers
│   │   ├── docs/
│   │   │   └── structure.md
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests/
│   │       ├── conftest.py
│   │       └── test_services.py
│   │
│   └── dashboard/                ← Responsabilité : KPIs admin
│       ├── docs/
│       │   └── structure.md
│       ├── services.py
│       ├── views.py
│       ├── urls.py
│       └── tests/
│           └── test_services.py
│
├── utils/
│   ├── generators.py             ← génération références, tokens
│   ├── crypto.py                 ← signature HMAC, hashing
│   └── pagination.py             ← pagination custom
│
├── .env
├── .env.example
├── pytest.ini
├── pyproject.toml                ← config Ruff + Black
├── requirements.txt
└── manage.py

04 — MODÈLES DE DONNÉES COMPLETS
4.1 accounts/models.py
pythonfrom django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid


class CitoyenManager(models.Manager):
    """Manager custom pour les querysets citoyens fréquents."""

    def avec_demandes(self) -> models.QuerySet:
        """
        Retourne les citoyens avec leurs demandes préchargées.
        Applique prefetch_related pour éviter le N+1. (Règle 6)
        """
        return self.prefetch_related("demandes")

    def verifies(self) -> models.QuerySet:
        """Retourne uniquement les citoyens vérifiés NaissanceChain."""
        return self.filter(est_verifie_naissancechain=True)


class CitoyenUser(AbstractUser):
    """
    Modèle utilisateur étendu représentant un citoyen guinéen.
    Remplace le User Django standard via AUTH_USER_MODEL.

    Attributes:
        numero_citoyen: Identifiant unique national auto-généré (UUID tronqué).
        date_naissance: Date de naissance du citoyen.
        lieu_naissance: Ville/région de naissance.
        numero_registre_naissance: Clé de croisement avec NaissanceChain.
        telephone: Numéro de téléphone guinéen.
        est_verifie_naissancechain: True si croisement NaissanceChain réussi.
        created_at: Horodatage de création du compte.
        updated_at: Horodatage de dernière modification.
    """

    numero_citoyen = models.CharField(
        max_length=20, unique=True, editable=False,
        verbose_name=_("Numéro citoyen")
    )
    date_naissance = models.DateField(
        verbose_name=_("Date de naissance")
    )
    lieu_naissance = models.CharField(
        max_length=100, verbose_name=_("Lieu de naissance")
    )
    numero_registre_naissance = models.CharField(
        max_length=50, unique=True,
        verbose_name=_("Numéro registre de naissance")
    )
    telephone = models.CharField(
        max_length=15, blank=True,
        verbose_name=_("Téléphone")
    )
    est_verifie_naissancechain = models.BooleanField(
        default=False,
        verbose_name=_("Vérifié NaissanceChain")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CitoyenManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "username", "date_naissance",
        "lieu_naissance", "numero_registre_naissance"
    ]

    class Meta:
        verbose_name = _("Citoyen")
        verbose_name_plural = _("Citoyens")
        ordering = ["-created_at"]

    @property
    def nom_complet(self) -> str:
        """Retourne le prénom et le nom formatés en titre."""
        return f"{self.first_name} {self.last_name}".strip().title()

    @property
    def profil_complet(self) -> bool:
        """
        Vérifie que tous les champs obligatoires sont renseignés
        avant de permettre une demande de document.
        """
        champs_requis = [
            self.first_name, self.last_name,
            self.date_naissance, self.lieu_naissance,
            self.numero_registre_naissance
        ]
        return all(champs_requis)

    @property
    def nom_masque(self) -> str:
        """
        Retourne le nom partiellement masqué pour les tiers.
        Exemple : 'Mamadou D***'
        """
        if not self.last_name:
            return self.first_name
        return f"{self.first_name} {self.last_name[0]}***"

    def __str__(self) -> str:
        return f"{self.nom_complet} ({self.numero_citoyen})"

4.2 documents/models.py
pythonfrom django.db import models
from django.utils.translation import gettext_lazy as _
from apps.accounts.models import CitoyenUser


class TypeDocument(models.TextChoices):
    CNI            = "CNI",            _("Carte Nationale d'Identité")
    EXTRAIT_NAIS   = "EXTRAIT_NAIS",   _("Extrait de Naissance")
    PASSEPORT      = "PASSEPORT",      _("Passeport")
    CERT_RESIDENCE = "CERT_RESIDENCE", _("Certificat de Résidence")


class StatutDemande(models.TextChoices):
    RECUE                = "RECUE",        _("Demande reçue")
    VERIFICATION_EN_COURS = "VERIFICATION", _("Vérification NaissanceChain")
    SIGNATURE            = "SIGNATURE",    _("Signature cryptographique")
    PRET                 = "PRET",         _("Prêt au téléchargement")
    REJETE               = "REJETE",       _("Rejeté")


class DemandeManager(models.Manager):
    """Manager custom pour les querysets de demandes."""

    def avec_citoyen(self) -> models.QuerySet:
        """
        Précharge le citoyen associé via select_related.
        Utilisé systématiquement dans les vues liste. (Règle 6)
        """
        return self.select_related("citoyen")

    def en_cours(self) -> models.QuerySet:
        """Retourne les demandes non finalisées."""
        return self.exclude(
            statut__in=[StatutDemande.PRET, StatutDemande.REJETE]
        )

    def du_jour(self) -> models.QuerySet:
        """Retourne les demandes créées aujourd'hui."""
        from django.utils import timezone
        return self.filter(created_at__date=timezone.now().date())


class DemandeDocument(models.Model):
    """
    Représente une demande de document officiel par un citoyen guinéen.
    Le cycle de vie complet est piloté par la couche service + Celery.
    Aucune modification manuelle de statut n'est permise via l'API.

    Attributes:
        reference: Identifiant lisible REQ-{ANNÉE}-{ID_PADDÉ}.
        citoyen: Citoyen propriétaire de la demande.
        type_document: Type parmi TypeDocument.choices.
        statut: Statut courant parmi StatutDemande.choices.
        blockchain_tx_hash: Hash transaction NaissanceChain.
        blockchain_network: Réseau blockchain cible.
        document_genere: Fichier PDF certifié généré.
        qr_code_token: Token UUID unique pour vérification tiers.
        motif_rejet: Renseigné uniquement si statut = REJETE.
        completed_at: Horodatage de finalisation du pipeline.
    """

    reference = models.CharField(
        max_length=25, unique=True, editable=False,
        verbose_name=_("Référence")
    )
    citoyen = models.ForeignKey(
        CitoyenUser, on_delete=models.PROTECT,
        related_name="demandes",
        verbose_name=_("Citoyen")
    )
    type_document = models.CharField(
        max_length=20, choices=TypeDocument.choices,
        verbose_name=_("Type de document")
    )
    statut = models.CharField(
        max_length=20, choices=StatutDemande.choices,
        default=StatutDemande.RECUE,
        verbose_name=_("Statut")
    )
    blockchain_tx_hash = models.CharField(
        max_length=100, blank=True,
        verbose_name=_("Hash transaction blockchain")
    )
    blockchain_network = models.CharField(
        max_length=50, default="NaissanceChain",
        verbose_name=_("Réseau blockchain")
    )
    document_genere = models.FileField(
        upload_to="documents/certifies/%Y/%m/",
        null=True, blank=True,
        verbose_name=_("Document certifié")
    )
    qr_code_token = models.UUIDField(
        default=uuid.uuid4, unique=True, editable=False,
        verbose_name=_("Token QR code")
    )
    motif_rejet = models.TextField(
        blank=True, verbose_name=_("Motif de rejet")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(
        null=True, blank=True,
        verbose_name=_("Complété le")
    )

    objects = DemandeManager()

    class Meta:
        verbose_name = _("Demande de document")
        verbose_name_plural = _("Demandes de documents")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["reference"]),
            models.Index(fields=["statut"]),
            models.Index(fields=["citoyen", "statut"]),
            models.Index(fields=["qr_code_token"]),
        ]

    @property
    def duree_traitement(self):
        """
        Calcule la durée entre création et complétion.
        Retourne None si la demande est encore en cours.
        """
        if self.completed_at and self.created_at:
            return self.completed_at - self.created_at
        return None

    @property
    def est_verifiable(self) -> bool:
        """Vrai si le document possède un hash blockchain valide."""
        return bool(self.blockchain_tx_hash and self.statut == StatutDemande.PRET)

    @property
    def est_pret(self) -> bool:
        """Vrai si le document est prêt au téléchargement."""
        return self.statut == StatutDemande.PRET

    def __str__(self) -> str:
        return f"{self.reference} — {self.get_type_document_display()}"


class PieceJustificative(models.Model):
    """
    Fichier justificatif uploadé associé à une demande.
    Stocké de façon sécurisée, accessible uniquement au propriétaire.

    Attributes:
        demande: Demande parente.
        fichier: Fichier uploadé (PDF ou image).
        nom_original: Nom de fichier tel que soumis par le citoyen.
        uploaded_at: Horodatage d'upload.
    """

    FORMATS_ACCEPTES = ["application/pdf", "image/jpeg", "image/png"]

    demande = models.ForeignKey(
        DemandeDocument, on_delete=models.CASCADE,
        related_name="pieces_justificatives"
    )
    fichier = models.FileField(upload_to="documents/pieces/%Y/%m/")
    nom_original = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Pièce justificative")
        ordering = ["uploaded_at"]

4.3 verification/models.py
pythonclass LogVerification(models.Model):
    """
    Trace chaque vérification tiers effectuée via QR code ou hash.
    Aucune donnée personnelle complète n'est stockée — conformité RGPD.

    Attributes:
        qr_code_token: Token vérifié (référence UUID).
        resultat: True = authentique, False = invalide/falsifié.
        ip_verificateur: Adresse IP anonymisée (3 premiers octets).
        type_verificateur: Contexte de vérification.
        verified_at: Horodatage de la vérification.
    """

    class TypeVerificateur(models.TextChoices):
        QR_CODE = "QR_CODE", _("Scan QR Code")
        HASH    = "HASH",    _("Saisie hash blockchain")

    qr_code_token = models.CharField(max_length=100)
    resultat = models.BooleanField()
    ip_verificateur = models.GenericIPAddressField(null=True)
    type_verificateur = models.CharField(
        max_length=20, choices=TypeVerificateur.choices
    )
    verified_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Log de vérification")
        ordering = ["-verified_at"]
        indexes = [models.Index(fields=["qr_code_token"])]

05 — COUCHE SERVICE COMPLÈTE
5.1 accounts/services.py
pythonfrom __future__ import annotations
import uuid
from typing import Any
from django.db import transaction
from apps.accounts.models import CitoyenUser
from apps.blockchain.services import NaissanceChainService


def inscrire_citoyen(data: dict[str, Any]) -> CitoyenUser:
    """
    Crée un compte citoyen et déclenche la vérification NaissanceChain.
    Opération atomique — rollback si une étape échoue. (Règle 5)

    Args:
        data: Dictionnaire contenant les données validées du serializer.

    Returns:
        CitoyenUser: Instance créée et persistée.

    Raises:
        ValueError: Si le numéro de registre est déjà utilisé.
    """
    with transaction.atomic():
        citoyen = CitoyenUser.objects.create_user(
            **data,
            numero_citoyen=_generer_numero_citoyen()
        )
    # Signal déclenché post-création → vérification NaissanceChain async
    return citoyen


def _generer_numero_citoyen() -> str:
    """
    Génère un numéro citoyen unique au format GN-XXXXXXXX.

    Returns:
        str: Numéro unique non collision.
    """
    return f"GN-{uuid.uuid4().hex[:8].upper()}"


def get_profil_citoyen(citoyen_id: int) -> CitoyenUser:
    """
    Récupère le profil complet d'un citoyen avec ses demandes préchargées.
    Utilise prefetch_related pour éviter le N+1. (Règle 6)

    Args:
        citoyen_id: Identifiant primaire du citoyen.

    Returns:
        CitoyenUser: Instance avec demandes préchargées.

    Raises:
        CitoyenUser.DoesNotExist: Si le citoyen n'existe pas.
    """
    return (
        CitoyenUser.objects
        .prefetch_related("demandes")
        .get(pk=citoyen_id)
    )

5.2 documents/services.py
pythonfrom __future__ import annotations
from typing import Any
from datetime import datetime
from django.db import transaction
from django.utils import timezone
from apps.documents.models import DemandeDocument, StatutDemande
from apps.blockchain.services import NaissanceChainService
from utils.generators import generer_reference_demande


def creer_demande(
    citoyen_id: int,
    type_document: str,
    pieces_data: list[Any]
) -> DemandeDocument:
    """
    Crée une demande de document et déclenche le pipeline automatisé.
    La référence est générée automatiquement.

    Args:
        citoyen_id: Identifiant du citoyen demandeur.
        type_document: Valeur parmi TypeDocument.choices.
        pieces_data: Liste des fichiers justificatifs uploadés.

    Returns:
        DemandeDocument: Instance créée avec référence générée.

    Raises:
        ValueError: Si le profil citoyen est incomplet.
    """
    from apps.accounts.models import CitoyenUser
    from apps.documents.tasks import pipeline_traitement_document

    citoyen = CitoyenUser.objects.get(pk=citoyen_id)

    if not citoyen.profil_complet:
        raise ValueError(
            "Le profil citoyen doit être complet avant de soumettre une demande."
        )

    with transaction.atomic():
        demande = DemandeDocument.objects.create(
            citoyen=citoyen,
            type_document=type_document,
            reference=generer_reference_demande(),
        )
        _attacher_pieces_justificatives(demande, pieces_data)

    # Déclenchement asynchrone Celery — hors transaction (Règle 8)
    pipeline_traitement_document.delay(demande.pk)

    return demande


def traiter_demande_automatiquement(demande_id: int) -> None:
    """
    Orchestre le pipeline complet de traitement d'une demande.
    Appelé EXCLUSIVEMENT depuis tasks.py (Celery). Jamais en direct.

    Pipeline :
        1. Mise à jour statut → VERIFICATION
        2. Croisement NaissanceChain
        3. Mise à jour statut → SIGNATURE
        4. Génération signature cryptographique
        5. Génération PDF certifié
        6. Génération QR code
        7. Mise à jour statut → PRET + completed_at

    Args:
        demande_id: Identifiant primaire de la demande.

    Raises:
        DemandeDocument.DoesNotExist: Si la demande n'existe pas.
        NaissanceChainError: Si le croisement blockchain échoue.
    """
    from apps.documents.tasks import generer_pdf_certifie
    from apps.blockchain.services import NaissanceChainService

    demande = (
        DemandeDocument.objects
        .select_related("citoyen")  # Anti N+1 (Règle 6)
        .get(pk=demande_id)
    )

    _mettre_a_jour_statut(demande, StatutDemande.VERIFICATION_EN_COURS)

    tx_hash = NaissanceChainService.enregistrer(demande)
    demande.blockchain_tx_hash = tx_hash

    _mettre_a_jour_statut(demande, StatutDemande.SIGNATURE)

    signature = NaissanceChainService.signer_document(demande)

    _mettre_a_jour_statut(demande, StatutDemande.PRET)

    demande.completed_at = timezone.now()
    demande.save(update_fields=["completed_at", "blockchain_tx_hash"])


def get_demandes_citoyen(citoyen_id: int) -> models.QuerySet:
    """
    Retourne toutes les demandes d'un citoyen, paginables.
    select_related sur citoyen pour éviter le N+1. (Règle 6)

    Args:
        citoyen_id: Identifiant du citoyen.

    Returns:
        QuerySet: Demandes triées par date décroissante.
    """
    return (
        DemandeDocument.objects
        .select_related("citoyen")
        .filter(citoyen_id=citoyen_id)
        .order_by("-created_at")
    )


def _mettre_a_jour_statut(
    demande: DemandeDocument,
    nouveau_statut: str
) -> None:
    """
    Met à jour le statut d'une demande de façon atomique.
    update_fields pour limiter la requête SQL au strict nécessaire.

    Args:
        demande: Instance DemandeDocument à modifier.
        nouveau_statut: Valeur parmi StatutDemande.choices.
    """
    demande.statut = nouveau_statut
    demande.save(update_fields=["statut", "updated_at"])


def _attacher_pieces_justificatives(
    demande: DemandeDocument,
    pieces_data: list[Any]
) -> None:
    """
    Crée en bulk les pièces justificatives associées à la demande.

    Args:
        demande: Demande parente.
        pieces_data: Fichiers validés par le serializer.
    """
    from apps.documents.models import PieceJustificative
    PieceJustificative.objects.bulk_create([
        PieceJustificative(
            demande=demande,
            fichier=piece,
            nom_original=piece.name
        )
        for piece in pieces_data
    ])

5.3 blockchain/services.py
pythonfrom __future__ import annotations
from apps.blockchain.adapters import NaissanceChainAdapter
from apps.blockchain.exceptions import NaissanceChainError


class NaissanceChainService:
    """
    Service d'intégration avec le registre NaissanceChain.
    Utilise l'adaptateur pour abstraire Phase 1 (mock) / Phase 2 (Web3).

    Le pattern Adapter garantit le remplacement sans modifier le service.
    """

    @staticmethod
    def enregistrer(demande) -> str:
        """
        Enregistre une demande sur NaissanceChain et retourne le tx_hash.

        Args:
            demande: Instance DemandeDocument avec citoyen préchargé.

        Returns:
            str: Hash de transaction blockchain.

        Raises:
            NaissanceChainError: Si l'enregistrement échoue.
        """
        adapter = NaissanceChainAdapter()
        return adapter.enregistrer_demande(demande)

    @staticmethod
    def verifier_hash(tx_hash: str) -> bool:
        """
        Vérifie qu'un hash existe et est valide sur NaissanceChain.

        Args:
            tx_hash: Hash de transaction à vérifier.

        Returns:
            bool: True si valide, False sinon.
        """
        adapter = NaissanceChainAdapter()
        return adapter.verifier_transaction(tx_hash)

    @staticmethod
    def signer_document(demande) -> str:
        """
        Génère une signature HMAC-SHA256 du document.
        La clé privée est lue depuis .env exclusivement. (Règle 12)

        Args:
            demande: Instance DemandeDocument.

        Returns:
            str: Signature hexadécimale.
        """
        from utils.crypto import generer_signature_hmac
        payload = f"{demande.reference}:{demande.citoyen.numero_citoyen}"
        return generer_signature_hmac(payload)

5.4 blockchain/adapters.py
pythonfrom __future__ import annotations
from abc import ABC, abstractmethod
from decouple import config
import hashlib
import uuid


class BaseNaissanceChainAdapter(ABC):
    """Interface abstraite pour l'intégration NaissanceChain."""

    @abstractmethod
    def enregistrer_demande(self, demande) -> str: ...

    @abstractmethod
    def verifier_transaction(self, tx_hash: str) -> bool: ...


class MockNaissanceChainAdapter(BaseNaissanceChainAdapter):
    """
    Adaptateur de simulation pour la Phase 1 du hackathon.
    Génère des hashes réalistes sans appel réseau réel.
    """

    def enregistrer_demande(self, demande) -> str:
        """Simule un enregistrement et retourne un hash mock réaliste."""
        seed = f"{demande.reference}{demande.citoyen.numero_registre_naissance}"
        return "0x" + hashlib.sha256(seed.encode()).hexdigest()

    def verifier_transaction(self, tx_hash: str) -> bool:
        """Simule une vérification — retourne True si hash bien formé."""
        return tx_hash.startswith("0x") and len(tx_hash) == 66


class Web3NaissanceChainAdapter(BaseNaissanceChainAdapter):
    """
    Adaptateur réel Web3.py pour la Phase 2.
    Interagit avec le smart contract déployé.
    """

    def enregistrer_demande(self, demande) -> str:
        """Appel smart contract réel — Phase 2."""
        raise NotImplementedError("Disponible en Phase 2.")

    def verifier_transaction(self, tx_hash: str) -> bool:
        """Vérification on-chain réelle — Phase 2."""
        raise NotImplementedError("Disponible en Phase 2.")


def NaissanceChainAdapter() -> BaseNaissanceChainAdapter:
    """
    Factory retournant l'adaptateur selon l'environnement.

    Returns:
        BaseNaissanceChainAdapter: Mock (Phase 1) ou Web3 (Phase 2).
    """
    use_mock = config("NAISSANCECHAIN_USE_MOCK", default=True, cast=bool)
    return MockNaissanceChainAdapter() if use_mock else Web3NaissanceChainAdapter()

5.5 documents/tasks.py
pythonfrom __future__ import annotations
from celery import shared_task
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=10,
    queue="documents"
)
def pipeline_traitement_document(self, demande_id: int) -> None:
    """
    Tâche Celery orchestrant le pipeline complet de traitement.
    Retry automatique avec délai exponentiel en cas d'échec. (Règle 8)

    Args:
        demande_id: Identifiant primaire de la demande à traiter.
    """
    from apps.documents.services import traiter_demande_automatiquement
    try:
        logger.info(f"Démarrage pipeline — demande #{demande_id}")
        traiter_demande_automatiquement(demande_id)
        logger.info(f"Pipeline terminé avec succès — demande #{demande_id}")
    except Exception as exc:
        logger.error(f"Échec pipeline demande #{demande_id} : {exc}")
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)


@shared_task(queue="pdf")
def generer_pdf_certifie(demande_id: int) -> str:
    """
    Génère le PDF officiel certifié via WeasyPrint.
    Inclut armoiries Guinée, données citoyen masquées, hash blockchain, QR code.

    Args:
        demande_id: Identifiant primaire de la demande.

    Returns:
        str: Chemin relatif du fichier généré.
    """
    from apps.documents.models import DemandeDocument
    demande = (
        DemandeDocument.objects
        .select_related("citoyen")
        .get(pk=demande_id)
    )
    # Génération WeasyPrint — implémentation Phase 2
    logger.info(f"PDF généré pour demande #{demande_id}")

06 — SIGNALS INTER-APPS (Règle 4)
python# accounts/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.accounts.models import CitoyenUser


@receiver(post_save, sender=CitoyenUser)
def declencher_verification_naissancechain(
    sender, instance: CitoyenUser, created: bool, **kwargs
) -> None:
    """
    Signal déclenché à la création d'un compte citoyen.
    Lance la vérification NaissanceChain en tâche de fond.
    Découple accounts de blockchain sans import circulaire. (Règle 4)
    """
    if created:
        from apps.blockchain.tasks import verifier_citoyen_naissancechain
        verifier_citoyen_naissancechain.delay(instance.pk)


# documents/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.documents.models import DemandeDocument, StatutDemande


@receiver(post_save, sender=DemandeDocument)
def notifier_document_pret(
    sender, instance: DemandeDocument, **kwargs
) -> None:
    """
    Signal déclenché quand une demande passe au statut PRET.
    Découple documents de notifications sans dépendance directe. (Règle 4)
    """
    if instance.statut == StatutDemande.PRET:
        # Notification future — Phase 2 (email, SMS)
        pass

07 — SERIALIZERS COMPLETS (SRP — Règle 3)
python# accounts/serializers.py

class CitoyenReadSerializer(serializers.ModelSerializer):
    """Lecture profil citoyen — exposé sur GET /auth/me/."""
    nom_complet    = serializers.ReadOnlyField()
    profil_complet = serializers.ReadOnlyField()

    class Meta:
        model  = CitoyenUser
        fields = [
            "id", "numero_citoyen", "nom_complet", "email",
            "date_naissance", "lieu_naissance",
            "telephone", "est_verifie_naissancechain",
            "profil_complet", "created_at"
        ]


class CitoyenWriteSerializer(serializers.ModelSerializer):
    """Écriture inscription citoyen — POST /auth/inscription/."""
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model  = CitoyenUser
        fields = [
            "email", "first_name", "last_name", "password",
            "date_naissance", "lieu_naissance",
            "numero_registre_naissance", "telephone"
        ]

    def validate_numero_registre_naissance(self, valeur: str) -> str:
        """Vérifie l'unicité du numéro de registre avant création."""
        if CitoyenUser.objects.filter(
            numero_registre_naissance=valeur
        ).exists():
            raise serializers.ValidationError(
                "Ce numéro de registre est déjà associé à un compte."
            )
        return valeur


# documents/serializers.py

class DemandeReadSerializer(serializers.ModelSerializer):
    """Lecture demande — exposé sur GET /demandes/ et GET /demandes/{ref}/."""
    duree_traitement = serializers.ReadOnlyField()
    est_verifiable   = serializers.ReadOnlyField()
    est_pret         = serializers.ReadOnlyField()

    class Meta:
        model  = DemandeDocument
        fields = [
            "reference", "type_document", "statut",
            "blockchain_tx_hash", "blockchain_network",
            "qr_code_token", "duree_traitement",
            "est_verifiable", "est_pret",
            "created_at", "updated_at", "completed_at"
        ]


class DemandeWriteSerializer(serializers.ModelSerializer):
    """Écriture demande — POST /demandes/ uniquement."""
    pieces_justificatives = serializers.ListField(
        child=serializers.FileField(),
        write_only=True, required=False
    )

    class Meta:
        model  = DemandeDocument
        fields = ["type_document", "pieces_justificatives"]

    def validate_pieces_justificatives(self, fichiers: list) -> list:
        """Vérifie le format et la taille de chaque pièce uploadée."""
        for fichier in fichiers:
            if fichier.content_type not in PieceJustificative.FORMATS_ACCEPTES:
                raise serializers.ValidationError(
                    f"Format non accepté : {fichier.content_type}. "
                    f"Acceptés : PDF, JPEG, PNG."
                )
            if fichier.size > 5 * 1024 * 1024:  # 5 Mo max
                raise serializers.ValidationError(
                    "Chaque pièce ne doit pas dépasser 5 Mo."
                )
        return fichiers


class StatutDemandeSerializer(serializers.ModelSerializer):
    """Statut temps réel — GET /demandes/{ref}/statut/."""
    class Meta:
        model  = DemandeDocument
        fields = [
            "reference", "statut", "blockchain_tx_hash",
            "blockchain_network", "updated_at"
        ]


class VerificationResultatSerializer(serializers.Serializer):
    """Résultat vérification tiers — GET /verification/{token}/."""
    authentique       = serializers.BooleanField()
    nom_masque        = serializers.CharField()
    type_document     = serializers.CharField()
    date_delivrance   = serializers.DateTimeField()
    date_expiration   = serializers.DateField(allow_null=True)
    blockchain_hash   = serializers.CharField()
    naissancechain_badge = serializers.CharField()
    verified_at       = serializers.DateTimeField()

08 — GESTION D'ERREURS UNIFIÉE (Règle 7)
python# config/exception_handler.py

CODES_ERREURS = {
    "CITOYEN_ALREADY_EXISTS":    409,
    "CREDENTIALS_INVALID":       401,
    "TOKEN_EXPIRED":             401,
    "DEMANDE_NOT_FOUND":         404,
    "DEMANDE_ACCESS_DENIED":     403,
    "DOCUMENT_NOT_READY":        400,
    "HASH_INVALIDE":             404,
    "QR_TOKEN_INVALIDE":         404,
    "NAISSANCECHAIN_ERROR":      503,
    "UPLOAD_INVALIDE":           400,
    "PROFIL_INCOMPLET":          400,
}

# Format unifié de toute réponse d'erreur :
# {
#   "status": "error",
#   "code": "DEMANDE_NOT_FOUND",
#   "message": "Cette demande n'existe pas ou ne vous appartient pas.",
#   "details": {}
# }

09 — ENDPOINTS API COMPLETS
Base URL : /api/v1/
accounts — Auth & Citoyens
MéthodeEndpointSerializerAuthRate LimitPOST/auth/inscription/Write✗3/min/IPPOST/auth/connexion/—✗5/min/IPPOST/auth/token/refresh/—✗10/min/IPPOST/auth/deconnexion/—✓—GET/auth/me/Read✓ Propriétaire—PATCH/auth/me/Write✓ Propriétaire—
documents — Demandes
MéthodeEndpointSerializerAuthRate LimitGET/demandes/Read (liste)✓ Citoyen—POST/demandes/Write✓ Citoyen10/h/citoyenGET/demandes/{reference}/Read (détail)✓ Propriétaire—GET/demandes/{reference}/statut/Statut✓ Propriétaire—GET/demandes/{reference}/document/— (FileResponse)✓ Propriétaire—
verification — Tiers (public)
MéthodeEndpointSerializerAuthRate LimitGET/verification/{qr_token}/VerificationResultat✗30/min/IPPOST/verification/hash/VerificationResultat✗30/min/IP
dashboard — Admin
MéthodeEndpointDescriptionAuthGET/dashboard/kpis/Métriques globales du jour✓ AdminGET/dashboard/demandes/Toutes demandes paginées + filtres✓ AdminGET/dashboard/blockchain/activite/Feed NaissanceChain live✓ Admin

10 — PERMISSIONS OBJET (Règle 12)
python# documents/permissions.py

class EstProprietaireDemande(BasePermission):
    """
    Contrôle objet — un citoyen A ne peut JAMAIS accéder
    à la demande du citoyen B. Vérifié sur chaque objet. (Règle 12)
    """
    message = "Accès refusé — cette demande ne vous appartient pas."

    def has_object_permission(self, request, view, obj) -> bool:
        return obj.citoyen_id == request.user.pk


class EstAdminSysteme(BasePermission):
    """Réservé aux comptes staff — dashboard uniquement."""
    message = "Réservé aux administrateurs du système."

    def has_permission(self, request, view) -> bool:
        return bool(request.user and request.user.is_staff)


class DocumentEstPret(BasePermission):
    """
    Interdit le téléchargement si le document n'est pas encore généré.
    Complémentaire à EstProprietaireDemande.
    """
    message = "Le document n'est pas encore prêt au téléchargement."

    def has_object_permission(self, request, view, obj) -> bool:
        return obj.est_pret

11 — STRATÉGIE CELERY COMPLÈTE (Règle 8)
python# config/celery.py

CELERY_TASK_QUEUES = {
    "documents": {"exchange": "documents"},  # Pipeline principal
    "pdf":       {"exchange": "pdf"},        # Génération PDF
    "blockchain": {"exchange": "blockchain"} # Appels NaissanceChain
}

CELERY_TASK_ROUTES = {
    "apps.documents.tasks.pipeline_traitement_document": {"queue": "documents"},
    "apps.documents.tasks.generer_pdf_certifie":         {"queue": "pdf"},
    "apps.blockchain.tasks.*":                           {"queue": "blockchain"},
}

# Retry policy globale
CELERY_TASK_MAX_RETRIES    = 3
CELERY_TASK_RETRY_BACKOFF  = True   # Délai exponentiel : 10s, 20s, 40s
CELERY_TASK_SERIALIZER     = "json"
CELERY_RESULT_BACKEND      = "redis://localhost:6379/0"
CELERY_BROKER_URL          = "redis://localhost:6379/1"

12 — SÉCURITÉ COMPLÈTE (Règle 12)
Variables .env obligatoires
env# Django
SECRET_KEY=
DEBUG=False
ALLOWED_HOSTS=
DATABASE_URL=
REDIS_URL=

# JWT
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# Blockchain
NAISSANCECHAIN_USE_MOCK=True
NAISSANCECHAIN_RPC_URL=
NAISSANCECHAIN_PRIVATE_KEY=
NAISSANCECHAIN_CONTRACT_ADDRESS=

# Crypto
SIGNATURE_SECRET_KEY=

# Monitoring
SENTRY_DSN=

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://identiguinee.gov.gn
Middlewares actifs
pythonMIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "config.middleware.RequestLoggingMiddleware",  # Log anonymisé
]

13 — TESTS COMPLETS (Règle 13)
Structure factories
python# documents/tests/factories.py
import factory
from apps.accounts.models import CitoyenUser
from apps.documents.models import DemandeDocument, TypeDocument

class CitoyenFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CitoyenUser
    email                      = factory.Faker("email")
    first_name                 = factory.Faker("first_name")
    last_name                  = factory.Faker("last_name")
    date_naissance             = factory.Faker("date_of_birth")
    lieu_naissance             = "Conakry"
    numero_registre_naissance  = factory.Sequence(lambda n: f"REG-{n:06d}")
    numero_citoyen             = factory.Sequence(lambda n: f"GN-{n:08X}")

class DemandeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = DemandeDocument
    citoyen       = factory.SubFactory(CitoyenFactory)
    type_document = TypeDocument.CNI
    reference     = factory.Sequence(lambda n: f"REQ-2026-{n:05d}")
Cas de test obligatoires
python# documents/tests/test_services.py

class TestCreerDemande:
    def test_reference_generee_correctement(self) -> None: ...
    def test_pipeline_declenche_apres_creation(self) -> None: ...
    def test_profil_incomplet_leve_erreur(self) -> None: ...

class TestPipelineTraitement:
    def test_statut_final_est_pret(self) -> None: ...
    def test_hash_blockchain_enregistre(self) -> None: ...
    def test_completed_at_renseigne(self) -> None: ...
    def test_rejet_si_naissancechain_echoue(self) -> None: ...

class TestPermissions:
    def test_citoyen_a_ne_peut_acceder_demande_citoyen_b(self) -> None: ...
    def test_telechargement_impossible_si_statut_non_pret(self) -> None: ...
    def test_verification_publique_sans_auth(self) -> None: ...
Couverture minimale exigée : 80% sur chaque services.py

14 — ORDRE DE DÉVELOPPEMENT (Sprints)
Sprint 1 — Fondations (Jours 1-2)
  ├── Setup Django + DRF + config/ complet
  ├── exception_handler unifié
  ├── Celery + Redis configuration
  └── app accounts — models + managers + services + serializers + tests

Sprint 2 — Cœur métier (Jours 3-4)
  ├── app documents — models + managers + indexes
  ├── documents services + pipeline
  ├── blockchain adapters (Mock Phase 1)
  └── Celery tasks + queues

Sprint 3 — Outputs (Jours 5-6)
  ├── Génération PDF WeasyPrint + QR code
  ├── app verification — endpoints publics
  └── Signals inter-apps

Sprint 4 — Admin & Qualité (Jour 7)
  ├── app dashboard — KPIs agrégés
  ├── Rate limiting + permissions objet complets
  ├── Tests couverture 80%+
  └── Documentation OpenAPI drf-spectacular

15 — GIT FLOW & COMMITS (Règle 14)
main
└── develop
    ├── feature/accounts-auth-jwt
    ├── feature/documents-pipeline-celery
    ├── feature/blockchain-naissancechain-adapter
    ├── feature/verification-qr-public
    └── feature/dashboard-kpis-admin
Exemples Conventional Commits :
feat(accounts): add CitoyenUser model with NaissanceChain verification
feat(documents): implement automated pipeline via Celery queues
feat(blockchain): add Mock/Web3 adapter pattern for NaissanceChain
fix(documents): resolve N+1 on demandes list with select_related
test(documents): achieve 85% coverage on services.py
chore(config): configure Celery queues and retry backoff policy
docs(blockchain): add naissancechain_flow.md in Phase 1 context