const express = require('express');
const router = express.Router();
const Transfert = require('../models/Transfert');

// Créer une nouvelle demande
router.post('/', async (req, res) => {
    try {
        console.log('Nouvelle demande de transfert reçue:', req.body);
        
        // Validation des données requises
        const requiredFields = ['pays', 'montant', 'total', 'operateur', 'numero', 'nom', 'envoyeurNom', 'envoyeurNumero'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.log('Champs manquants:', missingFields);
            return res.status(400).json({ 
                message: 'Champs manquants', 
                fields: missingFields 
            });
        }

        const newTransfert = new Transfert({
            ...req.body,
            statut: 'En attente',
            date: new Date()
        });

        console.log('Tentative de sauvegarde du transfert:', newTransfert);
        const savedTransfert = await newTransfert.save();
        console.log('Transfert sauvegardé avec succès:', savedTransfert);
        
        res.status(201).json({ 
            message: 'Transfert enregistré avec succès', 
            request: savedTransfert 
        });
    } catch (error) {
        console.error('Erreur lors de la création du transfert:', error);
        res.status(500).json({ 
            message: 'Une erreur est survenue lors de l\'enregistrement du transfert',
            error: error.message
        });
    }
});

// Obtenir toutes les demandes (pour l'admin)
router.get('/all', async (req, res) => {
    try {
        console.log('Récupération de tous les transferts...');
        const transferts = await Transfert.find().sort({ date: -1 });
        console.log(`${transferts.length} transferts trouvés`);
        res.json(transferts);
    } catch (error) {
        console.error('Erreur lors de la récupération des transferts:', error);
        res.status(500).json({ 
            message: 'Une erreur est survenue lors de la récupération des transferts',
            error: error.message
        });
    }
});

// Mettre à jour le statut
router.patch('/update/:id', async (req, res) => {
    try {
        console.log(`Mise à jour du transfert ${req.params.id} avec le statut:`, req.body.statut);
        
        const transfert = await Transfert.findById(req.params.id);
        
        if (!transfert) {
            console.log('Transfert non trouvé:', req.params.id);
            return res.status(404).json({ 
                message: 'Transfert non trouvé' 
            });
        }
        
        transfert.statut = req.body.statut;
        const updatedTransfert = await transfert.save();
        console.log('Transfert mis à jour avec succès:', updatedTransfert);
        
        res.json({ 
            message: 'Statut mis à jour', 
            request: updatedTransfert 
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du transfert:', error);
        res.status(500).json({ 
            message: 'Une erreur est survenue lors de la mise à jour du statut',
            error: error.message
        });
    }
});

// Supprimer un transfert
router.delete('/delete/:id', async (req, res) => {
    try {
        console.log('Suppression du transfert:', req.params.id);
        
        const transfert = await Transfert.findByIdAndDelete(req.params.id);
        
        if (!transfert) {
            console.log('Transfert non trouvé pour suppression:', req.params.id);
            return res.status(404).json({ 
                message: 'Transfert non trouvé' 
            });
        }
        
        console.log('Transfert supprimé avec succès:', transfert);
        res.json({ 
            message: 'Transfert supprimé avec succès' 
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du transfert:', error);
        res.status(500).json({ 
            message: 'Une erreur est survenue lors de la suppression du transfert',
            error: error.message
        });
    }
});

module.exports = router; 