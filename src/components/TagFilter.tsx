import React, { useState, useRef, useEffect } from 'react';
import { Tag, X } from '@phosphor-icons/react';
import styles from './TagFilter.module.css';

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelect: (tag: string | null) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTag, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button 
        className={`${styles.trigger} ${selectedTag ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Filter by tag"
      >
        <Tag size={14} />
        {selectedTag ? (
          <>
            <span className={styles.tagName}>{selectedTag}</span>
            <X size={12} className={styles.clearIcon} onClick={(e) => { e.stopPropagation(); onSelect(null); }} />
          </>
        ) : (
          <span className={styles.label}>Tags</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {tags.map(tag => (
            <button 
              key={tag} 
              className={`${styles.item} ${selectedTag === tag ? styles.selected : ''}`}
              onClick={() => { onSelect(tag); setIsOpen(false); }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagFilter;
