/*
 * @Author: Lu
 * @Date: 2023-10-28 16:49:01
 * @LastEditTime: 2023-10-28 17:22:59
 * @LastEditors: Lu
 * @Description: 
 */
const fs = require('fs')
const path = require('path')
const os = require('os');
const dayjs = require('dayjs')
const pkg = require('./package.json')

const name = `npm-${pkg.name}`
const tmpDir = path.join(os.tmpdir(), name)
const reportDirPath = path.join(tmpDir, './report')
const resultDirPath = path.join(tmpDir, './result')
const logFilePath = path.join(resultDirPath, `./logFile-${dayjs().format('YYYYMMDDHHmmss')}.json`)
// console.log(reportDirPath);
// console.log(logFilePath);

const checkDir = (checkPath) => {
  try {
    const dir = fs.readdirSync(checkPath)
    return true
  } catch(e) {
    fs.mkdirSync(checkPath)
  }
}
checkDir(tmpDir)
checkDir(reportDirPath)
checkDir(resultDirPath)
module.exports = {
  reportDirPath,
  resultDirPath,
  logFilePath,
}