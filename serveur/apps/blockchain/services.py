from __future__ import annotations
from apps.blockchain.adapters import NaissanceChainAdapter


class NaissanceChainService:
    """
    Service d'intégration avec le registre NaissanceChain.
    Utilise l'adaptateur pour abstraire Phase 1 (mock) / Phase 2 (Web3).
    """

    @staticmethod
    def enregistrer(demande) -> str:
        """
        Enregistre une demande sur NaissanceChain et retourne le tx_hash.
        """
        adapter = NaissanceChainAdapter()
        return adapter.enregistrer_demande(demande)

    @staticmethod
    def verifier_hash(tx_hash: str) -> bool:
        """
        Vérifie qu'un hash existe et est valide sur NaissanceChain.
        """
        adapter = NaissanceChainAdapter()
        return adapter.verifier_transaction(tx_hash)

    @staticmethod
    def signer_document(demande) -> str:
        """
        Génère une signature HMAC-SHA256 du document.
        """
        from utils.crypto import generer_signature_hmac
        payload = f"{demande.reference}:{demande.citoyen.numero_citoyen}"
        return generer_signature_hmac(payload)
