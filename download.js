const https = require('https');
const fs = require('fs');

const urls = [
  'https://media1.tenor.com/m/pZz_i1H5eJgAAAAC/peach-goma-peach-and-goma.gif',
  'https://media1.tenor.com/m/Z4O2nC0Y-sEAAAAC/peach-goma.gif',
  'https://media1.tenor.com/m/6U1o11OaOIEAAAAC/peach-goma-peach-and-goma.gif',
  'https://media1.tenor.com/m/nL1lQzXyEkkAAAAC/peach-goma-crying.gif',
  'https://media1.tenor.com/m/gUiu1zyxfzYAAAAC/bear-kiss-bear-kisses.gif'
];

const filenames = ['ask.gif', 'wait.gif', 'please.gif', 'cry.gif', 'yes.gif'];

async function download(url, dest) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(arrayBuffer));
  console.log(`Saved ${dest}`);
}

async function main() {
  if (!fs.existsSync('public/gifs')) {
    fs.mkdirSync('public/gifs', { recursive: true });
  }
  for (let i = 0; i < urls.length; i++) {
    try {
      await download(urls[i], `public/gifs/${filenames[i]}`);
    } catch(e) {
      console.error(e);
    }
  }
}
main();
