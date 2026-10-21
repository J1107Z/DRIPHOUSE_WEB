import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CATALOG_DIR = path.join(ROOT_DIR, 'DRIP HOUSE CATALOGO');
const OUTPUT_JSON = path.join(ROOT_DIR, 'src', 'data', 'products.json');

const SIZE_COMBINATIONS = [
  ['S', 'M', 'L', 'XL'],
  ['XS', 'S', 'M', 'L'],
  ['XS', 'S', 'M', 'L', 'XL'],
  ['M', 'L', 'XL'],
  ['S', 'M', 'L'],
];

function inferMetadata(folderName, fileBaseName, index) {
  const upperFile = fileBaseName.toUpperCase();

  switch (folderName) {
    case 'GODSPEED': {
      const isCap = upperFile.includes('TRUCKER') || upperFile.includes('CAP');
      const isHoodie = index % 4 === 0 && !isCap;
      const category = isCap ? 'Gorras' : isHoodie ? 'Hoodie' : 'Camisas';
      const titlePrefix = isCap
        ? 'Godspeed Legacy Trucker Cap'
        : isHoodie
          ? 'Godspeed Heavyweight Wash Hoodie'
          : 'Godspeed Limited Graphic Tee';
      return {
        brand: 'Godspeed',
        category,
        name: `${titlePrefix} #${String(index + 1).padStart(2, '0')}`,
        price: isCap ? 220000 : isHoodie ? 420000 : 280000 + (index % 5) * 15000,
      };
    }

    case 'GORRAS JORDAN-NIKE': {
      const isRise = upperFile.includes('RISE');
      const is5Panel = upperFile.includes('5+PNL');
      const isNike = index % 3 === 0;
      const cleanModel = isRise
        ? 'Jordan Rise Trucker Patch Cap'
        : is5Panel
          ? 'Pro 5-Panel Camp Cap'
          : 'Jumpman Pro Snapback Cap';
      return {
        brand: isNike ? 'Nike' : 'Jordan',
        category: 'Gorras',
        name: `${cleanModel} Ed. ${index + 1}`,
        price: 165000 + (index % 4) * 10000,
      };
    }

    case 'JORDAN': {
      const isHoodie =
        upperFile.includes('FLC') || upperFile.includes('PO') || index % 3 === 0;
      const sku = fileBaseName.replace(/\+/g, ' ').trim();
      return {
        brand: 'Jordan',
        category: isHoodie ? 'Hoodie' : 'Camisas',
        name: isHoodie
          ? `Jordan Flight Fleece Hoodie (${sku})`
          : `Jordan Statement Graphic Tee (${sku})`,
        price: isHoodie ? 380000 + (index % 4) * 20000 : 210000 + (index % 5) * 15000,
      };
    }

    case 'LIFE HUSTLER_S': {
      const isCap = upperFile.includes('GORRA') || index < 3;
      return {
        brand: 'Life Hustlers',
        category: isCap ? 'Gorras' : 'Camisas',
        name: isCap
          ? `Life Hustlers Club Rhinestone Cap #${index + 1}`
          : `Life Hustlers Street Luxury Tee #${index + 1}`,
        price: isCap ? 210000 + index * 10000 : 260000,
      };
    }

    case 'MIXED EMOTION': {
      const isHoodie = index % 3 === 0;
      return {
        brand: 'Mixed Emotion',
        category: isHoodie ? 'Hoodie' : 'Camisas',
        name: isHoodie
          ? `Mixed Emotion Distressed Zip Hoodie #${String(index + 1).padStart(2, '0')}`
          : `Mixed Emotion Rhinestone Oversized Tee #${String(index + 1).padStart(2, '0')}`,
        price: isHoodie ? 410000 + (index % 4) * 15000 : 275000 + (index % 5) * 12000,
      };
    }

    case 'NIKE_': {
      const isHoodie = index % 4 === 0;
      const sku = fileBaseName.replace(/\+/g, ' ').trim();
      return {
        brand: 'Nike',
        category: isHoodie ? 'Hoodie' : 'Camisas',
        name: isHoodie
          ? `Nike Sportswear Club Fleece Hoodie (${sku})`
          : `Nike Premium Heavyweight Tee (${sku})`,
        price: isHoodie ? 350000 + (index % 4) * 15000 : 195000 + (index % 5) * 10000,
      };
    }

    case 'PRESTIGE': {
      const isHoodie = upperFile.includes('PLOGO') || index % 2 === 0;
      return {
        brand: 'Prestige',
        category: isHoodie ? 'Hoodie' : 'Camisas',
        name: isHoodie
          ? `Prestige Star Studded Full-Zip Hoodie #${String(index + 1).padStart(2, '0')}`
          : `Prestige Gothic Graphic Oversized Tee #${String(index + 1).padStart(2, '0')}`,
        price: isHoodie ? 430000 + (index % 4) * 15000 : 290000 + (index % 4) * 10000,
      };
    }

    case 'SNEAKERS': {
      const readable = fileBaseName
        .replace(/\+/g, ' ')
        .replace(/_/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
      return {
        brand: 'Sneakers',
        category: 'Zapatos',
        name: `Sneakers Vault: ${readable}`,
        price: 580000 + (index % 6) * 45000,
      };
    }

    case 'SPRAYGROUD': {
      const code = fileBaseName.replace(/_/g, ' ').trim();
      return {
        brand: 'Sprayground',
        category: 'Bolso',
        name: `Sprayground Shark Limited Backpack (${code})`,
        price: 460000 + (index % 5) * 25000,
      };
    }

    default:
      return {
        brand: 'Godspeed',
        category: 'Camisas',
        name: `Drip House Exclusive ${fileBaseName}`,
        price: 250000,
      };
  }
}

async function generateProducts() {
  const folders = await fs.readdir(CATALOG_DIR, { withFileTypes: true });
  const products = [];
  let globalId = 1;

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;
    const folderPath = path.join(CATALOG_DIR, folder.name);
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    let folderIdx = 0;
    for (const file of files) {
      if (!file.isFile()) continue;
      const ext = path.extname(file.name).toLowerCase();
      if (ext !== '.webp') continue;

      const baseName = path.parse(file.name).name;
      const meta = inferMetadata(folder.name, baseName, folderIdx);

      // URL codificada para manejar espacios y signos '+' en nombres de archivo
      const encodedFolder = encodeURIComponent(folder.name);
      const encodedFile = encodeURIComponent(file.name);
      const imagePath = `/DRIP%20HOUSE%20CATALOGO/${encodedFolder}/${encodedFile}`;

      const sizes = SIZE_COMBINATIONS[(globalId - 1) % SIZE_COMBINATIONS.length];
      // 85% en existencia, 15% agotado para probar el filtro de disponibilidad
      const inStock = globalId % 7 !== 0;

      products.push({
        id: `dh-${String(globalId).padStart(3, '0')}`,
        image: imagePath,
        name: meta.name,
        brand: meta.brand,
        category: meta.category,
        price: meta.price,
        sizes,
        inStock,
      });

      globalId++;
      folderIdx++;
    }
  }

  await fs.mkdir(path.dirname(OUTPUT_JSON), { recursive: true });
  await fs.writeFile(OUTPUT_JSON, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`✅ Generado ${OUTPUT_JSON} con ${products.length} productos reales en .webp.`);
}

generateProducts().catch((err) => {
  console.error(err);
  process.exit(1);
});
