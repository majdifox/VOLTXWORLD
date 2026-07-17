
const fs = require("fs");
const svgPath = "./public/VOLTX.svg";
let content = fs.readFileSync(svgPath, "utf-8");

// Remove base64 image block
content = content.replace(/<g[^>]*id="glyphGroup_textPair_1772666483345.*?<\/g>\s*<\/g>\s*<\/g>/s, "");
// Remove hidden text block
content = content.replace(/<g[^>]*id="logo-title".*?<\/g>/s, "");

// Modify viewBox
content = content.replace(/width="1024" height="768" viewBox="0 0 1024 768"/, `width="412" height="96" viewBox="293 342 412 96"`);

fs.writeFileSync("./public/VOLTX.svg", content);
console.log("SVG cleaned!");

