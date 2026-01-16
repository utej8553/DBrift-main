import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, RotateCcw, Trash2, Eye } from 'lucide-react';
import '../styles/detail-drawer.css';

export default function DatabaseDetailDrawer({ database, onClose, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // Guard against undefined database
  if (!database) {
    return null;
  }

  const handleCopyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Use actual database credentials from backend response
  const credentials = {
    host: database?.host || 'db.demo.app',
    port: database?.port || 5432,
    username: database?.username || 'N/A',
    password: database?.password || 'N/A',
    dbName: database?.dbName || 'N/A',
  };

  return (
    <>
      <motion.div
        className="drawer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="detail-drawer"
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="drawer-header">
          <h2>{database?.dbName || 'Database'}</h2>
          <button className="btn-ghost close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Database Info Section */}
        <div className="drawer-section">
          <h3>Database Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Type</label>
              <p>{database?.dbType || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Version</label>
              <p>{database?.dbVersion || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Status</label>
              <p>{database?.status || 'Active'}</p>
            </div>
            <div className="info-item">
              <label>Created</label>
              <p>{database?.createdAt ? new Date(database.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Description</label>
              <p>{database?.description || 'No description'}</p>
            </div>
          </div>
        </div>

        {/* Connection Details Section */}
        <div className="drawer-section">
          <h3>Connection Details</h3>
          <div className="credentials-list">
            <div className="cred-field">
              <label>Database Name</label>
              <div className="field-row">
                <code>{credentials.dbName}</code>
                <button
                  className="btn-ghost btn-icon"
                  onClick={() =>
                    handleCopyToClipboard(credentials.dbName, 'dbName')
                  }
                >
                  {copiedField === 'dbName' ? '✓' : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="cred-field">
              <label>Host</label>
              <div className="field-row">
                <code>{credentials.host}</code>
                <button
                  className="btn-ghost btn-icon"
                  onClick={() =>
                    handleCopyToClipboard(credentials.host, 'host')
                  }
                >
                  {copiedField === 'host' ? '✓' : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="cred-field">
              <label>Port</label>
              <div className="field-row">
                <code>{credentials.port}</code>
                <button
                  className="btn-ghost btn-icon"
                  onClick={() =>
                    handleCopyToClipboard(credentials.port.toString(), 'port')
                  }
                >
                  {copiedField === 'port' ? '✓' : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="cred-field">
              <label>Username</label>
              <div className="field-row">
                <code>{credentials.username}</code>
                <button
                  className="btn-ghost btn-icon"
                  onClick={() =>
                    handleCopyToClipboard(credentials.username, 'username')
                  }
                >
                  {copiedField === 'username' ? '✓' : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="cred-field">
              <label>Password</label>
              <div className="field-row">
                <code>
                  {showPassword
                    ? credentials.password
                    : '•'.repeat(16)}
                </code>
                <button
                  className="btn-ghost btn-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="drawer-section drawer-actions">
          <button className="btn-secondary btn-small" disabled>
            <RotateCcw size={16} />
            Rotate Password (coming soon)
          </button>
          <button
            className="btn-secondary btn-small btn-danger"
            onClick={() => {
              if (database?.id) {
                onDelete(database.id);
                onClose();
              }
            }}
          >
            <Trash2 size={16} />
            Delete Database
          </button>
        </div>
      </motion.div>
    </>
  );
}
