
import React from 'react';
import { Card } from './common/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SavedItem } from '../types';
import { ActionToolbar } from './common/ActionToolbar';
import ReactMarkdown from 'react-markdown';
import { formatContentForExport } from '../utils/exportUtils';

const SavedItemCard: React.FC<{ item: SavedItem; onDelete: (id: string) => void }> = ({ item, onDelete }) => {
    const getSnippet = () => {
        const text = formatContentForExport(item);
        return text.split('\n')[0].slice(0, 150) + '...';
    };

    return (
        <Card className="flex flex-col">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-indigo-400 font-semibold">{item.type}</p>
                        <h3 className="text-lg font-bold text-gray-100">{item.topic}</h3>
                        <p className="text-xs text-gray-500 mb-2">Saved on {new Date(item.timestamp).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => onDelete(item.id)} className="text-gray-500 hover:text-red-400 transition-colors text-xl">&times;</button>
                </div>
                <div className="prose prose-invert prose-sm max-w-none prose-p:text-gray-400 mt-2">
                    <ReactMarkdown>{getSnippet()}</ReactMarkdown>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700/50">
                <ActionToolbar content={item.content} topic={item.topic} type={item.type} />
            </div>
        </Card>
    );
};

export const SavedItemsViewer: React.FC = () => {
    const [savedItems, setSavedItems] = useLocalStorage<SavedItem[]>('savedItems', []);

    const handleDelete = (id: string) => {
        setSavedItems(savedItems.filter(item => item.id !== id));
    };

    const sortedItems = [...savedItems].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div>
            <h2 className="text-2xl font-bold text-indigo-400 mb-6 text-center">Saved Items</h2>
            {sortedItems.length === 0 ? (
                <Card>
                    <p className="text-center text-gray-400">You have no saved items yet. Generate some content and click 'Save' to see it here.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedItems.map(item => (
                        <SavedItemCard key={item.id} item={item} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};
