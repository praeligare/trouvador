import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';

const WEBSITE_URL = 'https://warehouse-theme-metal.myshopify.com';
const storeUrl = `${WEBSITE_URL}/collections/sales`;

const response = await gotScraping(storeUrl);
const html = response.body;

const $ = cheerio.load(html);

const productLinks = $('a.product-item__title');
const productUrls = [];

for (const link of productLinks) {
  const relativeUrl = $(link).attr('href');
  const absoluteUrl = new URL(relativeUrl, WEBSITE_URL);
  productUrls.push(absoluteUrl.href);
}

for (const url of productUrls) {
  try {
    const productResponse = await gotScraping(url);
    const productHtml = productResponse.body;

    const $productPage = cheerio.load(productHtml);
    const productPageTitle = $productPage('h1').text().trim();

    console.log(productPageTitle);
  } catch (error) {
    console.error(error.message, url);
  }
}
