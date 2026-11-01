# 🎯 Radar de Sanciones CNBV

**IMPACTO360** by GMC360 / 360Educa

---

## 📋 Guía Rápida de Actualización Mensual

Los datos ya **no** se pegan en `src/App.jsx`: viven como JSON estático en `public/data/` y los genera un script a partir del Excel oficial de la CNBV.

### Cada mes (la CNBV publica a mitad de mes; el recordatorio es el día 18)

1. **Descargar el Excel** del Registro de Sanciones Administrativas → cnbv.gob.mx/sanciones. El Excel **no** se sube al repo (está en `.gitignore`).
2. **Adjuntar el Excel en el chat mensual de Claude.** Claude trabaja directo sobre `main`, sin ramas ni revisión previa.
3. **Correr el script** (Claude lo hace en el chat; para correrlo a mano):
   ```bash
   pip install openpyxl
   python scripts/procesar_excel.py ruta/al/Sanciones_CNBV.xlsx --meses 2026-10
   ```
   El script escribe `public/data/sanciones/AAAA-MM.json` y reconstruye `public/data/meses.json`. Puede correrse varias veces sin duplicar datos. Al final imprime registros y suma de montos por mes contra el Excel, y falla si algo no cuadra o si aparece un tipo de sanción no previsto. Conviene comparar también los meses ya publicados: la CNBV a veces retira sanciones de su registro.
4. **Escribir el análisis** del mes nuevo (`insights/AAAA-MM.json`) y actualizar el del acumulado (`insights/acumulado.json`), con cifras verificadas contra los JSON.
5. **Publicar:** `npm run build` debe pasar; se sube a `main` y Netlify despliega solo. Maribel revisa en el sitio publicado y pide cambios si hace falta.

### Estructura de datos

| Ruta | Contenido |
|------|-----------|
| `public/data/meses.json` | Índice de meses: `id, nombre, fechaPublicacion, registros` |
| `public/data/sanciones/AAAA-MM.json` | Registros del mes: `id, mes, entidad, subsector, tipo, monto, conducta, fechaImposicion` |
| `public/data/insights/AAAA-MM.json` | Análisis editorial del mes (pestaña Análisis): `mes, alertas[{titulo, texto, color}], recomendaciones[{titulo, texto}]`. Se escribe a mano en el chat mensual, después de correr el script; si falta, la pestaña muestra «en preparación» |
| `public/data/insights/acumulado.json` | Análisis del Acumulado 2026, mismo formato; se actualiza cada mes |

- `mes` es el mes de la **Fecha de Publicación** de la CNBV (no el de imposición).
- **No se edita a mano ningún JSON de datos**: todo sale del script.
- La app abre en el mes más reciente de `meses.json` y carga los demás bajo demanda.

---

## 🎨 Paleta de Colores 360EDUCA

| Color | Hex | Uso |
|-------|-----|-----|
| 💜 Violeta | `#a663cc` | Acento principal |
| 🧡 Coral | `#ff8361` | Alertas |
| 💚 Verde | `#87d895` | Éxito |
| ⬛ Gris | `#4d4d4d` | Texto secundario |
| ⬛ Oscuro | `#393e41` | Texto principal |
| ⬛ Negro | `#1b1b1e` | Contraste |

---

## 🔗 Enlaces

- **App**: [tu-url.netlify.app]
- **GMC360**: https://gmc360.com.mx
- **360Educa**: https://360educa.com

---

**IMPACTO360** • Cumplimiento, Innovación y Estrategia Empresarial
