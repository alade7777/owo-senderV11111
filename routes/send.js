const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Chemin vers le fichier de stockage
const dataFile = path.join(__dirname, '..', 'transferts.json');

// Fonctions utilitaires
function readData() {
    try {
        if (!fs.existsSync(dataFile)) {
            return [];
        }
        return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (error) {
        console.error('Erreur de lecture:', error);
        return [];
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Erreur d\'écriture:', error);
        return false;
    }
}

// Créer une nouvelle demande
router.post('/', (req, res) => {
    try {
        // Validation des données requises
        const requiredFields = ['pays', 'montant', 'total', 'operateur', 'numero', 'nom', 'envoyeurNom', 'envoyeurNumero'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: 'Champs manquants', 
                fields: missingFields 
            });
        }

        const requests = readData();
        const newRequest = {
            id: Date.now().toString(),
            ...req.body,
            statut: 'En attente',
            date: new Date().toISOString()
        };
        
        if (writeData([...requests, newRequest])) {
            res.status(201).json({ 
                message: 'Transfert enregistré avec succès', 
                request: newRequest 
            });
        } else {
            throw new Error('Erreur lors de l\'enregistrement');
        }
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            message: 'Une erreur est survenue. Veuillez réessayer.' 
        });
    }
});

// Obtenir toutes les demandes (pour l'admin)
router.get('/all', (req, res) => {
    try {
        const requests = readData();
        res.json(requests);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            message: 'Une erreur est survenue lors de la récupération des transferts.' 
        });
    }
});

// Mettre à jour le statut
router.patch('/update/:index', (req, res) => {
    try {
        const requests = readData();
        const index = parseInt(req.params.index);
        
        if (isNaN(index) || index < 0 || index >= requests.length) {
            return res.status(404).json({ 
                message: 'Transfert non trouvé' 
            });
        }
        
        requests[index].statut = req.body.statut;
        
        if (writeData(requests)) {
            res.json({ 
                message: 'Statut mis à jour', 
                request: requests[index] 
            });
        } else {
            throw new Error('Erreur lors de la mise à jour');
        }
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            message: 'Une erreur est survenue. Veuillez réessayer.' 
        });
    }
});

// Supprimer un transfert
router.delete('/delete/:index', (req, res) => {
    try {
        const requests = readData();
        const index = parseInt(req.params.index);
        
        if (isNaN(index) || index < 0 || index >= requests.length) {
            return res.status(404).json({ 
                message: 'Transfert non trouvé' 
            });
        }
        
        requests.splice(index, 1);
        
        if (writeData(requests)) {
            res.json({ 
                message: 'Transfert supprimé avec succès' 
            });
        } else {
            throw new Error('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            message: 'Une erreur est survenue. Veuillez réessayer.' 
        });
    }
});

module.exports = router; 