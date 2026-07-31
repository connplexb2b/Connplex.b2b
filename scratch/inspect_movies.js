const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../scratch/all-movies.json');
const content = fs.readFileSync(filePath, 'utf8');
console.log("Includes '6a5ba':", content.includes("6a5ba"));
console.log("Includes '6a5ba6c9bb1d9a7721b13eca':", content.includes("6a5ba6c9bb1d9a7721b13eca"));
console.log("Includes '6a5ba7ddbb1d9a7721ca4761':", content.includes("6a5ba7ddbb1d9a7721ca4761"));
console.log("Includes '6a5ba85abb1d9a7721caff44':", content.includes("6a5ba85abb1d9a7721caff44"));
console.log("Includes '6a5ba985bb1d9a7721cccb0e':", content.includes("6a5ba985bb1d9a7721cccb0e"));
