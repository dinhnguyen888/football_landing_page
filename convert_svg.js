const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, 'src', 'img', 'logo_saovang_clean.png');
const base64Data = fs.readFileSync(imgPath).toString('base64');
const svgPath = path.join(__dirname, 'src', 'img', 'logo_saovang.svg');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <image href="data:image/png;base64,${base64Data}" width="1024" height="1024" />
</svg>
`;

fs.writeFileSync(svgPath, svgContent, 'utf-8');
console.log('Successfully created standalone SVG from exact artwork!');
