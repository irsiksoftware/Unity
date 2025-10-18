// Simple HTTP server with Brotli support for testing Unity WebGL builds
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.br': 'application/octet-stream',
  '.data': 'application/octet-stream',
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      // Handle Brotli-compressed files
      if (filePath.endsWith('.br')) {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Encoding': 'br'  // This is the magic header!
        });
      } else if (filePath.endsWith('.gz')) {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Encoding': 'gzip'
        });
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
      }
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log('=======================================');
  console.log('  Candy Rush - Brotli Test Server');
  console.log('=======================================');
  console.log('');
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('');
  console.log('Open your browser to: http://localhost:8001');
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('');
});
