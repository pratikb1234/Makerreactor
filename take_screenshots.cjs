const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log('Navigating to nuvuschool.org/mission-and-values...');
  await page.goto('https://nuvuschool.org/mission-and-values', { waitUntil: 'networkidle2' });
  
  const screenshotsDir = '/Users/pratik/.gemini/antigravity/brain/d2ee47ae-3358-4d6c-aa83-1ba076278a89/screenshots';
  if (!fs.existsSync(screenshotsDir)){
      fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Taking full page screenshot...');
  await page.screenshot({ path: `${screenshotsDir}/nuvuschool_mission_fullpage.png`, fullPage: true });
  
  // Take viewport screenshots as you scroll down
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = 900;
  let numScreenshots = Math.ceil(pageHeight / viewportHeight);
  
  // Limit to max 5 parts to avoid taking too many
  numScreenshots = Math.min(numScreenshots, 5);
  
  for (let i = 0; i < numScreenshots; i++) {
      console.log(`Taking screenshot section ${i+1}/${numScreenshots}`);
      await page.evaluate((y) => { window.scrollTo(0, y); }, i * viewportHeight);
      await new Promise(r => setTimeout(r, 500)); // wait for scroll/animations
      await page.screenshot({ path: `${screenshotsDir}/nuvuschool_mission_part${i+1}.png` });
  }

  await browser.close();
  console.log('Screenshots saved!');
})();
