const http = require('http');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { promisify } = require('util');
const convert = require('heic-convert');

// Define the server port
const PORT = 3000;

// Define the cache directory
const CACHE_DIR = path.resolve('cache');

// Ensure the cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

// Create the HTTP server
const server = http.createServer(async (req, res) => {
  // Extract the image path from the URL (e.g., /img/some-image-path)
  const urlParts = req.url.split('/');

  if (urlParts[1] === 'img' && urlParts[2]) {
    const imagePath = decodeURIComponent(urlParts.slice(2).join('/')); // Decode the path
    const fullImagePath = path.resolve('img' + path.sep + imagePath); // Resolve the full path for security

    try {
      // Check if the image file exists
      if (!fs.existsSync(fullImagePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Image not found');
        return;
      }

      // Get the file's last modified time
      const fileStat = fs.statSync(fullImagePath);
      const lastModified = fileStat.mtime.toUTCString();

      // Check for If-Modified-Since header
      if (req.headers['if-modified-since'] === lastModified) {
        res.writeHead(304); // Not Modified
        res.end();
        return;
      }

      // if it's video
      const lowPath = imagePath.toLowerCase();
      const isMov = lowPath.endsWith('mov');
      const isMp4 = lowPath.endsWith('mp4');

      if (isMov || isMp4) {
        const videoStream = fs.createReadStream(fullImagePath);

        res.writeHead(200, {
          'Content-Type': isMov ? 'video/quicktime' : 'video/mp4',
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          'Last-Modified': lastModified,
        });
        videoStream.pipe(res);

        return;
      }

      // Define the cached file path with invalidation based on last modified time
      const cacheFilePath = path.join(CACHE_DIR, `${path.basename(imagePath)}-${fileStat.mtimeMs}.webp`);

      if (fs.existsSync(cacheFilePath)) {
        const cachedImage = await fs.promises.readFile(cacheFilePath);
        res.writeHead(200, {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=31536000',
          'Last-Modified': lastModified,
        });
        res.end(cachedImage);

        return;
      } else {
        console.log('Processing new image:', fullImagePath);

        let compressedImage;
        if (fullImagePath.toLowerCase().indexOf('.heic') !== -1) {
          const inputBuffer = await promisify(fs.readFile)(fullImagePath);
          const outputBuffer = await convert({
            buffer: inputBuffer, // the HEIC file buffer
            format: 'JPEG',      // output format
            quality: 1           // the jpeg compression quality, between 0 and 1
          });
          // Create a sharp instance from the buffer
          compressedImage = await sharp(outputBuffer)
            .resize({ width: 800 }) // Resize the image to a width of 800px
            .webp({ quality: 70 })  // Convert to WebP format with 70% quality
            .toBuffer();
        } else {
          compressedImage = await sharp(fullImagePath)
            .resize({ width: 800 }) // Resize the image to a width of 800px (adjust as needed)
            .webp({ quality: 70 })  // Compress the image with 70% quality and convert to WebP
            .toBuffer();
        }

        // Save the compressed image to the cache
        await fs.promises.writeFile(cacheFilePath, compressedImage);
        console.log('Image compressed and cached:', cacheFilePath);

        // Add HTTP caching headers
        res.writeHead(200, {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          'Last-Modified': lastModified,
        });
        res.end(compressedImage);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  } else {
    // Handle other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/img/<image-path> to view the compressed and cached image`);
});