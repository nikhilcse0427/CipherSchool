const fs = require('fs').promises;
const path = require('path');

// Use local file storage for development (no AWS needed)
const STORAGE_DIR = path.join(__dirname, '..', 'storage');

// Ensure storage directory exists
const ensureStorageDir = async () => {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating storage directory:', error);
  }
};

/**
 * Upload file content to local storage
 * @param {string} key - File path key
 * @param {string} content - File content
 * @param {string} contentType - MIME type (ignored for local storage)
 * @returns {Promise} Upload result
 */
const uploadToS3 = async (key, content, contentType = 'text/plain') => {
  await ensureStorageDir();
  const filePath = path.join(STORAGE_DIR, key);
  const dir = path.dirname(filePath);
  
  // Create directory structure
  await fs.mkdir(dir, { recursive: true });
  
  // Write file
  await fs.writeFile(filePath, content, 'utf-8');
  
  return { Location: filePath, Key: key };
};

/**
 * Get file content from local storage
 * @param {string} key - File path key
 * @returns {Promise<string>} File content
 */
const getFromS3 = async (key) => {
  const filePath = path.join(STORAGE_DIR, key);
  const content = await fs.readFile(filePath, 'utf-8');
  return content;
};

/**
 * Delete file from local storage
 * @param {string} key - File path key
 * @returns {Promise} Delete result
 */
const deleteFromS3 = async (key) => {
  const filePath = path.join(STORAGE_DIR, key);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
  return { success: true };
};

/**
 * Delete multiple files from local storage
 * @param {Array<string>} keys - Array of file path keys
 * @returns {Promise} Delete result
 */
const deleteMultipleFromS3 = async (keys) => {
  if (keys.length === 0) return;

  const deletePromises = keys.map(key => deleteFromS3(key));
  await Promise.all(deletePromises);
  
  return { success: true };
};

module.exports = {
  uploadToS3,
  getFromS3,
  deleteFromS3,
  deleteMultipleFromS3,
};
