/*
 * @Author: Lu
 * @Date: 2023-10-30 10:41:34
 * @LastEditTime: 2023-10-30 10:48:45
 * @LastEditors: Lu
 * @Description: 
 */
import lighthouse from 'lighthouse';
import fs from 'fs';
import * as chromeLauncher from 'chrome-launcher';

export const executeLighthouse = async (url, reportPath) => {
  const chrome = await chromeLauncher.launch();
  const options = {logLevel: 'info', output: 'json', onlyCategories: ['performance'], port: chrome.port, preset: 'desktop', screenEmulation: { width: 1000 } };
  const runnerResult = await lighthouse(url, options);

  fs.writeFileSync(reportPath, runnerResult.report);

  console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

  await chrome.kill();
}