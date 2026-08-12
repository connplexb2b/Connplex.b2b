import React, { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Sync value from props to editor HTML if it changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && !isUpdatingRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
      isUpdatingRef.current = false;
    }
  };

  const executeCommand = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    executeCommand('formatBlock', e.target.value);
    e.target.value = ''; // Reset
  };

  const insertImage = () => {
    const url = prompt('Enter Image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter Link URL (e.g., https://example.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  return (
    <div style={{ border: '1px solid #d1d1d6', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
      {/* Rich Text Editor Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.6rem', background: '#f8f8f8', borderBottom: '1px solid #d1d1d6', flexWrap: 'wrap' }}>
        
        {/* Paragraph Format Select */}
        <select 
          onChange={handleFormatChange}
          defaultValue=""
          style={{ padding: '0.2rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.8rem', background: '#fff', cursor: 'pointer', outline: 'none' }}
        >
          <option value="" disabled>Paragraph</option>
          <option value="p">Normal Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <span style={{ width: '1px', height: '1.2rem', background: '#d1d1d6', margin: '0 0.25rem' }}></span>

        {/* Formatting Buttons */}
        <button type="button" onClick={() => executeCommand('bold')} title="Bold" style={btnStyle}><i className="fa-solid fa-bold" style={{ fontSize: '0.82rem' }} /></button>
        <button type="button" onClick={() => executeCommand('italic')} title="Italic" style={btnStyle}><i className="fa-solid fa-italic" style={{ fontSize: '0.82rem' }} /></button>
        <button type="button" onClick={() => executeCommand('formatBlock', 'blockquote')} title="Blockquote" style={btnStyle}><i className="fa-solid fa-quote-left" style={{ fontSize: '0.82rem' }} /></button>

        <span style={{ width: '1px', height: '1.2rem', background: '#d1d1d6', margin: '0 0.25rem' }}></span>

        {/* Link / Media Insertion */}
        <button type="button" onClick={insertImage} title="Insert Image" style={btnStyle}><i className="fa-solid fa-image" style={{ fontSize: '0.82rem' }} /></button>
        <button type="button" onClick={insertLink} title="Insert Link" style={btnStyle}><i className="fa-solid fa-link" style={{ fontSize: '0.82rem' }} /></button>

        <span style={{ width: '1px', height: '1.2rem', background: '#d1d1d6', margin: '0 0.25rem' }}></span>

        {/* Undo/Redo */}
        <button type="button" onClick={() => executeCommand('undo')} title="Undo" style={btnStyle}><i className="fa-solid fa-undo" style={{ fontSize: '0.82rem' }} /></button>
        <button type="button" onClick={() => executeCommand('redo')} title="Redo" style={btnStyle}><i className="fa-solid fa-redo" style={{ fontSize: '0.82rem' }} /></button>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        style={{ minHeight: '240px', padding: '1rem', outline: 'none', fontSize: '0.9rem', lineHeight: 1.6, overflowY: 'auto' }}
        {...{ placeholder }}
      />
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '0.3rem 0.5rem',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#48484a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s',
};
