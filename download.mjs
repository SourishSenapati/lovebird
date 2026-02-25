import fs from 'fs';

const urls = [
  'https://raw.githubusercontent.com/DzarelDeveloper/Img/main/goma-peach/1.gif',
  'https://raw.githubusercontent.com/DzarelDeveloper/Img/main/goma-peach/2.gif',
  'https://raw.githubusercontent.com/DzarelDeveloper/Img/main/goma-peach/3.gif',
  'https://raw.githubusercontent.com/DzarelDeveloper/Img/main/goma-peach/4.gif',
  'https://media1.tenor.com/m/gUiu1zyxfzYAAAAC/bear-kiss-bear-kisses.gif' // This one worked
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
      console.error(`Failed ${filenames[i]}:`, e.message);
    }
  }
}
main();
