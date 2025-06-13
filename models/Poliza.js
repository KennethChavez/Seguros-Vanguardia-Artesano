const mongoose = require('mongoose');

// Esquema de la póliza de seguro
const polizaSchema = new mongoose.Schema({
  numeroPoliza: {
    type: String,
    required: [true, 'El número de póliza es obligatorio'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9\-]+$/, 'El número de póliza solo puede contener letras mayúsculas, números y guiones']
  },
  
  TipoSeguro: {
    type: String,
    required: [true, 'El tipo de seguro es obligatorio'],
    enum: {
      values: ['Auto', 'Vida', 'Hogar', 'Salud'],
      message: 'El tipo de seguro debe ser: Auto, Vida, Hogar o Salud'
    },
    trim: true
  },
  
  Titular: {
    type: String,
    required: [true, 'El nombre del titular es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre del titular debe tener al menos 2 caracteres'],
    maxlength: [100, 'El nombre del titular no puede exceder 100 caracteres'],
    match: [/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, 'El nombre del titular solo puede contener letras y espacios']
  },
  
  monto: {
    type: Number,
    required: [true, 'El monto de la póliza es obligatorio'],
    min: [1, 'El monto debe ser mayor a 0'],
    max: [250000000, 'El monto no puede exceder L. 250,000,000'],
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'El monto debe ser un número positivo'
    }
  },
  
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  
  fechaActualizacion: {
    type: Date,
    default: Date.now
  },
  
  estado: {
    type: String,
    enum: ['Activa', 'Suspendida', 'Cancelada'],
    default: 'Activa'
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  versionKey: false // Elimina el campo __v
});

// Middleware pre-save para actualizar fecha de modificación
polizaSchema.pre('save', function(next) {
  this.fechaActualizacion = new Date();
  next();
});

// Middleware pre-findOneAndUpdate para actualizar fecha de modificación
polizaSchema.pre('findOneAndUpdate', function(next) {
  this.set({ fechaActualizacion: new Date() });
  next();
});

// Método para obtener resumen de la póliza
polizaSchema.methods.getResumen = function() {
  return {
    numeroPoliza: this.numeroPoliza,
    tipo: this.TipoSeguro,
    titular: this.Titular,
    monto: `L. ${this.monto.toLocaleString('es-HN')}`,
    estado: this.estado
  };
};

// Método estático para buscar por tipo de seguro
polizaSchema.statics.findByTipo = function(tipo) {
  return this.find({ TipoSeguro: tipo, estado: 'Activa' });
};

// Índices para optimizar consultas
polizaSchema.index({ numeroPoliza: 1 }, { unique: true });
polizaSchema.index({ TipoSeguro: 1 });
polizaSchema.index({ Titular: 1 });
polizaSchema.index({ estado: 1 });

const Poliza = mongoose.model('Poliza', polizaSchema);

module.exports = Poliza;