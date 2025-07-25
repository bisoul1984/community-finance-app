const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const auth = require('../middleware/auth');
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, DOC, DOCX files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Apply auth middleware to all routes
router.use(auth);

// Get all documents for the authenticated user
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload a new document
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { documentType } = req.body;
    
    if (!documentType) {
      return res.status(400).json({ message: 'Document type is required' });
    }

    // Check if user already has this document type
    const existingDoc = await Document.findOne({
      user: req.user.id,
      documentType: documentType
    });

    if (existingDoc) {
      // Delete the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        message: `Document of type '${documentType}' already exists. Please delete the existing document first.` 
      });
    }

    const document = new Document({
      user: req.user.id,
      documentType: documentType,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      filePath: req.file.path,
      isRequired: ['identification', 'income', 'bank_statement'].includes(documentType)
    });

    await document.save();
    await document.populate('user', 'name email');

    res.status(201).json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a document
router.delete('/:documentId', async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.documentId,
      user: req.user.id
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete the file
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(req.params.documentId);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get document statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id });
    
    const requiredTypes = ['identification', 'income', 'bank_statement'];
    const requiredDocs = documents.filter(doc => requiredTypes.includes(doc.documentType));
    const optionalDocs = documents.filter(doc => !requiredTypes.includes(doc.documentType));
    
    const stats = {
      total: documents.length,
      required: {
        total: requiredTypes.length,
        uploaded: requiredDocs.length,
        percentage: Math.round((requiredDocs.length / requiredTypes.length) * 100)
      },
      optional: {
        total: optionalDocs.length
      },
      byStatus: {
        uploaded: documents.filter(doc => doc.status === 'uploaded').length,
        verified: documents.filter(doc => doc.status === 'verified').length,
        rejected: documents.filter(doc => doc.status === 'rejected').length,
        pending: documents.filter(doc => doc.status === 'pending').length
      }
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching document stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 