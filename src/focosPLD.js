// ============================================
// LECTURA EDITORIAL IMPACTO360 — focos PLD
// ============================================
// El Registro de la CNBV NO etiqueta las sanciones como PLD. Este archivo es una
// lectura editorial: agrupa por lo que dice el texto de la conducta sancionada.
// Los datos (public/data/sanciones/*.json) no se tocan; los focos se calculan en la
// app. Para ajustar la lectura se edita solo este archivo.
// Una conducta cae en el primer foco cuyo patrón aparezca en su texto.

export const FOCOS = [
  {
    id: 'reportes',
    titulo: 'Reportes a tiempo',
    icono: '🗂️',
    color: '#ff8361',
    patrones: ['reportes regulatorios en la materia'],
    revisar: 'Cuando falla un reporte, lo que falta es la evidencia. Prueba: calendario de reportes con responsable y acuse de cada envío.',
  },
  {
    id: 'cliente',
    titulo: 'Identificación del cliente',
    icono: '👥',
    color: '#a663cc',
    patrones: ['identificación de clientes', 'conocimiento del cliente'],
    revisar: 'Un expediente incompleto o desactualizado no se puede defender. Prueba: muestra de clientes con expediente completo y vigente.',
  },
  {
    id: 'monitoreo',
    titulo: 'Monitoreo y análisis de operaciones',
    icono: '⚙️',
    color: '#87d895',
    patrones: ['sistemas automatizados de detección', 'análisis y evaluación de operaciones'],
    revisar: 'Tener sistema no basta: cada alerta necesita análisis documentado y cierre. Prueba: seguir una alerta desde que se genera hasta su dictamen.',
  },
  {
    id: 'cumplimiento',
    titulo: 'Área de cumplimiento y capacitación',
    icono: '🛡️',
    color: '#4d4d4d',
    patrones: ['área de cumplimiento', 'programas de capacitación en la materia'],
    revisar: 'El área y su capacitación se demuestran con evidencia: recursos, reporte al órgano de gobierno y constancias del programa.',
  },
  {
    id: 'medidas',
    titulo: 'Medidas y procedimientos',
    icono: '📘',
    color: '#8b4db8',
    patrones: ['medidas y procedimientos'],
    revisar: 'El manual y la práctica deben coincidir. Prueba: tomar un procedimiento del manual y reconstruir un caso real que lo cumpla.',
  },
];

// Devuelve el id del foco de una conducta, o null si no cae en ninguno.
export const focoDe = (conducta) => {
  const texto = String(conducta || '').toLowerCase();
  const foco = FOCOS.find(f => f.patrones.some(p => texto.includes(p)));
  return foco ? foco.id : null;
};
