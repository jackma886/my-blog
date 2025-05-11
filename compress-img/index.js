const http = require('http');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define the server port
const PORT = 3000;

// Create the HTTP server
const server = http.createServer(async (req, res) => {
  // Extract the image path from the URL (e.g., /compressed-image/some-image-path)
  const urlParts = req.url.split('/');
  
  if (urlParts[1] === 'compressed-image' && urlParts[2]) {
    const imagePath = decodeURIComponent(urlParts.slice(2).join('/')); // Decode the path

    const fullImagePath = path.resolve(imagePath); // Resolve the full path for security

    try {
      // Check if the image file exists
      if (!fs.existsSync(fullImagePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Image not found');
        return;
      }

      // Read and compress the image to WebP format
      const compressedImage = await sharp(fullImagePath)
        .resize({ width: 800 }) // Resize the image to a width of 800px (adjust as needed)
        .webp({ quality: 70 }) // Compress the image with 70% quality and convert to WebP
        .toBuffer();

      // Send the compressed image to the client
      res.writeHead(200, { 'Content-Type': 'image/webp' });
      res.end(compressedImage);
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
  console.log(`Visit http://localhost:${PORT}/compressed-image/<image-path> to view the compressed image`);
});