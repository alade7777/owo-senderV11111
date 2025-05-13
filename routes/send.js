const express = require('express');
const router = express.Router();
const Transfert = require('../models/Transfert');

// Créer une nouvelle demande
router.post('/', async (req, res) => {
    try {
        console.log('=== NOUVELLE DEMANDE DE TRANSFERT ===');
        console.log('Headers:', req.headers);
        console.log('Body:', JSON.stringify(req.body, null, 2));
        
        // Validation des données requises
        const requiredFields = ['pays', 'montant', 'total', 'operateur', 'numero', 'nom', 'envoyeurNom', 'envoyeurNumero'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.log('❌ Champs manquants:', missingFields);
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

        console.log('📝 Tentative de sauvegarde du transfert:', JSON.stringify(newTransfert, null, 2));
        const savedTransfert = await newTransfert.save();
        console.log('✅ Transfert sauvegardé avec succès:', JSON.stringify(savedTransfert, null, 2));
        
        res.status(201).json({ 
            message: 'Transfert enregistré avec succès', 
            request: savedTransfert 
        });
    } catch (error) {
        console.error('❌ Erreur lors de la création du transfert:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            message: 'Une erreur est survenue lors de l\'enregistrement du transfert',
            error: error.message
        });
    }
});

// Obtenir toutes les demandes (pour l'admin)
router.get('/all', async (req, res) => {
    try {
        console.log('=== RÉCUPÉRATION DES TRANSFERTS ===');
        console.log('Headers:', req.headers);
        
        const transferts = await Transfert.find().sort({ date: -1 });
        console.log(`✅ ${transferts.length} transferts trouvés`);
        console.log('Transferts:', JSON.stringify(transferts, null, 2));
        
        res.json(transferts);
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des transferts:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            message: 'Une erreur est survenue lors de la récupération des transferts',
            error: error.message
        });
    }
});

// Mettre à jour le statut
router.patch('/update/:id', async (req, res) => {
    try {
        console.log('=== MISE À JOUR DU STATUT ===');
        console.log('ID:', req.params.id);
        console.log('Nouveau statut:', req.body.statut);
        
        const transfert = await Transfert.findById(req.params.id);
        
        if (!transfert) {
            console.log('❌ Transfert non trouvé:', req.params.id);
            return res.status(404).json({ 
                message: 'Transfert non trouvé' 
            });
        }
        
        transfert.statut = req.body.statut;
        const updatedTransfert = await transfert.save();
        console.log('✅ Transfert mis à jour avec succès:', JSON.stringify(updatedTransfert, null, 2));
        
        res.json({ 
            message: 'Statut mis à jour', 
            request: updatedTransfert 
        });
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour du transfert:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            message: 'Une erreur est survenue lors de la mise à jour du statut',
            error: error.message
        });
    }
});

// Supprimer un transfert
router.delete('/delete/:id', async (req, res) => {
    try {
        console.log('=== SUPPRESSION DE TRANSFERT ===');
        console.log('ID à supprimer:', req.params.id);
        
        const transfert = await Transfert.findByIdAndDelete(req.params.id);
        
        if (!transfert) {
            console.log('❌ Transfert non trouvé pour suppression:', req.params.id);
            return res.status(404).json({ 
                message: 'Transfert non trouvé' 
            });
        }
        
        console.log('✅ Transfert supprimé avec succès:', JSON.stringify(transfert, null, 2));
        res.json({ 
            message: 'Transfert supprimé avec succès' 
        });
    } catch (error) {
        console.error('❌ Erreur lors de la suppression du transfert:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            message: 'Une erreur est survenue lors de la suppression du transfert',
            error: error.message
        });
    }
});

module.exports = router; 