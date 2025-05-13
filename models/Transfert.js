const mongoose = require('mongoose');

const transfertSchema = new mongoose.Schema({
  pays: {
    type: String,
    required: true
  },
  montant: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  operateur: {
    type: String,
    required: true
  },
  numero: {
    type: String,
    required: true
  },
  nom: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  envoyeurNom: {
    type: String,
    required: true
  },
  envoyeurNumero: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  statut: {
    type: String,
    enum: ['En attente', 'Terminé', 'Annulé'],
    default: 'En attente'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ajout d'index pour améliorer les performances
transfertSchema.index({ date: -1 });
transfertSchema.index({ statut: 1 });

const Transfert = mongoose.model('Transfert', transfertSchema);

module.exports = Transfert; 