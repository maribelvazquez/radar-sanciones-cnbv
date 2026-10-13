import React, { useState, useMemo, useEffect } from 'react';
import { FOCOS, focoDe } from './focosPLD.js';
import { Search, AlertTriangle, Building2, Download, ChevronDown, ChevronRight, Filter, Scale } from 'lucide-react';

// ============================================
// DATOS: public/data/meses.json (índice) y public/data/sanciones/AAAA-MM.json
// Los genera scripts/procesar_excel.py desde el Excel de la CNBV. No se editan a mano.
// ============================================
const DATA_URL = `${import.meta.env.BASE_URL}data`;

const cargarJSON = async (ruta) => {
  const res = await fetch(`${DATA_URL}/${ruta}`);
  if (!res.ok) throw new Error(`No se pudo cargar ${ruta} (${res.status})`);
  return res.json();
};

// Los textos de la pestaña Análisis siguen fijos (son de febrero) hasta que cada mes tenga su archivo en public/data/insights/
const MES_CON_INSIGHTS = '2026-02';


// Componente principal
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubsector, setSelectedSubsector] = useState('');
  const [selectedFoco, setSelectedFoco] = useState('');
  const [selectedMes, setSelectedMes] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'monto', direction: 'desc' });
  const [expandedRow, setExpandedRow] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [showCerrados, setShowCerrados] = useState(false);
  const [meses, setMeses] = useState([]);
  const [datosCargados, setDatosCargados] = useState({});
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  // Índice de meses: el mes por defecto es el más reciente
  useEffect(() => {
    cargarJSON('meses.json')
      .then(lista => {
        const ordenados = [...lista].sort((a, b) => a.id.localeCompare(b.id));
        setMeses(ordenados);
        setSelectedMes(ordenados.length ? ordenados[ordenados.length - 1].id : null);
        if (!ordenados.length) setCargando(false);
      })
      .catch(e => { setErrorCarga(e.message); setCargando(false); });
  }, []);

  // Carga bajo demanda: el mes elegido, o todos al pedir el acumulado
  useEffect(() => {
    if (!selectedMes || !meses.length) return;
    const pendientes = (selectedMes === 'todos' ? meses.map(m => m.id) : [selectedMes]).filter(id => !datosCargados[id]);
    if (!pendientes.length) { setCargando(false); return; }
    let cancelado = false;
    setCargando(true);
    Promise.all(pendientes.map(id => cargarJSON(`sanciones/${id}.json`).then(datos => [id, datos])))
      .then(pares => {
        if (cancelado) return;
        setDatosCargados(prev => ({ ...prev, ...Object.fromEntries(pares) }));
        setErrorCarga(null);
        setCargando(false);
      })
      .catch(e => { if (!cancelado) { setErrorCarga(e.message); setCargando(false); } });
    return () => { cancelado = true; };
  }, [selectedMes, meses, datosCargados]);

  const cambiarMes = (id) => {
    setSelectedMes(id);
    setSelectedSubsector('');
    setSelectedFoco('');
    setExpandedRow(null);
  };

  const datosPorMes = useMemo(() => {
    if (selectedMes === 'todos') return meses.flatMap(m => datosCargados[m.id] || []);
    return datosCargados[selectedMes] || [];
  }, [selectedMes, meses, datosCargados]);

  const stats = useMemo(() => {
    const totalMonto = datosPorMes.reduce((sum, s) => sum + s.monto, 0);
    const uniqueEntidades = [...new Set(datosPorMes.map(s => s.entidad))].length;
    const multas = datosPorMes.filter(s => s.tipo === 'Multa').length;
    const amonestaciones = datosPorMes.filter(s => s.tipo === 'Amonestación').length;
    const montoPromedio = datosPorMes.length > 0 ? totalMonto / datosPorMes.length : 0;
    return { totalMonto, uniqueEntidades, multas, amonestaciones, total: datosPorMes.length, montoPromedio };
  }, [datosPorMes]);

  const bySubsector = useMemo(() => {
    const grouped = {};
    datosPorMes.forEach(s => {
      if (!grouped[s.subsector]) grouped[s.subsector] = { count: 0, monto: 0 };
      grouped[s.subsector].count++;
      grouped[s.subsector].monto += s.monto;
    });
    return Object.entries(grouped).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.monto - a.monto);
  }, [datosPorMes]);

  const topInfractores = useMemo(() => {
    const grouped = {};
    datosPorMes.forEach(s => {
      if (!grouped[s.entidad]) grouped[s.entidad] = { count: 0, monto: 0, subsector: s.subsector };
      grouped[s.entidad].count++;
      grouped[s.entidad].monto += s.monto;
    });
    return Object.entries(grouped).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.monto - a.monto).slice(0, 10);
  }, [datosPorMes]);

  // TOP 5 CONDUCTAS MÁS SANCIONADAS
  const topConductas = useMemo(() => {
    const grouped = {};
    datosPorMes.forEach(s => {
      // Simplificar la conducta tomando solo la parte principal
      const conductaSimple = s.conducta.split(' - ')[1] || s.conducta;
      const ley = s.conducta.split(' - ')[0] || '';
      if (!grouped[conductaSimple]) grouped[conductaSimple] = { count: 0, monto: 0, ley };
      grouped[conductaSimple].count++;
      grouped[conductaSimple].monto += s.monto;
    });
    return Object.entries(grouped).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [datosPorMes]);

  const filteredData = useMemo(() => {
    return datosPorMes.filter(s => {
      const matchesSearch = s.entidad.toLowerCase().includes(searchTerm.toLowerCase()) || s.conducta.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubsector = !selectedSubsector || s.subsector === selectedSubsector;
      const foco = selectedFoco ? focoDe(s.conducta) : null;
      const matchesFoco = !selectedFoco || (selectedFoco === 'pld' ? foco !== null : foco === selectedFoco);
      return matchesSearch && matchesSubsector && matchesFoco;
    });
  }, [datosPorMes, searchTerm, selectedSubsector, selectedFoco]);

  // Lectura editorial PLD: se calcula sobre el período elegido (ver src/focosPLD.js)
  const lecturaPLD = useMemo(() => {
    const porFoco = Object.fromEntries(FOCOS.map(f => [f.id, { count: 0, monto: 0, entidades: new Set() }]));
    const entidadesPLD = new Set();
    let count = 0, monto = 0;
    datosPorMes.forEach(s => {
      const id = focoDe(s.conducta);
      if (!id) return;
      porFoco[id].count++; porFoco[id].monto += s.monto; porFoco[id].entidades.add(s.entidad);
      entidadesPLD.add(s.entidad); count++; monto += s.monto;
    });
    return { porFoco, count, monto, entidades: entidadesPLD.size };
  }, [datosPorMes]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortConfig.direction === 'asc') return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });
  }, [filteredData, sortConfig]);

  const subsectores = [...new Set(datosPorMes.map(s => s.subsector))].sort();
  const mesActual = meses.find(m => m.id === selectedMes);

  const formatMonto = (monto) => {
    if (monto >= 1000000) return `$${(monto / 1000000).toFixed(1)}M`;
    if (monto >= 1000) return `$${(monto / 1000).toFixed(0)}K`;
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(monto);
  };

  const formatMontoFull = (monto) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(monto);

  const fechaHoy = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const getTipoBadge = (tipo) => tipo === 'Multa' 
    ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium" style={{ backgroundColor: '#a663cc20', color: '#a663cc' }}>💰 Multa</span>
    : <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium" style={{ backgroundColor: '#ff836120', color: '#ff8361' }}>⚠️ Amon.</span>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa', fontFamily: "'Inter', sans-serif" }}>
      <header className="bg-white border-b" style={{ borderColor: '#e5e5e5' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #a663cc, #8b4db8)' }}>
                <span className="text-white font-bold text-lg">360</span>
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#1b1b1e' }}>Radar de Sanciones CNBV</h1>
                <p className="text-sm font-medium" style={{ color: '#a663cc' }}>IMPACTO360</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: '#4d4d4d' }}>{fechaHoy}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Selector de Mes */}
        <div className="bg-white rounded-xl border p-4 mb-6" style={{ borderColor: '#e5e5e5' }}>
          <div className="flex items-center gap-4">
            <Filter className="w-4 h-4" style={{ color: '#a663cc' }} />
            <span className="text-sm font-semibold" style={{ color: '#393e41' }}>Período:</span>
            <div className="flex flex-wrap gap-2">
              {meses.map(mes => (
                <button key={mes.id} onClick={() => cambiarMes(mes.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={selectedMes === mes.id ? { background: 'linear-gradient(135deg, #a663cc, #8b4db8)', color: 'white', boxShadow: '0 2px 8px rgba(166,99,204,0.3)' } : { backgroundColor: '#f3f4f6', color: '#4d4d4d' }}>
                  {mes.nombre}
                </button>
              ))}
              {meses.length > 1 && (
                <button onClick={() => cambiarMes('todos')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={selectedMes === 'todos' ? { background: 'linear-gradient(135deg, #87d895, #5cb85c)', color: 'white' } : { backgroundColor: '#f3f4f6', color: '#4d4d4d' }}>
                  📊 Acumulado 2026
                </button>
              )}
            </div>
            {mesActual && <span className="text-xs ml-auto" style={{ color: '#9ca3af' }}>Publicación CNBV: {mesActual.fechaPublicacion}</span>}
          </div>
        </div>

        {errorCarga && (
          <div className="rounded-xl border p-4 mb-6 text-sm" style={{ borderColor: '#ff836150', backgroundColor: '#ff836110', color: '#393e41' }}>
            No se pudieron cargar los datos: {errorCarga}. Recarga la página; si persiste, avisa al equipo de IMPACTO360.
          </div>
        )}
        {cargando && !errorCarga && (
          <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>Cargando datos…</p>
        )}

        {/* Stats */}
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

        {/* Tabs */}
        <div className="bg-white rounded-xl border p-2 mb-6" style={{ borderColor: '#e5e5e5' }}>
          <div className="flex items-center gap-2">
            {[{ id: 'dashboard', label: 'Dashboard', icon: '📊' }, { id: 'resumen', label: `Resumen (${stats.total})`, icon: '📋' }, { id: 'analisis', label: 'Análisis', icon: '🔍' }, { id: 'lecciones', label: 'Lecciones para auditoría', icon: '🎯' }].map(tab => (
              <button key={tab.id} onClick={() => setActiveView(tab.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={activeView === tab.id ? { background: 'linear-gradient(135deg, #a663cc, #8b4db8)', color: 'white', boxShadow: '0 4px 14px rgba(166,99,204,0.35)' } : { color: '#4d4d4d' }}>
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
            <div className="flex-1" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar entidad, conducta..."
                className="pl-9 pr-4 py-2 w-64 text-sm border rounded-lg focus:outline-none" style={{ backgroundColor: '#f8f8f8', borderColor: '#e5e5e5' }} />
            </div>
          </div>
        </div>

        {/* Dashboard */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Primera fila: Sectores y Top Entidades */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e5e5' }}>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#1b1b1e' }}>
                  <Building2 className="w-4 h-4" style={{ color: '#a663cc' }} /> Distribución por Sector
                </h3>
                <div className="space-y-3">
                  {bySubsector.slice(0, 6).map((sector, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm truncate pr-4" style={{ color: '#4d4d4d', maxWidth: '200px' }}>{sector.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>{sector.count}</span>
                          <span className="text-sm font-semibold" style={{ color: '#1b1b1e' }}>{formatMonto(sector.monto)}</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                        <div className="h-full rounded-full" style={{ width: `${stats.totalMonto > 0 ? (sector.monto / stats.totalMonto * 100) : 0}%`, background: 'linear-gradient(90deg, #a663cc, #c084fc)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e5e5' }}>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#1b1b1e' }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: '#ff8361' }} /> Top 10 Entidades por Monto
                </h3>
                <div className="space-y-2">
                  {topInfractores.slice(0, 6).map((inf, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: i === 0 ? '#ff8361' : i === 1 ? '#c9c9c9' : i === 2 ? '#cd7f32' : '#f3f4f6', color: i < 3 ? 'white' : '#6b7280' }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate font-medium" style={{ color: '#393e41' }}>{inf.name}</p>
                        <p className="text-xs" style={{ color: '#9ca3af' }}>{inf.count} sanc.</p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#a663cc' }}>{formatMonto(inf.monto)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Segunda fila: TOP 5 CONDUCTAS */}
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e5e5' }}>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#1b1b1e' }}>
                <Scale className="w-4 h-4" style={{ color: '#ff8361' }} /> Top 5 Conductas Más Sancionadas
              </h3>
              <div className="grid grid-cols-5 gap-4">
                {topConductas.map((cond, i) => (
                  <div key={i} className="p-4 rounded-lg border" style={{ borderColor: '#e5e5e5', backgroundColor: i === 0 ? '#fef3f2' : '#fafafa' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: i === 0 ? '#ff8361' : '#e5e7eb', color: i === 0 ? 'white' : '#6b7280' }}>{i + 1}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#a663cc20', color: '#a663cc' }}>{cond.ley}</span>
                    </div>
                    <p className="text-sm font-medium mb-2" style={{ color: '#393e41', lineHeight: '1.4' }}>{cond.name}</p>
                    <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: '#e5e5e5' }}>
                      <span className="text-lg font-bold" style={{ color: '#ff8361' }}>{cond.count}</span>
                      <span className="text-xs" style={{ color: '#9ca3af' }}>{formatMonto(cond.monto)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resumen - Tabla SIN fecha, CON conducta visible */}
        {activeView === 'resumen' && (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e5e5e5' }}>
            <div className="p-4 border-b flex items-center gap-4" style={{ borderColor: '#f3f4f6' }}>
              <select value={selectedSubsector} onChange={(e) => setSelectedSubsector(e.target.value)} className="px-3 py-2 text-sm border rounded-lg" style={{ backgroundColor: '#f8f8f8', borderColor: '#e5e5e5' }}>
                <option value="">Todos los subsectores</option>
                {subsectores.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={selectedFoco} onChange={(e) => setSelectedFoco(e.target.value)} className="px-3 py-2 text-sm border rounded-lg" style={{ backgroundColor: '#f8f8f8', borderColor: '#e5e5e5' }}>
                <option value="">Todas las conductas</option>
                <option value="pld">Solo conductas PLD (lectura IMPACTO360)</option>
                {FOCOS.map(f => <option key={f.id} value={f.id}>{f.titulo}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={showCerrados} onChange={() => setShowCerrados(!showCerrados)} className="sr-only peer" />
                  <div className="w-9 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" style={{ backgroundColor: showCerrados ? '#a663cc' : '#d1d5db' }} />
                </label>
                <span className="text-sm" style={{ color: '#4d4d4d' }}>Mostrar $0 ({datosPorMes.filter(s => s.monto === 0).length})</span>
              </div>
              <div className="flex-1" />
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium" style={{ color: '#a663cc' }}><Download className="w-4 h-4" /> Exportar Excel</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#f8f8f8' }}>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase w-8" style={{ color: '#6b7280' }}></th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase w-12" style={{ color: '#6b7280' }}>#</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase w-20" style={{ color: '#6b7280' }}>Tipo</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#6b7280', width: '25%' }}>Entidad</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#6b7280', width: '15%' }}>Subsector</th>
                    <th onClick={() => setSortConfig({ key: 'monto', direction: sortConfig.key === 'monto' && sortConfig.direction === 'desc' ? 'asc' : 'desc' })} className="px-3 py-3 text-left text-xs font-semibold uppercase cursor-pointer w-24" style={{ color: '#6b7280' }}>
                      Monto {sortConfig.key === 'monto' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase" style={{ color: '#6b7280' }}>Conducta</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.filter(s => showCerrados || s.monto > 0).map((sancion, idx) => (
                    <React.Fragment key={sancion.id}>
                      <tr onClick={() => setExpandedRow(expandedRow === sancion.id ? null : sancion.id)} className="cursor-pointer hover:bg-purple-50 border-b" style={{ borderColor: '#f3f4f6', backgroundColor: expandedRow === sancion.id ? '#faf5ff' : 'white' }}>
                        <td className="px-3 py-3">{expandedRow === sancion.id ? <ChevronDown className="w-4 h-4" style={{ color: '#a663cc' }} /> : <ChevronRight className="w-4 h-4" style={{ color: '#9ca3af' }} />}</td>
                        <td className="px-3 py-3 text-sm font-mono" style={{ color: '#9ca3af' }}>{idx + 1}</td>
                        <td className="px-3 py-3">{getTipoBadge(sancion.tipo)}</td>
                        <td className="px-3 py-3"><p className="text-sm font-medium truncate" style={{ color: '#1b1b1e', maxWidth: '250px' }} title={sancion.entidad}>{sancion.entidad}</p></td>
                        <td className="px-3 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border truncate" style={{ backgroundColor: '#f8f8f8', color: '#4d4d4d', borderColor: '#e5e5e5', maxWidth: '150px' }} title={sancion.subsector}>{sancion.subsector}</span></td>
                        <td className="px-3 py-3"><span className="text-sm font-semibold" style={{ color: sancion.monto > 1000000 ? '#a663cc' : '#393e41' }}>{formatMontoFull(sancion.monto)}</span></td>
                        <td className="px-3 py-3">
                          <p className="text-sm truncate" style={{ color: '#6b7280', maxWidth: '300px' }} title={sancion.conducta}>
                            {sancion.conducta}
                          </p>
                        </td>
                      </tr>
                      {expandedRow === sancion.id && (
                        <tr style={{ backgroundColor: '#faf5ff' }}>
                          <td colSpan={7} className="px-3 py-4">
                            <div className="ml-8 p-4 rounded-lg" style={{ backgroundColor: '#f3e8ff', border: '1px solid #e9d5ff' }}>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs font-semibold mb-1" style={{ color: '#7c3aed' }}>ENTIDAD COMPLETA:</p>
                                  <p className="text-sm" style={{ color: '#4d4d4d' }}>{sancion.entidad}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold mb-1" style={{ color: '#7c3aed' }}>CONDUCTA SANCIONADA:</p>
                                  <p className="text-sm" style={{ color: '#4d4d4d' }}>{sancion.conducta}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t flex justify-between items-center" style={{ backgroundColor: '#f8f8f8', borderColor: '#f3f4f6' }}>
              <p className="text-sm" style={{ color: '#6b7280' }}>Mostrando <span className="font-semibold" style={{ color: '#393e41' }}>{sortedData.filter(s => showCerrados || s.monto > 0).length}</span> de {datosPorMes.length} registros {mesActual && <span style={{ color: '#a663cc' }}>• {mesActual.nombre}</span>}</p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>Fuente: Registro de Sanciones CNBV {mesActual && `• ${mesActual.fechaPublicacion}`}</p>
            </div>
          </div>
        )}

        {/* Análisis */}
        {activeView === 'analisis' && selectedMes !== MES_CON_INSIGHTS && (
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e5e5', borderLeftWidth: '4px', borderLeftColor: '#a663cc' }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#1b1b1e' }}>🔍 Análisis en preparación</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#4d4d4d' }}>
              El análisis editorial de {selectedMes === 'todos' ? 'este período' : (mesActual ? mesActual.nombre : 'este mes')} está en preparación. Mientras tanto, las cifras del Dashboard y del Resumen ya reflejan el Registro de Sanciones de la CNBV.
            </p>
          </div>
        )}
        {activeView === 'analisis' && selectedMes === MES_CON_INSIGHTS && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: '🔥 Señal de Alerta: Banamex bajo la lupa', text: 'Banamex acumula 18 sanciones en Febrero (~$25M), dominando el ranking. Concentración inusual en reportes regulatorios y análisis de clientes.', color: '#ff8361' },
                { title: '🏦 Nuevo Actor: Banco S3 México', text: 'Banco S3 aparece con 16 sanciones por $14.5M, principalmente por cartera crediticia, reservas preventivas y registros contables. Señal de alerta para el sector.', color: '#a663cc' },
                { title: '💳 LTOSF Emergente: Banorte', text: 'Banorte recibe 10 sanciones por Ley de Transparencia en Operaciones del Sistema Financiero, relacionadas con redes de pagos con tarjeta y receptores de pagos.', color: '#87d895' },
                { title: '⚖️ Marco Legal: LIC domina', text: 'LIC lidera en Banca Múltiple; LACP protagoniza en SOFIPO/Populares; LRASCAP activa en cooperativas. LTOSF irrumpe como nuevo frente regulatorio.', color: '#4d4d4d' }
              ].map((insight, i) => (
                <div key={i} className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e5e5', borderLeftWidth: '4px', borderLeftColor: insight.color }}>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#1b1b1e' }}>{insight.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#4d4d4d' }}>{insight.text}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-6" style={{ background: 'linear-gradient(135deg, #a663cc10, #ff836110)', borderColor: '#a663cc30' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#1b1b1e' }}>💡 Recomendaciones para Compliance Officers</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { title: '1. Reportes Regulatorios', text: 'Prioridad máxima: verificar entrega oportuna de todos los reportes CNBV. El incumplimiento es el patrón más costoso en Feb 2026.' },
                  { title: '2. Cartera y Reservas', text: 'Revisar calificación de cartera crediticia y estimaciones preventivas. Banco S3 es la señal de alerta del mes.' },
                  { title: '3. Redes de Pago (LTOSF)', text: 'Si son adquirentes o agregadores: auditar contratos, monitoreo de controversias y cumplimiento de condiciones de participación.' }
                ].map((rec, i) => (
                  <div key={i} className="bg-white/80 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-1" style={{ color: '#a663cc' }}>{rec.title}</p>
                    <p className="text-xs" style={{ color: '#4d4d4d' }}>{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lecciones para auditoría (lectura editorial PLD) */}
        {activeView === 'lecciones' && (
          <div className="space-y-6">
            <div className="rounded-xl border p-6" style={{ background: 'linear-gradient(135deg, #a663cc10, #ff836110)', borderColor: '#a663cc30' }}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#1b1b1e' }}>🎯 Lecciones para auditoría: lo que la CNBV sanciona en materia de PLD</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#4d4d4d' }}>
                La multa rara vez llega por el caso sofisticado: llega por el control básico que no se pudo demostrar. Estos son los cinco focos donde se concentran las sanciones, con las cifras del período elegido ({selectedMes === 'todos' ? 'Acumulado 2026' : (mesActual ? mesActual.nombre : '')}).
              </p>
              <p className="text-xs leading-relaxed mt-3" style={{ color: '#6b7280' }}>
                Lectura editorial IMPACTO360: el Registro de la CNBV no etiqueta las sanciones como PLD. Agrupamos por lo que dice la conducta sancionada; las cifras salen del Registro. Cada registro es una sanción, no necesariamente un caso distinto.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'SANCIONES PLD', value: lecturaPLD.count, sub: 'Registros', color: '#a663cc' },
                { label: '% DEL PERÍODO', value: `${stats.total > 0 ? (lecturaPLD.count / stats.total * 100).toFixed(0) : 0}%`, sub: `de ${stats.total} sanciones`, color: '#ff8361' },
                { label: 'MONTO PLD', value: formatMonto(lecturaPLD.monto), sub: `${stats.totalMonto > 0 ? (lecturaPLD.monto / stats.totalMonto * 100).toFixed(0) : 0}% del monto total`, color: '#87d895' },
                { label: 'ENTIDADES', value: lecturaPLD.entidades, sub: 'Únicas', color: '#a663cc' }
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-xl border p-4" style={{ borderColor: '#e5e5e5' }}>
                  <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>{card.label}</p>
                  <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>{card.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[...FOCOS].sort((a, b) => lecturaPLD.porFoco[b.id].count - lecturaPLD.porFoco[a.id].count).map(foco => {
                const d = lecturaPLD.porFoco[foco.id];
                return (
                  <div key={foco.id} className="bg-white rounded-xl border p-5 flex flex-col" style={{ borderColor: '#e5e5e5', borderLeftWidth: '4px', borderLeftColor: foco.color }}>
                    <h4 className="text-sm font-semibold mb-3" style={{ color: '#1b1b1e' }}>{foco.icono} {foco.titulo}</h4>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div><p className="text-xl font-bold" style={{ color: foco.color }}>{d.count}</p><p className="text-xs" style={{ color: '#9ca3af' }}>Sanciones</p></div>
                      <div><p className="text-xl font-bold" style={{ color: '#1b1b1e' }}>{formatMonto(d.monto)}</p><p className="text-xs" style={{ color: '#9ca3af' }}>Monto</p></div>
                      <div><p className="text-xl font-bold" style={{ color: '#1b1b1e' }}>{d.count > 0 ? formatMonto(d.monto / d.count) : '—'}</p><p className="text-xs" style={{ color: '#9ca3af' }}>Promedio</p></div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden mb-1" style={{ backgroundColor: '#f3f4f6' }}>
                      <div className="h-full rounded-full" style={{ width: `${lecturaPLD.count > 0 ? (d.count / lecturaPLD.count * 100) : 0}%`, backgroundColor: foco.color }} />
                    </div>
                    <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{lecturaPLD.count > 0 ? (d.count / lecturaPLD.count * 100).toFixed(0) : 0}% de las sanciones PLD · {d.entidades.size} entidades</p>
                    <p className="text-xs leading-relaxed flex-1" style={{ color: '#4d4d4d' }}><span className="font-semibold" style={{ color: foco.color }}>Qué revisar: </span>{foco.revisar}</p>
                    <button onClick={() => { setSelectedFoco(foco.id); setShowCerrados(true); setActiveView('resumen'); }} className="mt-4 text-xs font-medium text-left" style={{ color: '#a663cc' }}>
                      Ver estos {d.count} registros →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t bg-white mt-8" style={{ borderColor: '#e5e5e5' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a663cc, #8b4db8)' }}>
              <span className="text-white font-bold text-xs">360</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1b1b1e' }}>IMPACTO360</p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>by GMC360 • 360Educa</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: '#9ca3af' }}>
            <a href="https://www.gmc360.com.mx" target="_blank" rel="noopener">gmc360.com.mx</a>
            <span>•</span>
            <a href="https://www.360educa.com" target="_blank" rel="noopener">360educa.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
