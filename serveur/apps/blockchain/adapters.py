from __future__ import annotations
from abc import ABC, abstractmethod
from decouple import config
import hashlib


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
        # On crée un grain de sel unique pour le hash
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
        raise NotImplementedError("Disponible en Phase 2 (Requiert configuration RPC).")

    def verifier_transaction(self, tx_hash: str) -> bool:
        """Vérification on-chain réelle — Phase 2."""
        raise NotImplementedError("Disponible en Phase 2 (Requiert configuration RPC).")


def NaissanceChainAdapter() -> BaseNaissanceChainAdapter:
    """
    Factory retournant l'adaptateur selon l'environnement.
    """
    use_mock = config("NAISSANCECHAIN_USE_MOCK", default=True, cast=bool)
    return MockNaissanceChainAdapter() if use_mock else Web3NaissanceChainAdapter()
