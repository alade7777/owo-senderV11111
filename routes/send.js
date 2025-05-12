const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Chemin vers le fichier de stockage
const dataFile = path.join(__dirname, '..', 'data', 'requests.json');

// Fonctions utilitaires
function readData() {
    if (!fs.existsSync(dataFile)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function writeData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Créer une nouvelle demande
router.post('/', (req, res) => {
    try {
        const requests = readData();
        const newRequest = {
            id: Date.now().toString(),
            ...req.body,
            status: 'en_attente',
            createdAt: new Date().toISOString()
        };
        
        requests.push(newRequest);
        writeData(requests);
        
        res.status(201).json({ message: 'Demande enregistrée avec succès', request: newRequest });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
    }
});

// Obtenir toutes les demandes (pour l'admin)
router.get('/all', (req, res) => {
    try {
        const requests = readData();
        res.json(requests);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: 'Erreur lors de la lecture' });
    }
});

// Obtenir les demandes d'un utilisateur
router.get('/user/:email', (req, res) => {
    try {
        const requests = readData();
        const userRequests = requests.filter(r => r.clientEmail === req.params.email);
        res.json(userRequests);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: 'Erreur lors de la lecture' });
    }
});

// Mettre à jour le statut
router.patch('/:id', (req, res) => {
    try {
        const requests = readData();
        const index = requests.findIndex(r => r.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        }
        
        requests[index] = {
            ...requests[index],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        
        writeData(requests);
        res.json({ message: 'Statut mis à jour', request: requests[index] });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
});

module.exports = router; 