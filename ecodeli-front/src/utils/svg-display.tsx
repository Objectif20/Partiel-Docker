import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DisplaySVGProps {
  svgPath: string;
  colorMapping: Record<string, string>;
}

export const DisplaySVG: React.FC<DisplaySVGProps> = ({ svgPath, colorMapping }) => {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    axios
      .get(svgPath, { responseType: 'text' })
      .then(({ data }) => {
        let modifiedSvg = data.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');

        Object.entries(colorMapping).forEach(([className, newColor]) => {
          const regex = new RegExp(`class=["']?${className}["']?`, 'g');
          modifiedSvg = modifiedSvg.replace(regex, `fill="${newColor}"`);
        });

        setSvgContent(modifiedSvg);
      })
      .catch(error => console.error('Erreur lors du chargement du SVG:', error));
  }, [svgPath, colorMapping]);

  return <div dangerouslySetInnerHTML={{ __html: svgContent }} />;
};
