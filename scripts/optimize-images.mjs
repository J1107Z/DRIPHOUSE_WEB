import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CATALOG_DIR = path.join(ROOT_DIR, 'DRIP HOUSE CATALOGO');
const BACKUP_DIR = path.join(ROOT_DIR, '_backup_catalogo');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const VALID_EXTENSIONS = new Set(['.webp', '.avif', '.jpg', '.jpeg', '.png']);
const QUALITY = 82;
const DELETE_ORIGINALS = process.argv.includes('--delete');

// Desactivar caché de archivos de libvips para evitar bloqueos de archivos en Windows
sharp.cache(false);

/**
 * Recorre recursivamente un directorio y devuelve todas las rutas de archivos.
 */
async function getAllFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const nested = await getAllFiles(fullPath);
      files.push(...nested);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (VALID_EXTENSIONS.has(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

/**
 * Mueve o respalda el archivo original antes de reemplazarlo/eliminarlo.
 */
async function backupOrDeleteOriginal(filePath, isSamePath = false) {
  if (DELETE_ORIGINALS) {
    if (!isSamePath) {
      await fs.unlink(filePath);
    }
    return;
  }

  const relativePath = path.relative(CATALOG_DIR, filePath);
  const backupTarget = path.join(BACKUP_DIR, relativePath);
  await fs.mkdir(path.dirname(backupTarget), { recursive: true });

  if (isSamePath) {
    // Copia al backup antes de sobrescribir el .webp
    await fs.copyFile(filePath, backupTarget);
  } else {
    // Mueve el archivo original (.avif, .jpg, .png, etc.) a la carpeta de backup
    await fs.rename(filePath, backupTarget);
  }
}

/**
 * Copia recursivamente una carpeta hacia public/ para que Next.js sirva los archivos estáticos.
 */
async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function syncStaticAssetsToPublic() {
  console.log('\n🔄 Sincronizando recursos estáticos con la carpeta /public de Next.js...');
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  const rootAssets = [
    'ICONOAPP.png',
    'LOGO_1_ TipoLetra.png',
    'LOGO_2_(boton-ome).jpg',
    'Contacto.png',
  ];

  for (const asset of rootAssets) {
    const src = path.join(ROOT_DIR, asset);
    const dest = path.join(PUBLIC_DIR, asset);
    try {
      await fs.copyFile(src, dest);
    } catch {
      // Ignorar si alguno no existe
    }
  }

  // Sincronizar Clientes y DRIP HOUSE CATALOGO
  try {
    await copyDirectory(path.join(ROOT_DIR, 'Clientes'), path.join(PUBLIC_DIR, 'Clientes'));
  } catch (err) {
    console.warn('⚠️ No se pudo copiar la carpeta Clientes:', err.message);
  }

  try {
    // Limpiar catálogo previo en public para no dejar archivos antiguos (.avif/.jpg)
    await fs.rm(path.join(PUBLIC_DIR, 'DRIP HOUSE CATALOGO'), { recursive: true, force: true });
    await copyDirectory(CATALOG_DIR, path.join(PUBLIC_DIR, 'DRIP HOUSE CATALOGO'));
  } catch (err) {
    console.warn('⚠️ No se pudo copiar DRIP HOUSE CATALOGO a public:', err.message);
  }
  console.log('✅ Recursos sincronizados en /public.');
}

async function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

async function main() {
  console.log('==============================================================');
  console.log('🖤 DRIP HOUSE - OPTIMIZADOR Y ESTANDARIZADOR DE IMÁGENES (.webp)');
  console.log('==============================================================');
  console.log(`📂 Carpeta origen : ${CATALOG_DIR}`);
  console.log(
    `🛡️ Modo respaldo  : ${DELETE_ORIGINALS ? 'Eliminar originales (--delete)' : `Mover originales a ${BACKUP_DIR}`}`
  );
  console.log(`⚙️ Calidad WebP   : ${QUALITY}%\n`);

  const files = await getAllFiles(CATALOG_DIR);
  console.log(`🔍 Se encontraron ${files.length} imágenes para procesar...\n`);

  let convertedCount = 0;
  let optimizedWebpCount = 0;
  let skippedWebpCount = 0;
  let errorCount = 0;
  let totalBytesBefore = 0;
  let totalBytesAfter = 0;

  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase();
    const relativeName = path.relative(CATALOG_DIR, filePath);

    try {
      const statBefore = await fs.stat(filePath);
      totalBytesBefore += statBefore.size;

      // Leer en memoria primero evita que Windows bloquee el descriptor de archivo al sobrescribir
      const inputBuffer = await fs.readFile(filePath);
      const outputBuffer = await sharp(inputBuffer)
        .rotate() // Respeta orientación EXIF sin perder resolución
        .webp({
          quality: QUALITY,
          effort: 6,
          smartSubsample: true,
        })
        .toBuffer();

      if (ext === '.webp') {
        // Si ya es .webp, solo reemplazamos si el nuevo buffer pesa menos
        if (outputBuffer.length < statBefore.size) {
          await backupOrDeleteOriginal(filePath, true);
          await fs.writeFile(filePath, outputBuffer);
          totalBytesAfter += outputBuffer.length;
          optimizedWebpCount++;
          console.log(
            `✨ [OPTIMIZADO] ${relativeName} (${await formatBytes(statBefore.size)} -> ${await formatBytes(outputBuffer.length)})`
          );
        } else {
          totalBytesAfter += statBefore.size;
          skippedWebpCount++;
          console.log(`👌 [YA ÓPTIMO]  ${relativeName} (${await formatBytes(statBefore.size)})`);
        }
      } else {
        // Convertir de .avif, .jpg, .jpeg o .png a .webp
        const parsed = path.parse(filePath);
        const targetWebpPath = path.join(parsed.dir, `${parsed.name}.webp`);

        await fs.writeFile(targetWebpPath, outputBuffer);
        await backupOrDeleteOriginal(filePath, false);

        totalBytesAfter += outputBuffer.length;
        convertedCount++;
        console.log(
          `🔄 [CONVERTIDO] ${relativeName} -> ${parsed.name}.webp (${await formatBytes(statBefore.size)} -> ${await formatBytes(outputBuffer.length)})`
        );
      }
    } catch (err) {
      errorCount++;
      console.error(`❌ [ERROR] No se pudo procesar ${relativeName}: ${err.message}`);
    }
  }

  const savedBytes = Math.max(0, totalBytesBefore - totalBytesAfter);
  const savedPercent =
    totalBytesBefore > 0 ? ((savedBytes / totalBytesBefore) * 100).toFixed(1) : '0.0';

  console.log('\n==============================================================');
  console.log('📊 RESUMEN DE OPTIMIZACIÓN');
  console.log('==============================================================');
  console.log(`✔️ Imágenes convertidas a .webp : ${convertedCount}`);
  console.log(`✔️ .webp recomprimidos          : ${optimizedWebpCount}`);
  console.log(`✔️ .webp ya óptimos intactos    : ${skippedWebpCount}`);
  console.log(`❌ Errores                      : ${errorCount}`);
  console.log(`📦 Peso total original          : ${await formatBytes(totalBytesBefore)}`);
  console.log(`🪶 Peso total estandarizado     : ${await formatBytes(totalBytesAfter)}`);
  console.log(`📉 Ahorro total                 : ${await formatBytes(savedBytes)} (${savedPercent}%)`);
  console.log('==============================================================');

  await syncStaticAssetsToPublic();
}

main().catch((err) => {
  console.error('Error fatal en el script de optimización:', err);
  process.exit(1);
});
