import fs from 'fs';
import path from 'path';

function htmlToJsx(html, componentName) {
  // Extract body content
  let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : html;

  // Remove scripts
  bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Replace class with className, for with htmlFor
  let jsx = bodyContent
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    // Close void tags
    .replace(/<(input|img|br|hr)([^>]*?)(?<!\/)>/g, '<$1$2 />');

  // Specific fixes (e.g., SVG elements, comment fixes)
  // Some inline style fixing (crude but usually enough for simple stuff)
  jsx = jsx.replace(/style="([^"]*)"/g, (match, styleString) => {
    const styleObj = styleString.split(';').filter(s => s.trim()).reduce((acc, styleProperty) => {
      let [key, value] = styleProperty.split(':');
      if (key && value) {
        key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
        acc.push(`${key}: "${value.trim().replace(/"/g, "'")}"`);
      }
      return acc;
    }, []);
    return `style={{ ${styleObj.join(', ')} }}`;
  });
  
  // Replace html comments with jsx comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

  return `
import React from 'react';

export default function ${componentName}() {
  return (
    <>
      ${jsx}
    </>
  );
}
`;
}

const inputPath = process.argv[2];
const componentName = process.argv[3];
const outputPath = path.join('src', 'pages', `${componentName}.jsx`);

const html = fs.readFileSync(inputPath, 'utf8');
const jsxOutput = htmlToJsx(html, componentName);

if (!fs.existsSync(path.join('src', 'pages'))) {
  fs.mkdirSync(path.join('src', 'pages'), { recursive: true });
}
fs.writeFileSync(outputPath, jsxOutput);
console.log(`Created ${outputPath}`);
