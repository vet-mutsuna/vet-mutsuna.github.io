const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define the folder to start from
const rootFolder = './'; // Replace with the path to your root folder

// Function to traverse a directory recursively
const traverseAndCompress = async (folder) => {
  const entries = fs.readdirSync(folder, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(folder, entry.name);

    if (entry.isDirectory()) {
      // Recurse into subdirectories
      await traverseAndCompress(fullPath);
    } else if (entry.isFile() && isImageFile(entry.name)) {
      // Compress the image file
      await compressImage(fullPath);
    }
  }
};

// Function to check if a file is an image
const isImageFile = (fileName) => {
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp'];
  const ext = path.extname(fileName).toLowerCase();
  return supportedExtensions.includes(ext);
};

// Function to compress an image
const compressImage = async (filePath) => {
  try {
    const tempFilePath = `${filePath}.tmp`;

    // Compress the image
    await sharp(filePath)
      .jpeg({ quality: 80 }) // Adjust quality as needed
      .toFile(tempFilePath);

    // Replace the original file with the compressed one
    fs.renameSync(tempFilePath, filePath);
    console.log(`Compressed: ${filePath}`);
  } catch (error) {
    console.error(`Error compressing ${filePath}:`, error);
  }
};

// Start the process
(async () => {
  try {
    console.log(`Starting compression in folder: ${rootFolder}`);
    await traverseAndCompress(rootFolder);
    console.log('Compression complete.');
  } catch (error) {
    console.error('Error during compression process:', error);
  }
})();
