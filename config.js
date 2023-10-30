/*
 * @Author: Lu
 * @Date: 2023-10-28 16:49:01
 * @LastEditTime: 2023-10-30 10:59:47
 * @LastEditors: Lu
 * @Description: 
 */
import fs from 'fs'
import path from 'path'
import os from 'os'
import dayjs from 'dayjs'

const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' }))

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
export {
  reportDirPath,
  resultDirPath,
  logFilePath,
  pkg
}