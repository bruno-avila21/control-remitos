# Control de Remitos — Comedor escolar (PWA)

App web instalable para verificar remitos de comedores escolares contra la receta requerida (cantidad por beneficiario × cupos). Marca lo que falta.

**Uso:** https://bruno-avila21.github.io/control-remitos/

## Instalar en el teléfono
- **Android (Chrome):** menú ⋮ → *Instalar app* / *Agregar a pantalla de inicio*.
- **iPhone (Safari):** Compartir → *Agregar a inicio*.

Funciona sin conexión una vez abierta la primera vez (excepto la lectura por IA).

## Cómo funciona
1. Elegís la **referencia** (receta) y los **cupos**.
2. Cargás el **remito** por: **Foto (IA)**, **PDF (IA)**, **Excel/CSV**, o a mano.
3. **Analizar** marca faltantes, sobrantes y condiciones incumplidas. Exporta a Excel / PDF.

## Notas
- La lectura por **foto/PDF** usa IA (Gemini o Claude) y requiere tu **API key**, que se carga en *Configuración* y se guarda **solo en tu dispositivo** (no hay servidor). Consume tu cupo del proveedor.
- El camino **Excel/CSV** funciona sin IA.
- El PDF procesa la **primera página**.

Todo corre en el navegador; los datos (recetas, condiciones, configuración) quedan en el `localStorage` del dispositivo.
