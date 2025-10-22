const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'File/Folder name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['file', 'folder'],
      required: true,
    },
    s3Key: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
fileSchema.index({ projectId: 1, parentId: 1 });
fileSchema.index({ projectId: 1, type: 1 });

// Validate s3Key is present for files
fileSchema.pre('save', function (next) {
  if (this.type === 'file' && !this.s3Key) {
    next(new Error('s3Key is required for file type'));
  } else {
    next();
  }
});

module.exports = mongoose.model('File', fileSchema);
