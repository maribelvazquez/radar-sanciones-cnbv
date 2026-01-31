import React, { useState, useMemo } from 'react';
import { Search, AlertTriangle, Building2, DollarSign, FileWarning, ChevronDown, ChevronUp, BarChart3, Scale, Calendar, Download, Database } from 'lucide-react';

// ============================================
// PALETA 360EDUCA 2025
// ============================================
const COLORS = {
  violeta: '#a663cc',
  coral: '#ff8361',
  grisOscuro: '#4d4d4d',
  casiNegro: '#393e41',
  verdeMenta: '#87d895',
  blanco: '#ffffff',
  negro: '#1b1b1e'
};

// ============================================
// CONFIGURACIÓN - EDITAR CADA MES
// ============================================
const CONFIG = {
  mes: 'Enero',
  anio: 2026,
  fechaPublicacion: '15 de enero de 2026',
  fechaCorte: '30 de enero de 2026',
  edicionBonus: 'Febrero 2026'
};

// ============================================
// DATOS DE SANCIONES - ENERO 2026
// ============================================
const sancionesData = [
  { id: 61364, entidad: "BANCO DE INVERSIÓN AFIRME, S.A., INSTITUCIÓN DE BANCA MÚLTIPLE, AFIRME GRUPO FINANCIERO", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 448100, conducta: "LIC - Deficiencias en el establecimiento o implementación de medidas y procedimientos aplicables", fechaImposicion: "2025-12-03" },
  { id: 61365, entidad: "BANCO DE INVERSIÓN AFIRME, S.A., INSTITUCIÓN DE BANCA MÚLTIPLE, AFIRME GRUPO FINANCIERO", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 448100, conducta: "LIC - Deficiencias en el establecimiento o implementación de medidas y procedimientos aplicables", fechaImposicion: "2025-12-03" },
  { id: 61366, entidad: "BANCO DE INVERSIÓN AFIRME, S.A., INSTITUCIÓN DE BANCA MÚLTIPLE, AFIRME GRUPO FINANCIERO", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 448100, conducta: "LIC - Deficiencias en el análisis y evaluación de operaciones de clientes o usuarios", fechaImposicion: "2025-12-03" },
  { id: 61367, entidad: "BANCO DE INVERSIÓN AFIRME, S.A., INSTITUCIÓN DE BANCA MÚLTIPLE, AFIRME GRUPO FINANCIERO", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 1792400, conducta: "LIC - Deficiencias en Control Interno", fechaImposicion: "2025-12-03" },
  { id: 61368, entidad: "BANCO DE INVERSIÓN AFIRME, S.A., INSTITUCIÓN DE BANCA MÚLTIPLE, AFIRME GRUPO FINANCIERO", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 896200, conducta: "LIC - Deficiencias en Control Interno", fechaImposicion: "2025-12-03" },
  { id: 61369, entidad: "BANCO DE INVERSIÓN AFIRME, S.A., INSTITUCIÓN DE BANCA MÚLTIPLE, AFIRME GRUPO FINANCIERO", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 896200, conducta: "LIC - Deficiencias en Control Interno", fechaImposicion: "2025-12-03" },
  { id: 61370, entidad: "GBM Grupo Bursátil Mexicano, S.A. de C.V., Casa de Bolsa", subsector: "Casas de bolsa", tipo: "Multa", monto: 1924400, conducta: "LMV - Deficiencias en sistemas automatizados de detección, monitoreo y reporte de operaciones", fechaImposicion: "2025-12-05" },
  { id: 61371, entidad: "GBM Grupo Bursátil Mexicano, S.A. de C.V., Casa de Bolsa", subsector: "Casas de bolsa", tipo: "Multa", monto: 1924400, conducta: "LMV - Deficiencias en el funcionamiento del área de cumplimiento en la materia", fechaImposicion: "2025-12-05" },
  { id: 61372, entidad: "GBM Grupo Bursátil Mexicano, S.A. de C.V., Casa de Bolsa", subsector: "Casas de bolsa", tipo: "Multa", monto: 1924400, conducta: "LMV - Deficiencias en sistemas automatizados de detección, monitoreo y reporte de operaciones", fechaImposicion: "2025-12-05" },
  { id: 61373, entidad: "GBM Grupo Bursátil Mexicano, S.A. de C.V., Casa de Bolsa", subsector: "Casas de bolsa", tipo: "Multa", monto: 1924400, conducta: "LMV - Deficiencias en la conservación, resguardo o seguridad de información y documentación", fechaImposicion: "2025-12-05" },
  { id: 61374, entidad: "GBM Grupo Bursátil Mexicano, S.A. de C.V., Casa de Bolsa", subsector: "Casas de bolsa", tipo: "Multa", monto: 1924400, conducta: "LMV - Deficiencias en sistemas automatizados de detección, monitoreo y reporte de operaciones", fechaImposicion: "2025-12-05" },
  { id: 61375, entidad: "GBM Grupo Bursátil Mexicano, S.A. de C.V., Casa de Bolsa", subsector: "Casas de bolsa", tipo: "Multa", monto: 1924400, conducta: "LMV - Deficiencias en el funcionamiento del área de cumplimiento en la materia", fechaImposicion: "2025-12-05" },
  { id: 61376, entidad: "GBM Grupo Bursátil Mexicano, S.A. de C.V., Casa de Bolsa", subsector: "Casas de bolsa", tipo: "Multa", monto: 1924400, conducta: "LMV - Deficiencias en sistemas automatizados de detección, monitoreo y reporte de operaciones", fechaImposicion: "2025-12-05" },
  { id: 61377, entidad: "GBM Grupo Bursátil Mexicano, S.A. de C.V., Casa de Bolsa", subsector: "Casas de bolsa", tipo: "Multa", monto: 962200, conducta: "LMV - Deficiencias en la conservación, resguardo o seguridad de información y documentación", fechaImposicion: "2025-12-05" },
  { id: 61378, entidad: "GBM Grupo Bursátil Mexicano, S.A. de C.V., Casa de Bolsa", subsector: "Casas de bolsa", tipo: "Multa", monto: 1924400, conducta: "LMV - Información o documentación incompleta o desactualizada para la identificación de clientes.", fechaImposicion: "2025-12-05" },
  { id: 61379, entidad: "Banco del Bajío, S.A., Institución de Banca Múltiple", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 2583200, conducta: "LIC - Deficiencias en Control Interno", fechaImposicion: "2025-12-09" },
  { id: 61380, entidad: "Banco del Bajío, S.A., Institución de Banca Múltiple", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 784500, conducta: "LIC - Inconsistencias en los procedimientos de conocimiento del cliente.", fechaImposicion: "2025-12-09" },
  { id: 61381, entidad: "Banco Shinhan de México, S.A., Institución de Banca Múltiple", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 224050, conducta: "LIC - Omitir cumplir con las disposiciones de carácter prudencial", fechaImposicion: "2025-12-09" },
  { id: 61382, entidad: "Banco Shinhan de México, S.A., Institución de Banca Múltiple", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 224050, conducta: "LIC - Omitir cumplir con las disposiciones de carácter prudencial que procuren la transparencia", fechaImposicion: "2025-12-09" },
  { id: 61383, entidad: "Banco Shinhan de México, S.A., Institución de Banca Múltiple", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 224050, conducta: "LIC - Omitir cumplir con las disposiciones de carácter prudencial relativo a operaciones con personas relacionadas", fechaImposicion: "2025-12-09" },
  { id: 61384, entidad: "Banco Shinhan de México, S.A., Institución de Banca Múltiple", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 224050, conducta: "LIC - Omitir cumplir con las disposiciones de carácter prudencial", fechaImposicion: "2025-12-09" },
  { id: 61385, entidad: "Banco Shinhan de México, S.A., Institución de Banca Múltiple", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 448100, conducta: "LIC - No cumplir con las obligaciones relativas al uso de medios electrónicos", fechaImposicion: "2025-12-09" },
  { id: 61386, entidad: "Banco Shinhan de México, S.A., Institución de Banca Múltiple", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 358480, conducta: "LIC - No atender requerimientos de información dentro del plazo", fechaImposicion: "2025-12-09" },
  { id: 61387, entidad: "FINANCIERA BEPENSA S.A. DE C.V. SOFOM E.N.R.", subsector: "SOFOM ENR", tipo: "Multa", monto: 289770, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes regulatorios", fechaImposicion: "2025-12-11" },
  { id: 61388, entidad: "FINANCIERA DE ADMINISTRACIÓN INTEGRAL, S.A. DE C.V., SOFOM E.N.R.", subsector: "SOFOM ENR", tipo: "Multa", monto: 579540, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes regulatorios", fechaImposicion: "2025-12-11" },
  { id: 61389, entidad: "FACTORAJE SERFIN, S.A. DE C.V., SOFOM, E.N.R.", subsector: "SOFOM ENR", tipo: "Multa", monto: 134610, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes regulatorios", fechaImposicion: "2025-12-11" },
  { id: 61390, entidad: "Centro Cambiario Divisas Santander, S.A. de C.V.", subsector: "Centros Cambiarios", tipo: "Multa", monto: 226280, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes regulatorios", fechaImposicion: "2025-12-11" },
  { id: 61391, entidad: "Centro Cambiario Oro de Cancún, S.A. de C.V.", subsector: "Centros Cambiarios", tipo: "Multa", monto: 226280, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes regulatorios", fechaImposicion: "2025-12-11" },
  { id: 61392, entidad: "Centro Cambiario Gran Dólar, S.A. de C.V.", subsector: "Centros Cambiarios", tipo: "Multa", monto: 226280, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes regulatorios", fechaImposicion: "2025-12-11" },
  { id: 61393, entidad: "Divisa el Paso del Norte, S.A. de C.V., Centro Cambiario", subsector: "Centros Cambiarios", tipo: "Multa", monto: 226280, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes regulatorios", fechaImposicion: "2025-12-11" },
  { id: 61394, entidad: "Centro Cambiario Divisa del Golfo, S.A. de C.V.", subsector: "Centros Cambiarios", tipo: "Multa", monto: 226280, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes regulatorios", fechaImposicion: "2025-12-11" },
  { id: 61395, entidad: "Centro Cambiario Divisas San Sebastián S.A. de C.V.", subsector: "Centros Cambiarios", tipo: "Multa", monto: 226280, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes regulatorios", fechaImposicion: "2025-12-11" },
  { id: 61396, entidad: "Centro Cambiario Divisas Zacatecas S.A. de C.V.", subsector: "Centros Cambiarios", tipo: "Multa", monto: 226280, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes regulatorios", fechaImposicion: "2025-12-11" },
  { id: 61397, entidad: "Centro Cambiario Taurus, S.A. de C.V.", subsector: "Centros Cambiarios", tipo: "Multa", monto: 226280, conducta: "LGOAAC - Información o documentación incompleta para identificación de clientes", fechaImposicion: "2025-12-11" },
  { id: 61398, entidad: "Almacenadora Afirme, S.A. de C.V.", subsector: "Almacenes generales de depósito", tipo: "Multa", monto: 39638, conducta: "LGOAAC - Omitir cumplir disposiciones de revelaciones de estados financieros", fechaImposicion: "2025-12-11" },
  { id: 61399, entidad: "Almacenadora Afirme, S.A. de C.V.", subsector: "Almacenes generales de depósito", tipo: "Multa", monto: 39638, conducta: "LGOAAC - Omitió invertir el capital y reservas de capital", fechaImposicion: "2025-12-11" },
  { id: 61400, entidad: "Inmobiliaria Banca Afirme, S.A. de C.V.", subsector: "Inmobiliarias bancarias", tipo: "Multa", monto: 192440, conducta: "LIC - No proporcionar información o documentación dentro del plazo", fechaImposicion: "2025-12-11" },
  { id: 61401, entidad: "BANCO PAGA TODO, S.A. INSTITUCIÓN DE BANCA MÚLTIPLE", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 521280, conducta: "LIC - Omitir cumplir disposiciones relativas a precios de transferencia", fechaImposicion: "2025-12-12" },
  { id: 61402, entidad: "BANCO PAGA TODO, S.A. INSTITUCIÓN DE BANCA MÚLTIPLE", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 521280, conducta: "LIC - Deficiencias en Control Interno", fechaImposicion: "2025-12-12" },
  { id: 61403, entidad: "BANCO PAGA TODO, S.A. INSTITUCIÓN DE BANCA MÚLTIPLE", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 521280, conducta: "LIC - Deficiencias en Control Interno", fechaImposicion: "2025-12-12" },
  { id: 61404, entidad: "BANCO PAGA TODO, S.A. INSTITUCIÓN DE BANCA MÚLTIPLE", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 521280, conducta: "LIC - Deficiencias en Control Interno", fechaImposicion: "2025-12-12" },
  { id: 61405, entidad: "Banco Shinhan de México, S.A., Institución de Banca Múltiple", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 224050, conducta: "LIC - Registros contables incorrectos", fechaImposicion: "2025-12-12" },
  { id: 61406, entidad: "Banco Shinhan de México, S.A., Institución de Banca Múltiple", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 224050, conducta: "LACP - No ajustar calificación de cartera crediticia", fechaImposicion: "2025-12-12" },
  { id: 61407, entidad: "CASA DE BOLSA FINAMEX, S.A.B. DE C.V.", subsector: "Organismos autorregulatorios", tipo: "Amonestación", monto: 0, conducta: "LMV - Omitir avisar modificaciones a la normatividad", fechaImposicion: "2025-12-12" },
  { id: 61408, entidad: "GRUPO DINÁMICO EMPRESARIAL, S.A. DE C.V.", subsector: "Transmisores de dinero", tipo: "Multa", monto: 1556100, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes regulatorios", fechaImposicion: "2025-12-12" },
  { id: 61409, entidad: "GRUPO DINÁMICO EMPRESARIAL, S.A. DE C.V.", subsector: "Transmisores de dinero", tipo: "Multa", monto: 778050, conducta: "LGOAAC - Deficiencias en sistemas automatizados de detección y monitoreo", fechaImposicion: "2025-12-12" },
  { id: 61410, entidad: "GRUPO DINÁMICO EMPRESARIAL, S.A. DE C.V.", subsector: "Transmisores de dinero", tipo: "Multa", monto: 778050, conducta: "LGOAAC - Deficiencias en sistemas automatizados de detección y monitoreo", fechaImposicion: "2025-12-12" },
  { id: 61411, entidad: "Caja Popular Juventino Rosas, S.C. de A.P. de R.L. de C.V.", subsector: "SOCAP", tipo: "Multa", monto: 67554, conducta: "LRASCAP - Omitir aprobar operaciones con personas relacionadas", fechaImposicion: "2025-12-12" },
  { id: 61412, entidad: "Cooperativa Acreimex, S.C. de A.P. de R.L. de C.V.", subsector: "SOCAP", tipo: "Multa", monto: 67554, conducta: "LRASCAP - No cumplir con Coeficientes de liquidez", fechaImposicion: "2025-12-15" },
  { id: 61413, entidad: "TRANSMISORA MEXICANA, S.A. de C.V.", subsector: "Transmisores de dinero", tipo: "Multa", monto: 339090, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes regulatorios", fechaImposicion: "2025-12-15" },
  { id: 61414, entidad: "TRANSMISORA MEXICANA, S.A. de C.V.", subsector: "Transmisores de dinero", tipo: "Multa", monto: 339750, conducta: "LGOAAC - Información incompleta para identificación de clientes", fechaImposicion: "2025-12-15" },
  { id: 61415, entidad: "Cooperativa Consumo Allende, S.C. de A.P. de R.L. de C.V.", subsector: "SOCAP", tipo: "Amonestación", monto: 0, conducta: "LRASCAP - No proporcionar información en plazos establecidos", fechaImposicion: "2025-12-15" },
  { id: 61416, entidad: "Cooperativa Consumo Allende, S.C. de A.P. de R.L. de C.V.", subsector: "SOCAP", tipo: "Amonestación", monto: 0, conducta: "LRASCAP - No proporcionar información en plazos establecidos", fechaImposicion: "2025-12-15" },
  { id: 61417, entidad: "UNIÓN DE CRÉDITO INDUSTRIAL Y AGROPECUARIO DE SONORA", subsector: "Uniones de crédito", tipo: "Multa", monto: 96990, conducta: "LUC - Omitir proporcionar información requerida en plazo", fechaImposicion: "2025-12-16" },
  { id: 61418, entidad: "UNIÓN DE CRÉDITO PROGRESO, S.A. DE C.V.", subsector: "Uniones de crédito", tipo: "Multa", monto: 96990, conducta: "LUC - Operaciones no autorizadas", fechaImposicion: "2025-12-16" },
  { id: 61419, entidad: "Unión de Crédito de Productores de Café de Chiapas", subsector: "Uniones de crédito", tipo: "Multa", monto: 96990, conducta: "LUC - Deficiencias en integración del Consejo de Administración", fechaImposicion: "2025-12-16" },
  { id: 61420, entidad: "UNIÓN DE CRÉDITO COOFIA, S.A. DE C.V.", subsector: "Uniones de crédito", tipo: "Multa", monto: 96514, conducta: "LUC - Incumplir obligaciones de Procesos Crediticios", fechaImposicion: "2025-12-16" },
  { id: 61421, entidad: "UNIÓN DE CRÉDITO COOFIA, S.A. DE C.V.", subsector: "Uniones de crédito", tipo: "Multa", monto: 96514, conducta: "LUC - Incumplir obligaciones de Procesos Crediticios", fechaImposicion: "2025-12-16" },
  { id: 61422, entidad: "UNIÓN DE CRÉDITO COOFIA, S.A. DE C.V.", subsector: "Uniones de crédito", tipo: "Multa", monto: 96514, conducta: "LUC - Incumplir obligaciones de Procesos Crediticios", fechaImposicion: "2025-12-16" },
  { id: 61423, entidad: "UNIÓN DE CRÉDITO COOFIA, S.A. DE C.V.", subsector: "Uniones de crédito", tipo: "Multa", monto: 96606, conducta: "LUC - Deficiencias en integración del Consejo de Administración", fechaImposicion: "2025-12-16" },
  { id: 61424, entidad: "CI CASA DE BOLSA, S.A. DE C.V.", subsector: "Operadoras de fondos", tipo: "Multa", monto: 1924400, conducta: "LFI - No proporcionar información de eventos relevantes", fechaImposicion: "2025-12-18" },
  { id: 61425, entidad: "FINANCIERA COVALTO, S.A. DE C.V., SOFOM, E.R.", subsector: "SOFOM ER", tipo: "Multa", monto: 244310, conducta: "LGOAAC - Incumplir disposiciones de expedientes de crédito", fechaImposicion: "2025-12-18" },
  { id: 61426, entidad: "FINANCIERA COVALTO, S.A. DE C.V., SOFOM, E.R.", subsector: "SOFOM ER", tipo: "Multa", monto: 244310, conducta: "LGOAAC - Omitir disposiciones de revelaciones de estados financieros", fechaImposicion: "2025-12-18" },
  { id: 61427, entidad: "CIBANCO, S.A. INSTITUCIÓN DE BANCA MÚLTIPLE", subsector: "Emisoras", tipo: "Multa", monto: 3112200, conducta: "LMV - No proporcionar estados financieros en plazo (Emisoras)", fechaImposicion: "2025-12-19" },
  { id: 61428, entidad: "Cooperativa de Ahorro y Préstamo Tosepantomin", subsector: "SOCAP", tipo: "Multa", monto: 67554, conducta: "LACP - No proporcionar información en plazos establecidos", fechaImposicion: "2025-12-19" },
  { id: 61429, entidad: "FINANCIERA DEL BAJIO, S.A. DE C.V., SOFOM, E.R.", subsector: "SOFOM ER", tipo: "Multa", monto: 0, conducta: "LGOAAC - Omitir disposiciones de revelaciones de estados financieros", fechaImposicion: "2025-12-19" },
  { id: 61430, entidad: "RICARDO ANTONIO RANGEL FERNÁNDEZ MCGREGOR", subsector: "Auditores externos", tipo: "Multa", monto: 896200, conducta: "LMV - Omitió presentar información requerida por CNBV", fechaImposicion: "2025-12-19" },
  { id: 61431, entidad: "RICARDO ANTONIO RANGEL FERNÁNDEZ MCGREGOR", subsector: "Personas físicas", tipo: "Multa", monto: 793600, conducta: "LMV - Adquirir indebidamente acciones de la sociedad", fechaImposicion: "2025-12-19" },
  { id: 61432, entidad: "Scotiabank Inverlat, S.A., Institución de Banca Múltiple", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 1016000, conducta: "LIC - Información incompleta para identificación de clientes", fechaImposicion: "2025-12-19" },
  { id: 61433, entidad: "Scotiabank Inverlat, S.A., Institución de Banca Múltiple", subsector: "Instituciones de banca múltiple", tipo: "Multa", monto: 113440, conducta: "LIC - Información incompleta para identificación de clientes", fechaImposicion: "2025-12-19" },
  { id: 61436, entidad: "Caja Popular San Marcos, S.C. de A.P. de R.L. de C.V.", subsector: "SOCAP", tipo: "Multa", monto: 202662, conducta: "LRASCAP - Deficiencias en Control Interno", fechaImposicion: "2025-12-19" },
  { id: 61437, entidad: "Cooperativa de Ahorro y Préstamo Kafen Tomin", subsector: "SOCAP", tipo: "Multa", monto: 67554, conducta: "LRASCAP - No proporcionar estados financieros con requisitos", fechaImposicion: "2025-12-19" },
  { id: 61438, entidad: "Caja Popular Apaseo el Alto S.C. de A.P. de R.L. de C.V.", subsector: "SOCAP", tipo: "Multa", monto: 67554, conducta: "LRASCAP - Registros contables incorrectos", fechaImposicion: "2025-12-19" },
  { id: 61439, entidad: "Caja Popular Apaseo el Alto S.C. de A.P. de R.L. de C.V.", subsector: "SOCAP", tipo: "Multa", monto: 67554, conducta: "LRASCAP - No proporcionar documentación en plazos", fechaImposicion: "2025-12-19" },
  { id: 61440, entidad: "Centro Cambiario Divisa Mexicana, S.A. de C.V.", subsector: "Centros Cambiarios", tipo: "Multa", monto: 453000, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes", fechaImposicion: "2025-12-19" },
  { id: 61441, entidad: "Centro Cambiario Divisa Mexicana, S.A. de C.V.", subsector: "Centros Cambiarios", tipo: "Multa", monto: 226120, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes", fechaImposicion: "2025-12-19" },
  { id: 61442, entidad: "FINANCIERA APOYO Y LEALTAD, S.A. DE C.V., SOFOM, E.N.R.", subsector: "SOFOM ENR", tipo: "Multa", monto: 289500, conducta: "LGOAAC - Omisión o presentación extemporánea de reportes", fechaImposicion: "2025-12-19" },
  { id: 61443, entidad: "Caja Popular Purísima del Rincón S.C. de A.P. de R.L. de C.V.", subsector: "SOCAP", tipo: "Multa", monto: 67554, conducta: "LIC - Deficiencias en presentación de información financiera", fechaImposicion: "2025-12-19" },
  { id: 61444, entidad: "CREDIVERSA, S.A. de C.V., Sociedad Financiera Popular", subsector: "SOFIPO", tipo: "Multa", monto: 226162, conducta: "LUC - Incumplir publicación de estados financieros", fechaImposicion: "2025-12-19" },
  { id: 61445, entidad: "CREDIVERSA, S.A. de C.V., Sociedad Financiera Popular", subsector: "SOFIPO", tipo: "Multa", monto: 226162, conducta: "LRASCAP - Omitir atender observaciones de la Comisión", fechaImposicion: "2025-12-19" },
  { id: 61446, entidad: "Caja Popular Ahuacatlán, S.C. de A.P. de R.L. de C.V.", subsector: "SOCAP", tipo: "Multa", monto: 148246, conducta: "LRASCAP - Omitir calificar estimaciones preventivas", fechaImposicion: "2025-12-19" },
  { id: 61447, entidad: "Caja Popular Mexicana S.C. de A.P. de R.L. de C.V.", subsector: "SOCAP", tipo: "Multa", monto: 67554, conducta: "LRASCAP - Incumplimiento al diverso 32", fechaImposicion: "2025-12-19" },
  { id: 61448, entidad: "Caja Popular Mexicana S.C. de A.P. de R.L. de C.V.", subsector: "SOCAP", tipo: "Multa", monto: 67554, conducta: "LRASCAP - Controles internos", fechaImposicion: "2025-12-19" },
  { id: 61449, entidad: "Casa de Cambio San Juan, S.A. de C.V.", subsector: "Casas de Cambio", tipo: "Multa", monto: 192440, conducta: "LGOAAC - No presentar documentos o información en tiempo", fechaImposicion: "2025-12-19" },
  { id: 61450, entidad: "CREDICONFIA, S.A. DE C.V., S.F.P.", subsector: "SOFIPO", tipo: "Multa", monto: 95000, conducta: "LIC - Deficiencias en medidas y procedimientos", fechaImposicion: "2025-12-19" },
  { id: 61451, entidad: "Dinero Móvil, S.A. de C.V.", subsector: "Transmisores de dinero", tipo: "Multa", monto: 0, conducta: "LIC - Deficiencias en medidas y procedimientos", fechaImposicion: "2025-12-19" }
];

// Componente principal
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubsector, setSelectedSubsector] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'monto', direction: 'desc' });
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [showCerrados, setShowCerrados] = useState(false);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalMonto = sancionesData.reduce((sum, s) => sum + s.monto, 0);
    const uniqueEntidades = [...new Set(sancionesData.map(s => s.entidad))].length;
    const multas = sancionesData.filter(s => s.tipo === 'Multa').length;
    const amonestaciones = sancionesData.filter(s => s.tipo === 'Amonestación').length;
    const montoPromedio = totalMonto / sancionesData.length;
    return { totalMonto, uniqueEntidades, multas, amonestaciones, total: sancionesData.length, montoPromedio };
  }, []);

  // Agrupar por subsector
  const bySubsector = useMemo(() => {
    const grouped = {};
    sancionesData.forEach(s => {
      if (!grouped[s.subsector]) grouped[s.subsector] = { count: 0, monto: 0 };
      grouped[s.subsector].count++;
      grouped[s.subsector].monto += s.monto;
    });
    return Object.entries(grouped)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.monto - a.monto);
  }, []);

  // Top infractores
  const topInfractores = useMemo(() => {
    const grouped = {};
    sancionesData.forEach(s => {
      if (!grouped[s.entidad]) grouped[s.entidad] = { count: 0, monto: 0, subsector: s.subsector };
      grouped[s.entidad].count++;
      grouped[s.entidad].monto += s.monto;
    });
    return Object.entries(grouped)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 10);
  }, []);

  // Filtrar datos
  const filteredData = useMemo(() => {
    return sancionesData.filter(s => {
      const matchesSearch = s.entidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.conducta.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubsector = !selectedSubsector || s.subsector === selectedSubsector;
      return matchesSearch && matchesSubsector;
    });
  }, [searchTerm, selectedSubsector]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortConfig.direction === 'asc') return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });
  }, [filteredData, sortConfig]);

  const subsectores = [...new Set(sancionesData.map(s => s.subsector))].sort();

  const formatMonto = (monto) => {
    if (monto >= 1000000) return `$${(monto / 1000000).toFixed(1)}M`;
    if (monto >= 1000) return `$${(monto / 1000).toFixed(0)}K`;
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(monto);
  };

  const formatMontoFull = (monto) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(monto);
  };

  const fechaHoy = new Date().toLocaleDateString('es-MX', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  // Badge de tipo con colores 360EDUCA
  const getTipoBadge = (tipo) => {
    if (tipo === 'Multa') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium" style={{ backgroundColor: '#a663cc20', color: '#a663cc' }}>💰 Multa</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium" style={{ backgroundColor: '#ff836120', color: '#ff8361' }}>⚠️ Amon.</span>;
  };

  // Badge de subsector
  const getSubsectorBadge = (subsector) => {
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border" style={{ backgroundColor: '#f8f8f8', color: '#4d4d4d', borderColor: '#e5e5e5' }}>{subsector}</span>;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: '#e5e5e5' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo con violeta 360EDUCA */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #a663cc 0%, #8b4db8 100%)' }}>
                <span className="text-white font-bold text-lg">360</span>
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#1b1b1e' }}>Radar de Sanciones CNBV</h1>
                <p className="text-sm font-medium" style={{ color: '#a663cc' }}>IMPACTO360 • Bonus {CONFIG.edicionBonus}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: '#4d4d4d' }}>{fechaHoy}</span>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:opacity-80" style={{ color: '#4d4d4d' }}>
                <Database className="w-4 h-4" />
                Firebase
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {[
            { label: 'TOTAL SANCIONES', value: stats.total, sub: 'Registros', color: '#a663cc' },
            { label: 'ENTIDADES', value: stats.uniqueEntidades, sub: 'Únicas', color: '#a663cc' },
            { label: 'MONTO TOTAL', value: formatMonto(stats.totalMonto), sub: formatMontoFull(stats.totalMonto), color: '#87d895' },
            { label: 'MULTAS', value: stats.multas, sub: 'Pecuniarias', color: '#ff8361' },
            { label: 'AMONESTACIONES', value: stats.amonestaciones, sub: 'Sin monto', color: '#ff8361' },
            { label: 'PROMEDIO', value: formatMonto(stats.montoPromedio), sub: 'Por sanción', color: '#87d895' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow" style={{ borderColor: '#e5e5e5' }}>
              <p className="text-xs font-semibold tracking-wide mb-1" style={{ color: '#9ca3af' }}>{stat.label}</p>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border p-2 mb-6" style={{ borderColor: '#e5e5e5' }}>
          <div className="flex items-center gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'resumen', label: `Resumen (${stats.total})`, icon: '📋' },
              { id: 'analisis', label: 'Análisis', icon: '🔍' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={activeView === tab.id ? { 
                  background: 'linear-gradient(135deg, #a663cc 0%, #8b4db8 100%)', 
                  color: 'white',
                  boxShadow: '0 4px 14px rgba(166, 99, 204, 0.35)'
                } : { 
                  color: '#4d4d4d',
                  backgroundColor: 'transparent'
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            
            <div className="flex-1"></div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar entidad, conducta..."
                className="pl-9 pr-4 py-2 w-64 text-sm border rounded-lg focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#f8f8f8', borderColor: '#e5e5e5', color: '#393e41' }}
              />
            </div>
          </div>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="grid grid-cols-2 gap-6">
            {/* Por Subsector */}
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e5e5' }}>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#1b1b1e' }}>
                <Building2 className="w-4 h-4" style={{ color: '#a663cc' }} />
                Distribución por Sector
              </h3>
              <div className="space-y-3">
                {bySubsector.slice(0, 8).map((sector, i) => {
                  const percent = (sector.monto / stats.totalMonto * 100).toFixed(1);
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm truncate pr-4" style={{ color: '#4d4d4d' }}>{sector.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: '#9ca3af' }}>{sector.count}</span>
                          <span className="text-sm font-semibold" style={{ color: '#1b1b1e' }}>{formatMonto(sector.monto)}</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                        <div 
                          className="h-full rounded-full"
                          style={{ width: `${percent}%`, background: 'linear-gradient(90deg, #a663cc, #c084fc)' }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Infractores */}
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e5e5' }}>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#1b1b1e' }}>
                <AlertTriangle className="w-4 h-4" style={{ color: '#ff8361' }} />
                Top 10 Entidades por Monto
              </h3>
              <div className="space-y-2">
                {topInfractores.map((inf, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{
                      backgroundColor: i === 0 ? '#ff8361' : i === 1 ? '#c9c9c9' : i === 2 ? '#cd7f32' : '#f3f4f6',
                      color: i < 3 ? 'white' : '#6b7280'
                    }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate font-medium" style={{ color: '#393e41' }}>{inf.name}</p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>{inf.count} sanc. • {inf.subsector}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: '#a663cc' }}>{formatMonto(inf.monto)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resumen View - Tabla */}
        {activeView === 'resumen' && (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e5e5e5' }}>
            {/* Filtros */}
            <div className="p-4 border-b flex items-center gap-4" style={{ borderColor: '#f3f4f6' }}>
              <select
                value={selectedSubsector}
                onChange={(e) => setSelectedSubsector(e.target.value)}
                className="px-3 py-2 text-sm border rounded-lg focus:outline-none"
                style={{ backgroundColor: '#f8f8f8', borderColor: '#e5e5e5', color: '#393e41' }}
              >
                <option value="">Todos los subsectores</option>
                {subsectores.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={showCerrados} onChange={() => setShowCerrados(!showCerrados)} className="sr-only peer" />
                  <div className="w-9 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" style={{ backgroundColor: showCerrados ? '#a663cc' : '#d1d5db' }}></div>
                </label>
                <span className="text-sm" style={{ color: '#4d4d4d' }}>Mostrar $0 ({sancionesData.filter(s => s.monto === 0).length})</span>
              </div>
              
              <div className="flex-1"></div>
              
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors" style={{ color: '#a663cc' }}>
                <Download className="w-4 h-4" />
                Exportar Excel
              </button>
            </div>
            
            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#f8f8f8' }}>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Entidad</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Subsector</th>
                    <th 
                      onClick={() => setSortConfig({ key: 'fechaImposicion', direction: sortConfig.key === 'fechaImposicion' && sortConfig.direction === 'desc' ? 'asc' : 'desc' })}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:opacity-70"
                      style={{ color: '#6b7280' }}
                    >
                      Fecha {sortConfig.key === 'fechaImposicion' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                    </th>
                    <th 
                      onClick={() => setSortConfig({ key: 'monto', direction: sortConfig.key === 'monto' && sortConfig.direction === 'desc' ? 'asc' : 'desc' })}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:opacity-70"
                      style={{ color: '#6b7280' }}
                    >
                      Monto {sortConfig.key === 'monto' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Conducta</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: '#f3f4f6' }}>
                  {sortedData.filter(s => showCerrados || s.monto > 0).map((sancion, idx) => (
                    <tr 
                      key={sancion.id}
                      onClick={() => setExpandedCard(expandedCard === sancion.id ? null : sancion.id)}
                      className="cursor-pointer transition-colors"
                      style={{ backgroundColor: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#faf5ff'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <td className="px-4 py-3 text-sm font-mono" style={{ color: '#9ca3af' }}>{idx + 1}</td>
                      <td className="px-4 py-3">{getTipoBadge(sancion.tipo)}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium truncate max-w-xs" style={{ color: '#1b1b1e' }}>{sancion.entidad}</p>
                      </td>
                      <td className="px-4 py-3">{getSubsectorBadge(sancion.subsector)}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: '#6b7280' }}>
                        <Calendar className="w-3 h-3 inline mr-1" style={{ color: '#9ca3af' }} />
                        {sancion.fechaImposicion}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${Math.min((sancion.monto / topInfractores[0]?.monto || 1) * 100, 100)}%`,
                                backgroundColor: '#87d895'
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold" style={{ color: sancion.monto > 1000000 ? '#a663cc' : '#393e41' }}>
                            {formatMontoFull(sancion.monto)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm truncate max-w-xs" style={{ color: '#6b7280' }}>{sancion.conducta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Footer de tabla */}
            <div className="p-4 border-t flex justify-between items-center" style={{ backgroundColor: '#f8f8f8', borderColor: '#f3f4f6' }}>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Mostrando <span className="font-semibold" style={{ color: '#393e41' }}>{sortedData.filter(s => showCerrados || s.monto > 0).length}</span> de {sancionesData.length} registros
              </p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>Fuente: Registro de Sanciones CNBV • Publicación {CONFIG.fechaPublicacion}</p>
            </div>
          </div>
        )}

        {/* Análisis View */}
        {activeView === 'analisis' && (
          <div className="space-y-6">
            {/* Insights */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e5e5', borderLeftWidth: '4px', borderLeftColor: '#ff8361' }}>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#1b1b1e' }}>
                  🔥 Señal de Alerta: Casas de Bolsa
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4d4d4d' }}>
                  <strong style={{ color: '#1b1b1e' }}>GBM Grupo Bursátil Mexicano</strong> concentra el <span style={{ color: '#ff8361', fontWeight: 'bold' }}>31.5%</span> del monto total 
                  ($16.3M) con 9 sanciones relacionadas con deficiencias en sistemas PLD/FT.
                </p>
              </div>

              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e5e5', borderLeftWidth: '4px', borderLeftColor: '#a663cc' }}>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#1b1b1e' }}>
                  📊 Tendencia: Control Interno
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4d4d4d' }}>
                  Las <strong style={{ color: '#1b1b1e' }}>deficiencias en control interno</strong> son el principal driver en banca múltiple. 
                  El regulador prioriza supervisión de gobernanza operativa.
                </p>
              </div>

              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e5e5', borderLeftWidth: '4px', borderLeftColor: '#87d895' }}>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#1b1b1e' }}>
                  🏛️ Operativo: Centros Cambiarios
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4d4d4d' }}>
                  <strong style={{ color: '#1b1b1e' }}>11 centros cambiarios</strong> sancionados con multas uniformes de $226,280. 
                  Patrón de barrido supervisorio enfocado en reportes.
                </p>
              </div>

              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e5e5', borderLeftWidth: '4px', borderLeftColor: '#4d4d4d' }}>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#1b1b1e' }}>
                  ⚖️ Marco Legal Dominante
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4d4d4d' }}>
                  <strong style={{ color: '#1b1b1e' }}>LGOAAC</strong> lidera (reportes regulatorios), seguida de <strong style={{ color: '#1b1b1e' }}>LIC</strong> (control interno) 
                  y <strong style={{ color: '#1b1b1e' }}>LMV</strong> (sistemas de monitoreo).
                </p>
              </div>
            </div>

            {/* Recomendaciones */}
            <div className="rounded-xl border p-6" style={{ background: 'linear-gradient(135deg, #a663cc10 0%, #ff836110 100%)', borderColor: '#a663cc30' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#1b1b1e' }}>💡 Recomendaciones para Compliance Officers</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/80 rounded-lg p-4">
                  <p className="font-semibold text-sm mb-1" style={{ color: '#a663cc' }}>1. Controles PLD/FT</p>
                  <p className="text-xs" style={{ color: '#4d4d4d' }}>Revisar sistemas de monitoreo automatizado y documentación de clientes.</p>
                </div>
                <div className="bg-white/80 rounded-lg p-4">
                  <p className="font-semibold text-sm mb-1" style={{ color: '#a663cc' }}>2. Control Interno</p>
                  <p className="text-xs" style={{ color: '#4d4d4d' }}>Auditar cumplimiento de disposiciones prudenciales y segregación.</p>
                </div>
                <div className="bg-white/80 rounded-lg p-4">
                  <p className="font-semibold text-sm mb-1" style={{ color: '#a663cc' }}>3. Reportes</p>
                  <p className="text-xs" style={{ color: '#4d4d4d' }}>Verificar entrega oportuna de todos los reportes regulatorios.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-8" style={{ borderColor: '#e5e5e5' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a663cc 0%, #8b4db8 100%)' }}>
              <span className="text-white font-bold text-xs">360</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1b1b1e' }}>IMPACTO360</p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>by GMC360 • 360Educa</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: '#9ca3af' }}>
            <a href="https://www.gmc360.com.mx" target="_blank" rel="noopener" className="hover:opacity-70">gmc360.com.mx</a>
            <span>•</span>
            <a href="https://www.360educa.com" target="_blank" rel="noopener" className="hover:opacity-70">360educa.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
