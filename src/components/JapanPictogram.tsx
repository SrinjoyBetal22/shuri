import React from 'react';

// Common icon names for easy reference:
// fuji-san, jinja, kaminarimon, onsen, sushi, matcha, bonsai, samurai, ninja, etc.

interface JapanPictogramProps {
  name: string;
  size?: number | string;
  className?: string;
  color?: string;
}

const JapanPictogram: React.FC<JapanPictogramProps> = ({ 
  name, 
  size = 24, 
  className = '', 
  color 
}) => {
  return (
    <i 
      className={`jpic jpic-${name} ${className}`} 
      style={{ 
        fontSize: size, 
        ...(color && { color }),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontStyle: 'normal',
        lineHeight: 1
      }} 
    />
  );
};

export default JapanPictogram;
