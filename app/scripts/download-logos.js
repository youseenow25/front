const fs = require('fs');
const path = require('path');
const https = require('https');
const { createCanvas } = require('canvas');

const brands = [
  "Acne Studios", "Adidas", "Amazon", "Apple", "Arc'teryx", "Argos", 
  "Balenciaga", "Bape", "Best Secret", "Boots", "Breuninger", "Broken Planet", 
  "Bulgari", "Burberry", "Canada Goose", "Cartier", "Cettire", "Chanel", 
  "Chrono24", "Corteiz", "Culture Kings", "De Bijenkorf", "Denim Tears", 
  "Dior", "Dyson", "eBay", "END.", "Farfetch", "Flannels", "Flight Club", 
  "Frasers", "Gallery Dept", "GOAT", "Gucci", "Harrods", "Hermès", 
  "JD Sports", "John Lewis", "Loro Piana", "Louis Vuitton", "Maison Margiela", 
  "Moncler", "Neiman Marcus", "Nike", "Nike SNKRS", "Nordstrom", "The North Face", 
  "Off-White", "Pacsun", "Pop Mort", "Prada", "Saint Laurent", "Sephora", 
  "Sp5der", "SSENSE", "Stanley", "StockX", "Stüssy", "Supreme", "TaylorMade Golf", 
  "Trapstar", "UGG", "Vinted", "Vivienne Westwood", "Xerjoff", "Yeezy Gap", "Zalando"
];

// Domain mappings for Clearbit
const brandDomains = {
  "Acne Studios": "acnestudios.com",
  "Adidas": "adidas.com",
  "Amazon": "amazon.com",
  "Apple": "apple.com",
  "Arc'teryx": "arcteryx.com",
  "Argos": "argos.co.uk",
  "Balenciaga": "balenciaga.com",
  "Bape": "bape.com",
  "Best Secret": "bestsecret.com",
  "Boots": "boots.com",
  "Breuninger": "breuninger.com",
  "Broken Planet": "brokenplanetmarket.com",
  "Bulgari": "bulgari.com",
  "Burberry": "burberry.com",
  "Canada Goose": "canadagoose.com",
  "Cartier": "cartier.com",
  "Cettire": "cettire.com",
  "Chanel": "chanel.com",
  "Chrono24": "chrono24.com",
  "Corteiz": "corteiz.com",
  "Culture Kings": "culturekings.com",
  "De Bijenkorf": "debijenkorf.nl",
  "Denim Tears": "denimtears.com",
  "Dior": "dior.com",
  "Dyson": "dyson.com",
  "eBay": "ebay.com",
  "END.": "endclothing.com",
  "Farfetch": "farfetch.com",
  "Flannels": "flannels.com",
  "Flight Club": "flightclub.com",
  "Frasers": "frasers.com",
  "Gallery Dept": "gallerydept.com",
  "GOAT": "goat.com",
  "Gucci": "gucci.com",
  "Harrods": "harrods.com",
  "Hermès": "hermes.com",
  "JD Sports": "jdsports.co.uk",
  "John Lewis": "johnlewis.com",
  "Loro Piana": "loropiana.com",
  "Louis Vuitton": "louisvuitton.com",
  "Maison Margiela": "maisonmargiela.com",
  "Moncler": "moncler.com",
  "Neiman Marcus": "neimanmarcus.com",
  "Nike": "nike.com",
  "Nike SNKRS": "nike.com",
  "Nordstrom": "nordstrom.com",
  "The North Face": "thenorthface.com",
  "Off-White": "off---white.com",
  "Pacsun": "pacsun.com",
  "Pop Mort": "popmort.com",
  "Prada": "prada.com",
  "Saint Laurent": "ysl.com",
  "Sephora": "sephora.com",
  "Sp5der": "sp5der.com",
  "SSENSE": "ssense.com",
  "Stanley": "stanley1913.com",
  "StockX": "stockx.com",
  "Stüssy": "stussy.com",
  "Supreme": "supremenewyork.com",
  "TaylorMade Golf": "taylormadegolf.com",
  "Trapstar": "trapstar.com",
  "UGG": "ugg.com",
  "Vinted": "vinted.com",
  "Vivienne Westwood": "viviennewestwood.com",
  "Xerjoff": "xerjoff.com",
  "Yeezy Gap": "gap.com",
  "Zalando": "zalando.com"
};

// Alternative logo sources
const getLogoUrls = (brand) => {
  const domain = brandDomains[brand];
  const urls = [];
  
  if (domain) {
    // Clearbit API (free tier)
    urls.push(`https://logo.clearbit.com/${domain}?size=800`);
    
    // Google Favicon API
    urls.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`);
    
    // Favicon kit
    urls.push(`https://api.faviconkit.com/${domain}/256`);
  }
  
  // DuckDuckGo favicon as backup
  if (domain) {
    urls.push(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
  }
  
  return urls;
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };
    
    https.get(url, options, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          
          // Check if file has content and is a valid image
          const stats = fs.statSync(filepath);
          if (stats.size > 100) { // Minimum file size check
            resolve();
          } else {
            fs.unlinkSync(filepath); // Delete empty/invalid file
            reject(new Error('Downloaded file is too small or invalid'));
          }
        });
      } else {
        reject(new Error(`Failed to download: ${url} - Status: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function createTextLogo(brand, filepath) {
  return new Promise((resolve) => {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 800, 400);
    
    // Brand name text
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split long brand names
    const words = brand.split(' ');
    if (words.length > 2) {
      const firstLine = words.slice(0, 2).join(' ');
      const secondLine = words.slice(2).join(' ');
      ctx.fillText(firstLine, 400, 170);
      ctx.fillText(secondLine, 400, 230);
    } else {
      ctx.fillText(brand, 400, 200);
    }
    
    // Add subtle border
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 800, 400);
    
    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);
    resolve();
  });
}

function sanitizeFilename(brandName) {
  return brandName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

async function tryDownloadBrand(brand, filepath, maxRetries = 3) {
  const urls = getLogoUrls(brand);
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    for (const url of urls) {
      try {
        console.log(`  Trying: ${url}`);
        await downloadImage(url, filepath);
        return true; // Success
      } catch (error) {
        console.log(`    Failed: ${error.message}`);
        // Continue to next URL
      }
    }
    
    // Wait before retry
    if (attempt < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return false; // All attempts failed
}

async function downloadAllLogos() {
  const logosDir = path.join(process.cwd(), 'public', 'brand-logos');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
  }

  const results = [];
  
  for (const brand of brands) {
    const filename = `${sanitizeFilename(brand)}.png`;
    const filepath = path.join(logosDir, filename);
    
    // Skip if already exists and has content
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 100) {
        console.log(`✅ ${brand} - Already exists`);
        results.push({ brand, filename, status: 'cached' });
        continue;
      }
    }
    
    console.log(`\n🔄 Downloading ${brand}...`);
    
    try {
      const success = await tryDownloadBrand(brand, filepath);
      
      if (success) {
        results.push({ brand, filename, status: 'success' });
        console.log(`✅ ${brand} - Downloaded successfully`);
      } else {
        // Create text-based logo as fallback
        console.log(`  Creating text logo for ${brand}...`);
        await createTextLogo(brand, filepath);
        results.push({ brand, filename, status: 'text_logo' });
        console.log(`⚠️  ${brand} - Created text logo`);
      }
      
      // Add delay to be respectful to servers
      await new Promise(resolve => setTimeout(resolve, 800));
      
    } catch (error) {
      console.log(`❌ ${brand} - Complete failure: ${error.message}`);
      results.push({ brand, filename, status: 'failed', error: error.message });
    }
  }

  // Generate manifest
  const manifest = {
    generated: new Date().toISOString(),
    total: brands.length,
    successful: results.filter(r => r.status === 'success').length,
    text_logos: results.filter(r => r.status === 'text_logo').length,
    cached: results.filter(r => r.status === 'cached').length,
    failed: results.filter(r => r.status === 'failed').length,
    logos: results.reduce((acc, result) => {
      if (result.status !== 'failed') {
        acc[result.brand] = `/brand-logos/${result.filename}`;
      }
      return acc;
    }, {})
  };

  fs.writeFileSync(
    path.join(logosDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('\n=== DOWNLOAD SUMMARY ===');
  console.log(`Total brands: ${brands.length}`);
  console.log(`✅ Downloaded: ${manifest.successful}`);
  console.log(`⚠️  Text Logos: ${manifest.text_logos}`);
  console.log(`📁 Cached: ${manifest.cached}`);
  console.log(`❌ Failed: ${manifest.failed}`);
  console.log(`📄 Manifest: public/brand-logos/manifest.json`);
  
  if (manifest.failed > 0) {
    console.log('\nFailed brands:');
    results.filter(r => r.status === 'failed').forEach(r => {
      console.log(`  - ${r.brand}`);
    });
  }
}

// Install canvas dependency if not already installed
function checkDependencies() {
  try {
    require('canvas');
  } catch (error) {
    console.log('\n⚠️  Please install canvas dependency:');
    console.log('npm install canvas');
    console.log('\nOn Windows, you might need additional dependencies:');
    console.log('https://github.com/Automattic/node-canvas#compiling');
    process.exit(1);
  }
}

// Run the script
checkDependencies();
downloadAllLogos().catch(console.error);