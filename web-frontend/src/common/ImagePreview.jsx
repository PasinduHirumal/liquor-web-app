import React from 'react';
import { Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const ImagePreview = ({ src, onRemove }) => {
  return (
    <div
      className="position-relative"
      style={{
        width: '150px',
        height: '150px',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <img
        src={src}
        alt="preview"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <Button
        variant="danger"
        size="sm"
        className="position-absolute top-0 end-0"
        style={{
          padding: '0.2rem 0.5rem',
          fontSize: '0.8rem',
          lineHeight: 1,
          borderRadius: '0 0 0 6px',
        }}
        onClick={onRemove}
        title="Remove"
      >
        <FaTrash size={14} />
      </Button>
    </div>
  );
};

export default ImagePreview;