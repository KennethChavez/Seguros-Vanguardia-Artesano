const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conexión exitosa a MongoDB Atlas');
    
    // Crear una póliza de prueba
    const Poliza = require('./models/Poliza');
    const polizaTest = new Poliza({
      numeroPoliza: 'TEST-001',
      TipoSeguro: 'Auto',
      Titular: 'Usuario Prueba',
      monto: 50000 // 50,000 Lempiras
    });
    
    await polizaTest.save();
    console.log('✅ Póliza de prueba creada exitosamente');
    
    // Buscar la póliza creada
    const polizaEncontrada = await Poliza.findOne({ numeroPoliza: 'TEST-001' });
    console.log('📄 Póliza encontrada:', polizaEncontrada);
    console.log('💰 Monto formateado:', polizaEncontrada.getResumen().monto);
    
    // Limpiar la póliza de prueba
    await Poliza.deleteOne({ numeroPoliza: 'TEST-001' });
    console.log('🧹 Póliza de prueba eliminada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

testConnection(); 