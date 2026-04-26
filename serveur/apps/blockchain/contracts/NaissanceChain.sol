// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NaissanceChain
 * @dev Service de certification d'actes de naissance pour IdentiGuinée.
 */
contract NaissanceChain {
    struct NaissanceRecord {
        uint256 timestamp;
        string metadata;
        bool exists;
    }

    mapping(string => NaissanceRecord) private records;
    address public owner;

    event NaissanceRecorded(string indexed docHash, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Enregistre l'empreinte (hash) d'un acte de naissance.
     * @param docHash Le hash SHA-256 du document PDF.
     * @param metadata Informations complémentaires (optionnel).
     */
    function recordNaissance(string memory docHash, string memory metadata) public {
        require(!records[docHash].exists, "Document deja enregistre");
        
        records[docHash] = NaissanceRecord({
            timestamp: block.timestamp,
            metadata: metadata,
            exists: true
        });

        emit NaissanceRecorded(docHash, block.timestamp);
    }

    /**
     * @dev Verifie si un document est certifie.
     */
    function verifyNaissance(string memory docHash) public view returns (bool, uint256, string memory) {
        require(records[docHash].exists, "Document non trouve");
        NaissanceRecord memory record = records[docHash];
        return (true, record.timestamp, record.metadata);
    }
}
