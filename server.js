const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

// Importar rutas
const polizasRoutes = require('./routes/polizas');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad y optimización
app.use(helmet()); // Seguridad HTTP headers
app.use(compression()); // Compresión gzip
app.use(cors()); // Habilitar CORS
app.use(morgan('combined')); // Logging de requests
app.use(express.json({ limit: '10mb' })); // Parser JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parser URL-encoded

// Conexión a MongoDB Atlas
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

// Conectar a la base de datos
connectDB();

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '🛡️ Bienvenido a Seguros el Artesano API',
    version: '1.0.0',
    company: 'Seguros el Artesano',
    endpoints: {
      polizas: '/api/v1/polizas',
      documentation: 'Use Postman para probar las rutas'
    },
    status: 'Servidor funcionando correctamente'
  });
});

// Rutas de la API
app.use('/api/v1/polizas', polizasRoutes);

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`,
    suggestion: 'Verifica la URL y método HTTP'
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('❌ Error del servidor:', error);
  
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Error interno del servidor';
  
  // Errores específicos de MongoDB
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map(err => err.message).join(', ');
  } else if (error.code === 11000) {
    statusCode = 400;
    const field = Object.keys(error.keyPattern)[0];
    message = `Ya existe una póliza con ese ${field}`;
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'ID de póliza inválido';
  }
  
  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n🚀 ===============================================');
  console.log(`   SEGUROS EL ARTESANO - SERVIDOR INICIADO`);
  console.log('===============================================');
  console.log(`🌐 Servidor ejecutándose en puerto: ${PORT}`);
  console.log(`📍 URL local: http://localhost:${PORT}`);
  console.log(`🛡️ Compañía: Seguros el Artesano`);
  console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV}`);
  console.log('===============================================\n');
  console.log('📋 RUTAS DISPONIBLES PARA POSTMAN:');
  console.log('===============================================');
  console.log('GET    http://localhost:3000/api/v1/polizas');
  console.log('POST   http://localhost:3000/api/v1/polizas');
  console.log('GET    http://localhost:3000/api/v1/polizas/:id');
  console.log('PUT    http://localhost:3000/api/v1/polizas/:id');
  console.log('DELETE http://localhost:3000/api/v1/polizas/:id');
  console.log('PATCH  http://localhost:3000/api/v1/polizas/:id/estado');
  console.log('GET    http://localhost:3000/api/v1/polizas/estadisticas/resumen');
  console.log('===============================================\n');
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🔄 Cerrando servidor...');
  mongoose.connection.close(() => {
    console.log('✅ Conexión a MongoDB cerrada');
    process.exit(0);
  });
});

module.exports = app;