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
    Adaptateur rel Web3.py pour la Phase 2.
    Interagit avec le smart contract dploy.
    """
    def __init__(self):
        from web3 import Web3
        import json
        import os
        
        self.w3 = Web3(Web3.HTTPProvider(config("NAISSANCECHAIN_RPC_URL")))
        self.private_key = config("NAISSANCECHAIN_PRIVATE_KEY")
        self.contract_address = config("NAISSANCECHAIN_CONTRACT_ADDRESS")
        self.account = self.w3.eth.account.from_key(self.private_key)
        
        # Chargement de l'ABI
        path = os.path.join(os.path.dirname(__file__), "contract_info.json")
        if not os.path.exists(path):
             # Fallback si le fichier n'est pas au bon endroit
             path = os.path.join(os.path.dirname(__file__), "scripts/../contract_info.json")
             
        with open(path, "r") as f:
            data = json.load(f)
            self.abi = data["abi"]
            
        self.contract = self.w3.eth.contract(address=self.contract_address, abi=self.abi)

    def enregistrer_demande(self, demande) -> str:
        """Appel smart contract rel."""
        doc_hash = demande.hash_blockchain or f"MOCK_{demande.reference}"
        metadata = f"ID:{demande.citoyen.numero_citoyen}|REF:{demande.reference}"
        
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        # Build transaction
        tx = self.contract.functions.recordNaissance(
            doc_hash, metadata
        ).build_transaction({
            "chainId": 80002,
            "from": self.account.address,
            "nonce": nonce,
            "gasPrice": self.w3.eth.gas_price
        })
        
        # Sign and send
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        # On attend pas la confirmation pour ne pas bloquer le serveur
        # Le hash est suffisant pour le suivi
        return tx_hash.hex()

    def verifier_transaction(self, tx_hash: str) -> bool:
        """Vrification on-chain relle."""
        try:
            receipt = self.w3.eth.get_transaction_receipt(tx_hash)
            return receipt is not None and receipt.status == 1
        except:
            return False


def NaissanceChainAdapter() -> BaseNaissanceChainAdapter:
    """
    Factory retournant l'adaptateur selon l'environnement.
    """
    use_mock = config("NAISSANCECHAIN_USE_MOCK", default=True, cast=bool)
    return MockNaissanceChainAdapter() if use_mock else Web3NaissanceChainAdapter()
