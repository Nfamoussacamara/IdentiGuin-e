import os
import sys
import json
from web3 import Web3
from solcx import compile_standard, install_solc
from decouple import config

# Configuration
RPC_URL = "https://rpc-amoy.polygon.technology"
CHAIN_ID = 80002 # Polygon Amoy Testnet

def deploy_contract():
    print("--- Déploiement NaissanceChain sur Polygon Amoy ---")
    
    # 1. Vérification de la clé privée
    private_key = config("NAISSANCECHAIN_PRIVATE_KEY", default=None)
    if not private_key:
        print("ERREUR : NAISSANCECHAIN_PRIVATE_KEY manquante dans le fichier .env")
        sys.exit(1)
        
    # 2. Compilation
    print("Compiling contract...")
    install_solc("0.8.20")
    
    contract_path = os.path.join(os.path.dirname(__file__), "../contracts/NaissanceChain.sol")
    with open(contract_path, "r") as file:
        contract_source = file.read()

    compiled_sol = compile_standard(
        {
            "language": "Solidity",
            "sources": {"NaissanceChain.sol": {"content": contract_source}},
            "settings": {
                "outputSelection": {
                    "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
                }
            },
        },
        solc_version="0.8.20",
    )

    # 3. Extraction ABI et Bytecode
    bytecode = compiled_sol["contracts"]["NaissanceChain.sol"]["NaissanceChain"]["evm"]["bytecode"]["object"]
    abi = compiled_sol["contracts"]["NaissanceChain.sol"]["NaissanceChain"]["abi"]

    # 4. Connexion Blockchain
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    account = w3.eth.account.from_key(private_key)
    print(f"Déploiement depuis l'adresse : {account.address}")

    # 5. Préparation de la transaction
    NaissanceChain = w3.eth.contract(abi=abi, bytecode=bytecode)
    nonce = w3.eth.get_transaction_count(account.address)

    transaction = NaissanceChain.constructor().build_transaction({
        "chainId": CHAIN_ID,
        "from": account.address,
        "nonce": nonce,
        "gasPrice": w3.eth.gas_price
    })

    # 6. Signature et Envoi
    signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)
    print("Envoi de la transaction de déploiement...")
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    
    print(f"Transaction envoyée ! Hash : {tx_hash.hex()}")
    print("Attente de la confirmation (cela peut prendre 30 secondes)...")
    
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"CONTRAT DÉPLOYÉ AVEC SUCCÈS !")
    print(f"Adresse du contrat : {tx_receipt.contractAddress}")
    
    # Sauvegarde de l'adresse et de l'ABI
    output_data = {
        "address": tx_receipt.contractAddress,
        "abi": abi
    }
    
    output_path = os.path.join(os.path.dirname(__file__), "../contract_info.json")
    with open(output_path, "w") as f:
        json.dump(output_data, f, indent=4)
        
    print(f"Détails du contrat sauvegardés dans {output_path}")

if __name__ == "__main__":
    deploy_contract()
