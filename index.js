const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Go to the GitHub Trending page
  await page.goto('https://github.com/trending');
  
  // Extract repo details
  const repoData = await page.evaluate(() => {
    const repos = document.querySelectorAll('article.Box-row');
    const repoArray = [];
    
    for (let i = 0; i < repos.length; i++) {
      const repo = {};
      const repoTitle = repos[i].querySelector('h1 a').innerText.trim();
      const repoURL = 'https://github.com' + repos[i].querySelector('h1 a').getAttribute('href');
      const repoDesc = repos[i].querySelector('p').innerText.trim();
      const stars = repos[i].querySelectorAll('a.muted-link')[0].innerText.trim();
      const forks = repos[i].querySelectorAll('a.muted-link')[1].innerText.trim();
      const lang = repos[i].querySelector('span[itemprop="programmingLanguage"]').innerText.trim();
      
      repo['title'] = repoTitle;
      repo['url'] = repoURL;
      repo['description'] = repoDesc;
      repo['stars'] = stars;
      repo['forks'] = forks;
      repo['language'] = lang;
      
      repoArray.push(repo);
    }
    
    return repoArray;
  });
  
  // Click on the "Developers" tab
  const developerTab = await page.$('nav.UnderlineNav-body a[href="/trending/developers"]');
  await developerTab.click();
  await page.waitForSelector('div.explore-content');
  
  // Click on the "JavaScript" tab
  const jsTab = await page.$('div.explore-content a[href="/trending/developers?since=daily&language=javascript"]');
  await jsTab.click();
  await page.waitForSelector('div.explore-content');
  
  // Extract developer details
  const devData = await page.evaluate(() => {
    const devs = document.querySelectorAll('article.Box-row');
    const devArray = [];
    
    for (let i = 0; i < devs.length; i++) {
      const dev = {};
      const devName = devs[i].querySelector('h1 a').innerText.trim();
      const devUsername = devs[i].querySelector('p.f4').innerText.trim().replace(/^\((.*)\)$/, '$1');
      const devRepoName = devs[i].querySelector('h1 a').getAttribute('href').split('/').pop();
      const devRepoDesc = devs[i].querySelector('p.text-gray').innerText.trim();
      
      dev['name'] = devName;
      dev['username'] = devUsername;
      dev['repoName'] = devRepoName;
      dev['repoDescription'] = devRepoDesc;
      
      devArray.push(dev);
    }
    
    return devArray;
  });
  
  // Store the data in a JSON object and console.log it
  const data = {
    'repositories': repoData,
    'developers': devData
  };
  
  console.log(JSON.stringify(data));
  
  await browser.close();
})();
