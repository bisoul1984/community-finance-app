const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const User = require('../models/User');
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

// Get documents by type for the authenticated user
router.get('/type/:documentType', async (req, res) => {
  try {
    const { documentType } = req.params;
    const documents = await Document.find({ 
      user: req.user.id, 
      documentType: documentType 
    }).sort({ createdAt: -1 });
    
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents by type:', error);
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
      // Delete the uploaded file since we won't save it
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

    // Populate user info
    await document.populate('user', 'name email');

    res.status(201).json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error.message.includes('Invalid file type')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Get a specific document
router.get('/:documentId', async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.documentId,
      user: req.user.id
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download a document
router.get('/:documentId/download', async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.documentId,
      user: req.user.id
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(document.filePath, document.originalName);
  } catch (error) {
    console.error('Error downloading document:', error);
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

    // Delete file from filesystem
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

// Get document statistics for user
router.get('/stats/summary', async (req, res) => {
  try {
    const requiredTypes = ['identification', 'income', 'bank_statement'];
    const optionalTypes = ['utility_bill', 'employment_letter', 'business_plan', 'collateral', 'other'];

    const [requiredDocs, optionalDocs, totalDocs] = await Promise.all([
      Document.countDocuments({ 
        user: req.user.id, 
        documentType: { $in: requiredTypes } 
      }),
      Document.countDocuments({ 
        user: req.user.id, 
        documentType: { $in: optionalTypes } 
      }),
      Document.countDocuments({ user: req.user.id })
    ]);

    const stats = {
      required: {
        uploaded: requiredDocs,
        total: requiredTypes.length,
        percentage: Math.round((requiredDocs / requiredTypes.length) * 100)
      },
      optional: {
        uploaded: optionalDocs,
        total: optionalTypes.length
      },
      total: totalDocs,
      completionStatus: requiredDocs === requiredTypes.length ? 'complete' : 'incomplete'
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching document stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all documents (admin only)
router.get('/admin/all', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const documents = await Document.find()
      .populate('user', 'name email role')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    console.error('Error fetching all documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Verify a document (admin only)
router.put('/admin/:documentId/verify', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, verificationNotes } = req.body;
    
    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const document = await Document.findById(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.status = status;
    document.verifiedBy = req.user.id;
    document.verifiedAt = new Date();
    document.verificationNotes = verificationNotes;

    await document.save();

    await document.populate('user', 'name email');
    await document.populate('verifiedBy', 'name email');

    res.json(document);
  } catch (error) {
    console.error('Error verifying document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 