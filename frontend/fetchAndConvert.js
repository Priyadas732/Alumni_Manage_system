import fs from 'fs';
import path from 'path';
import https from 'https';

const jsonPath = "C:/Users/pd282/.gemini/antigravity-ide/brain/f2db7656-d1be-49fc-b74c-664c71863dfd/.system_generated/steps/21/output.txt";
const outputDir = path.join('src', 'pages');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function htmlToJsx(html, componentName) {
  let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : html;
  
  bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  let jsx = bodyContent
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/onclick=/g, 'onClick=')
    .replace(/tabindex=/g, 'tabIndex=')
    .replace(/readonly=/g, 'readOnly=')
    .replace(/<(input|img|br|hr)([^>]*?)(?<!\/)>/g, '<$1$2 />');
    
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
  
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
  
  return `import React from 'react';\n\nexport default function ${componentName}() {\n  return (\n    <>\n      ${jsx}\n    </>\n  );\n}\n`;
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => reject(err));
  });
}

async function main() {
  const data = fs.readFileSync(jsonPath, 'utf8');
  const parsed = JSON.parse(data);
  
  for (const screen of parsed.screens) {
    const title = screen.title.split(' (')[0].replace(/[^a-zA-Z0-9]/g, ''); // e.g. "Connect Hub" -> "ConnectHub"
    const url = screen.htmlCode.downloadUrl;
    console.log(`Fetching ${title}...`);
    try {
      const html = await fetchUrl(url);
      const jsx = htmlToJsx(html, title);
      fs.writeFileSync(path.join(outputDir, `${title}.jsx`), jsx);
      console.log(`Saved ${title}.jsx`);
    } catch(e) {
      console.error(`Failed ${title}: `, e);
    }
  }
}

main();
