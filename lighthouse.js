/*
 * @Author: Lu
 * @Date: 2023-10-30 10:41:34
 * @LastEditTime: 2023-10-30 17:33:04
 * @LastEditors: Lu
 * @Description:
 */
import lighthouse from "lighthouse";
import fs from "fs";
import * as chromeLauncher from "chrome-launcher";

/**
 * @type {Required<LH.SharedFlagsSettings['screenEmulation']>}
 */
const MOTOGPOWER_EMULATION_METRICS = {
  mobile: true,
  width: 412,
  height: 823,
  // This value has some interesting ramifications for image-size-responsive, see:
  // https://github.com/GoogleChrome/lighthouse/issues/10741#issuecomment-626903508
  deviceScaleFactor: 1.75,
  disabled: false,
};

/**
 * Desktop metrics adapted from emulated_devices/module.json
 * @type {Required<LH.SharedFlagsSettings['screenEmulation']>}
 */
const DESKTOP_EMULATION_METRICS = {
  mobile: false,
  width: 1920,
  height: 940,
  deviceScaleFactor: 1,
  disabled: false,
};

const screenEmulationMetrics = {
  mobile: MOTOGPOWER_EMULATION_METRICS,
  desktop: DESKTOP_EMULATION_METRICS,
};

const MOTOG4_USERAGENT =
  "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36"; // eslint-disable-line max-len
const DESKTOP_USERAGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"; // eslint-disable-line max-len

const userAgents = {
  mobile: MOTOG4_USERAGENT,
  desktop: DESKTOP_USERAGENT,
};
export const executeLighthouse = async (url, reportPath, options) => {
  const preset = options.preset || 'desktop'
  const chrome = await chromeLauncher.launch();
  const runnerResult = await lighthouse(
    url,
    {
      logLevel: "info",
      port: chrome.port,
      output: "json",
      onlyCategories: ["performance"],
    },
    {
      extends: "lighthouse:default",
      settings: {
        formFactor: preset,
        // throttling: constants.throttling.desktopDense4G,
        screenEmulation: screenEmulationMetrics[preset],
        emulatedUserAgent: userAgents[preset],
      },
    }
  );

  fs.writeFileSync(reportPath, runnerResult.report);

  console.log(
    "Performance score was",
    runnerResult.lhr.categories.performance.score * 100
  );

  await chrome.kill();
};
