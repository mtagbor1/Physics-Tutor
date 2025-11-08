
import React, { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SavedItem } from '../../types';
import { copyToClipboard, downloadAsText, formatContentForExport } from '../../utils/exportUtils';

interface ActionToolbarProps {
  content: any;
  topic: string;
  type: SavedItem['type'];
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({ content, topic, type }) => {
  const [savedItems, setSavedItems] = useLocalStorage<SavedItem[]>('savedItems', []);
  const [isSaved, setIsSaved] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'Copy' | 'Copied!' | 'Failed'>('Copy');

  const contentRef = useRef(content);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Use a ref to store the content to avoid re-running useEffect when content object changes but is logically the same.
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    // Check if the current item is already saved
    const contentString = JSON.stringify(contentRef.current);
    const alreadyExists = savedItems.some(item => 
        item.type === type && 
        item.topic === topic && 
        JSON.stringify(item.content) === contentString
    );
    setIsSaved(alreadyExists);
  }, [savedItems, topic, type]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    if (isSaved) return;

    const newItem: SavedItem = {
      id: `${type}-${topic}-${Date.now()}`,
      type,
      topic,
      content: contentRef.current,
      timestamp: new Date().toISOString(),
    };
    setSavedItems([...savedItems, newItem]);
    setIsSaved(true);
  };

  const handleCopy = async () => {
    const formattedContent = formatContentForExport({ type, content: contentRef.current });
    const success = await copyToClipboard(formattedContent);
    setCopyStatus(success ? 'Copied!' : 'Failed');
    setTimeout(() => setCopyStatus('Copy'), 2000);
  };

  const handleDownload = () => {
    const formattedContent = formatContentForExport({ type, content: contentRef.current });
    downloadAsText(formattedContent, `${type}_${topic}`);
    setShowExportMenu(false);
  };

  return (
    <div className="flex items-center gap-2 mt-4 not-prose">
      <button
        onClick={handleSave}
        disabled={isSaved}
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
      >
        {isSaved ? 'Saved' : 'Save'}
      </button>
      <div className="relative" ref={exportMenuRef}>
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
        >
          Export
        </button>
        {showExportMenu && (
          <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-gray-700 border border-gray-600 rounded-md shadow-lg">
            <div className="py-1">
              <button
                onClick={handleCopy}
                className="block w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-indigo-600 hover:text-white"
              >
                {copyStatus} to Clipboard
              </button>
              <button
                onClick={handleDownload}
                className="block w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-indigo-600 hover:text-white"
              >
                Download as Text
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
