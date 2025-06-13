const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Poliza = require('../models/Poliza');

const router = express.Router();

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Validaciones para crear/actualizar póliza
const polizaValidation = [
  body('numeroPoliza')
    .notEmpty()
    .withMessage('El número de póliza es obligatorio')
    .isLength({ min: 3, max: 20 })
    .withMessage('El número de póliza debe tener entre 3 y 20 caracteres')
    .matches(/^[A-Z0-9\-]+$/)
    .withMessage('El número de póliza solo puede contener letras mayúsculas, números y guiones'),
  
  body('TipoSeguro')
    .notEmpty()
    .withMessage('El tipo de seguro es obligatorio')
    .isIn(['Auto', 'Vida', 'Hogar', 'Salud'])
    .withMessage('El tipo de seguro debe ser: Auto, Vida, Hogar o Salud'),
  
  body('Titular')
    .notEmpty()
    .withMessage('El nombre del titular es obligatorio')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del titular debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
    .withMessage('El nombre del titular solo puede contener letras y espacios'),
  
  body('monto')
    .notEmpty()
    .withMessage('El monto es obligatorio')
    .isNumeric()
    .withMessage('El monto debe ser un número')
    .custom(value => {
      if (value <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }
      if (value > 10000000) {
        throw new Error('El monto no puede exceder $10,000,000');
      }
      return true;
    })
];

// 📋 GET /api/v1/polizas - Obtener todas las pólizas
router.get('/', [
  query('tipo')
    .optional()
    .isIn(['Auto', 'Vida', 'Hogar', 'Salud'])
    .withMessage('Tipo de seguro inválido'),
  query('estado')
    .optional()
    .isIn(['Activa', 'Suspendida', 'Cancelada'])
    .withMessage('Estado inválido'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser entre 1 y 100'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser mayor a 0')
], handleValidationErrors, async (req, res) => {
  try {
    const { tipo, estado, limit = 10, page = 1 } = req.query;
    
    // Construir filtros
    const filters = {};
    if (tipo) filters.TipoSeguro = tipo;
    if (estado) filters.estado = estado;
    
    // Calcular paginación
    const skip = (page - 1) * limit;
    
    // Ejecutar consulta con paginación
    const polizas = await Poliza.find(filters)
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Poliza.countDocuments(filters);
    
    // Estadísticas adicionales
    const stats = await Poliza.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$TipoSeguro',
          cantidad: { $sum: 1 },
          montoTotal: { $sum: '$monto' },
          montoPromedio: { $avg: '$monto' }
        }
      }
    ]);
    
    res.json({
      success: true,
      message: 'Pólizas obtenidas exitosamente',
      data: {
        polizas,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        },
        estadisticas: stats
      }
    });
  } catch (error) {
    console.error('Error al obtener pólizas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener pólizas',
      error: error.message
    });
  }
});

// 🔍 GET /api/v1/polizas/:id - Obtener una póliza por ID
router.get('/:id', [
  param('id').isMongoId().withMessage('ID de póliza inválido')
], handleValidationErrors, async (req, res) => {
  try {
    const poliza = await Poliza.findById(req.params.id);
    
    if (!poliza) {
      return res.status(404).json({
        success: false,
        message: 'Póliza no encontrada',
        id: req.params.id
      });
    }
    
    res.json({
      success: true,
      message: 'Póliza encontrada exitosamente',
      data: poliza
    });
  } catch (error) {
    console.error('Error al obtener póliza:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// 🔍 GET /api/v1/polizas/numero/:numeroPoliza - Buscar por número de póliza
router.get('/numero/:numeroPoliza', [
  param('numeroPoliza')
    .notEmpty()
    .withMessage('El número de póliza es requerido')
    .isLength({ min: 3, max: 20 })
    .withMessage('El número de póliza debe tener entre 3 y 20 caracteres')
], handleValidationErrors, async (req, res) => {
  try {
    const poliza = await Poliza.findOne({ 
      numeroPoliza: req.params.numeroPoliza.toUpperCase() 
    });
    
    if (!poliza) {
      return res.status(404).json({
        success: false,
        message: 'Póliza no encontrada con ese número',
        numeroPoliza: req.params.numeroPoliza
      });
    }
    
    res.json({
      success: true,
      message: 'Póliza encontrada exitosamente',
      data: poliza
    });
  } catch (error) {
    console.error('Error al buscar póliza:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ✅ POST /api/v1/polizas - Crear nueva póliza
router.post('/', polizaValidation, handleValidationErrors, async (req, res) => {
  try {
    const { numeroPoliza, TipoSeguro, Titular, monto } = req.body;
    
    // Verificar si ya existe una póliza con ese número
    const polizaExistente = await Poliza.findOne({ numeroPoliza: numeroPoliza.toUpperCase() });
    if (polizaExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una póliza con ese número',
        numeroPoliza: numeroPoliza.toUpperCase()
      });
    }
    
    // Crear nueva póliza
    const nuevaPoliza = new Poliza({
      numeroPoliza: numeroPoliza.toUpperCase(),
      TipoSeguro,
      Titular: Titular.trim(),
      monto: parseFloat(monto)
    });
    
    const polizaGuardada = await nuevaPoliza.save();
    
    res.status(201).json({
      success: true,
      message: 'Póliza creada exitosamente',
      data: polizaGuardada
    });
  } catch (error) {
    console.error('Error al crear póliza:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una póliza con ese número',
        error: 'Número de póliza duplicado'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear póliza',
      error: error.message
    });
  }
});

// 📝 PUT /api/v1/polizas/:id - Actualizar póliza
router.put('/:id', [
  param('id').isMongoId().withMessage('ID de póliza inválido'),
  ...polizaValidation
], handleValidationErrors, async (req, res) => {
  try {
    const { numeroPoliza, TipoSeguro, Titular, monto } = req.body;
    
    // Verificar si la póliza existe
    const polizaExistente = await Poliza.findById(req.params.id);
    if (!polizaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Póliza no encontrada',
        id: req.params.id
      });
    }
    
    // Verificar si el nuevo número de póliza ya existe (solo si es diferente)
    if (numeroPoliza.toUpperCase() !== polizaExistente.numeroPoliza) {
      const polizaConMismoNumero = await Poliza.findOne({ 
        numeroPoliza: numeroPoliza.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      
      if (polizaConMismoNumero) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otra póliza con ese número',
          numeroPoliza: numeroPoliza.toUpperCase()
        });
      }
    }
    
    // Actualizar póliza
    const polizaActualizada = await Poliza.findByIdAndUpdate(
      req.params.id,
      {
        numeroPoliza: numeroPoliza.toUpperCase(),
        TipoSeguro,
        Titular: Titular.trim(),
        monto: parseFloat(monto),
        fechaActualizacion: new Date()
      },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Póliza actualizada exitosamente',
      data: polizaActualizada
    });
  } catch (error) {
    console.error('Error al actualizar póliza:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar póliza',
      error: error.message
    });
  }
});

// 🔄 PATCH /api/v1/polizas/:id/estado - Cambiar estado de póliza
router.patch('/:id/estado', [
  param('id').isMongoId().withMessage('ID de póliza inválido'),
  body('estado')
    .notEmpty()
    .withMessage('El estado es obligatorio')
    .isIn(['Activa', 'Suspendida', 'Cancelada'])
    .withMessage('El estado debe ser: Activa, Suspendida o Cancelada')
], handleValidationErrors, async (req, res) => {
  try {
    const { estado } = req.body;
    
    const polizaActualizada = await Poliza.findByIdAndUpdate(
      req.params.id,
      { 
        estado,
        fechaActualizacion: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!polizaActualizada) {
      return res.status(404).json({
        success: false,
        message: 'Póliza no encontrada',
        id: req.params.id
      });
    }
    
    res.json({
      success: true,
      message: `Estado de póliza cambiado a '${estado}' exitosamente`,
      data: polizaActualizada
    });
  } catch (error) {
    console.error('Error al cambiar estado de póliza:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ❌ DELETE /api/v1/polizas/:id - Eliminar póliza
router.delete('/:id', [
  param('id').isMongoId().withMessage('ID de póliza inválido')
], handleValidationErrors, async (req, res) => {
  try {
    const polizaEliminada = await Poliza.findByIdAndDelete(req.params.id);
    
    if (!polizaEliminada) {
      return res.status(404).json({
        success: false,
        message: 'Póliza no encontrada',
        id: req.params.id
      });
    }
    
    res.json({
      success: true,
      message: 'Póliza eliminada exitosamente',
      data: {
        id: polizaEliminada._id,
        numeroPoliza: polizaEliminada.numeroPoliza,
        titular: polizaEliminada.Titular
      }
    });
  } catch (error) {
    console.error('Error al eliminar póliza:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar póliza',
      error: error.message
    });
  }
});

// 📊 GET /api/v1/polizas/estadisticas/resumen - Obtener estadísticas generales
router.get('/estadisticas/resumen', async (req, res) => {
  try {
    const estadisticas = await Poliza.aggregate([
      {
        $group: {
          _id: null,
          totalPolizas: { $sum: 1 },
          montoTotal: { $sum: '$monto' },
          montoPromedio: { $avg: '$monto' },
          montoMaximo: { $max: '$monto' },
          montoMinimo: { $min: '$monto' }
        }
      }
    ]);
    
    const estadisticasPorTipo = await Poliza.aggregate([
      {
        $group: {
          _id: '$TipoSeguro',
          cantidad: { $sum: 1 },
          montoTotal: { $sum: '$monto' },
          montoPromedio: { $avg: '$monto' }
        }
      },
      { $sort: { cantidad: -1 } }
    ]);
    
    const estadisticasPorEstado = await Poliza.aggregate([
      {
        $group: {
          _id: '$estado',
          cantidad: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      message: 'Estadísticas obtenidas exitosamente',
      data: {
        resumenGeneral: estadisticas[0] || {
          totalPolizas: 0,
          montoTotal: 0,
          montoPromedio: 0,
          montoMaximo: 0,
          montoMinimo: 0
        },
        porTipoSeguro: estadisticasPorTipo,
        porEstado: estadisticasPorEstado
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;