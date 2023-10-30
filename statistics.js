import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'
import {
  reportDirPath,
  resultDirPath,
  logFilePath
} from './config.js'


const keyMapName = {
  firstContentfulPaint: 'FCP(首次内容绘制) ',
  largestContentfulPaint: 'LCP(最大内容绘制)',
  interactive: 'TTI(可交互时间)',
  speedIndex: 'Speed Index(速度指数)',
  totalBlockingTime: 'TBT(总阻塞时间)',
  maxPotentialFID: 'maxPotentialFID(最大可能的首次输入延迟)',
  cumulativeLayoutShift: 'CLS(累积布局变动)',
  timeToFirstByte: 'TTFB(首字节到达时间)',
}

const scoreList = {
  firstContentfulPaint: [[0,1.8], [1.8,3]],
  largestContentfulPaint: [[0,2.5],[2.5,4]],
  interactive: [[0,3.8], [3.8,7.3]],
  speedIndex: [[0,3.4], [3.4,5.8]],
  totalBlockingTime: [[0,0.2],[0.2,0.6]],
  maxPotentialFID: [[0,0.1], [0.1, 0.3]],
  cumulativeLayoutShift: [[0,0.1],[0.1, 0.25]],
  timeToFirstByte: [[0,0.8],[0.8, 1.8]],
}

const getMetricsScore = (key, val) => {
  const scores = scoreList[key]
  const findIndex = scores.findIndex((v) => val >= v[0] && val < v[1])
  if (findIndex === 0) return 'fast'
  if (findIndex === 1) return 'moderate'
  return 'slow'
}

const logLargeData = (data) => {
  console.log(JSON.stringify(data));
}
const log = (...args) => {
  console.log(...args)
}

const logLine = () => log('---------------')

const formatSecond = (m) => {
  return Math.ceil(m / 100) / 10
}

const getAvg = (val, len,) => {
  return formatSecond(val / len)
}

const getReports = async () => {
  const files = fs.readdirSync(reportDirPath)
  return files.filter(v => {
    return /report-\d{13}-\d+\.json/.test(v)
  })
}

const removeAllReportFiles = () => {
  const files = fs.readdirSync(reportDirPath)
  return files.filter(v => {
    fs.rmSync(path.join(reportDirPath, v))
  })
}

const logAvgMetrics = (result, title) => {
  const len = result.length
  const {
    firstContentfulPaint,
    largestContentfulPaint,
    interactive,
    speedIndex,
    totalBlockingTime,
    maxPotentialFID,
    cumulativeLayoutShift,
    timeToFirstByte,
  } = result.reduce((acc, v) => {
    Object.entries(v.metrics).forEach(([k,v2]) => {
      if (!acc[k]) acc[k] = v2
      else acc[k] += v2
    })
    return acc
  }, {})
  const avg_firstContentfulPaint = getAvg(firstContentfulPaint, len)
  const avg_largestContentfulPaint = getAvg(largestContentfulPaint, len)
  const avg_interactive = getAvg(interactive, len)
  const avg_speedIndex = getAvg(speedIndex, len)
  const avg_totalBlockingTime = getAvg(totalBlockingTime, len)
  const avg_maxPotentialFID = getAvg(maxPotentialFID, len)
  const avg_cumulativeLayoutShift = getAvg(cumulativeLayoutShift, len)
  const avg_timeToFirstByte = getAvg(timeToFirstByte, len)
  log(title)
  log(`  ${keyMapName.firstContentfulPaint}: ${avg_firstContentfulPaint}s ${getMetricsScore('firstContentfulPaint', avg_firstContentfulPaint)}`)
  log(`  ${keyMapName.largestContentfulPaint}: ${avg_largestContentfulPaint}s ${getMetricsScore('largestContentfulPaint', avg_largestContentfulPaint)}`)
  log(`  ${keyMapName.interactive}: ${avg_interactive}s ${getMetricsScore('interactive', avg_interactive)}`)
  log(`  ${keyMapName.speedIndex}: ${avg_speedIndex}s ${getMetricsScore('speedIndex', avg_speedIndex)}`)
  log(`  ${keyMapName.totalBlockingTime}: ${avg_totalBlockingTime}s ${getMetricsScore('totalBlockingTime', avg_totalBlockingTime)}`)
  log(`  ${keyMapName.maxPotentialFID}: ${avg_maxPotentialFID}s ${getMetricsScore('maxPotentialFID', avg_maxPotentialFID)}`)
  log(`  ${keyMapName.cumulativeLayoutShift}: ${avg_cumulativeLayoutShift}s ${getMetricsScore('cumulativeLayoutShift', avg_cumulativeLayoutShift)}`)
  log(`  ${keyMapName.timeToFirstByte}: ${avg_timeToFirstByte}s ${getMetricsScore('timeToFirstByte', avg_timeToFirstByte)}`)
}

const logMetrics = (result) => {
  const [successList, failList] = result.reduce((acc, v) => {
    if (v.success) acc[0].push(v)
    else acc[1].push(v)
    return acc
  }, [[], []])
  const successLen = successList.length
  logLine()
  log('success: ', successLen)
  log('fail:', failList.length)
  logLine()
  logAvgMetrics(successList, `Average web performance metrics in ${successLen} active tests:`)
  logLine()
  log('error msg:')
  failList.forEach(v2 => {
    log(v2.failMsg)
  })
}

const getMetrics = (file) => {
  const json = JSON.parse(fs.readFileSync(path.join(reportDirPath, file), { encoding:'utf-8'}))
  const { requestedUrl, fetchTime, audits } = json 
  const { metrics } = audits
  const time = `${dayjs(fetchTime).format('YYYY-MM-DD HH:mm:ss')}`
  if (!metrics.details || !metrics.details.items || !metrics.details.items[0].firstContentfulPaint) {
    return {
      time,
    fetchTime,
    requestedUrl,
    success: false,
    failMsg: metrics.errorMessage
    }
  }
  const {
    firstContentfulPaint,
    largestContentfulPaint,
    interactive,
    speedIndex,
    totalBlockingTime,
    maxPotentialFID,
    cumulativeLayoutShift,
    timeToFirstByte
  } = metrics.details.items[0]
//   console.log(`*********${time}*********
//   firstContentfulPaint: ${formatSecond(firstContentfulPaint)}
//   largestContentfulPaint: ${formatSecond(largestContentfulPaint)}
//   interactive: ${formatSecond(interactive)}
//   speedIndex: ${formatSecond(speedIndex)}
//   totalBlockingTime: ${formatSecond(totalBlockingTime)}
//   maxPotentialFID: ${formatSecond(maxPotentialFID)}
//   cumulativeLayoutShift: ${formatSecond(cumulativeLayoutShift)}
//   timeToFirstByte: ${formatSecond(timeToFirstByte)}
// *********${time}*********`);
  return {
    time,
    fetchTime,
    requestedUrl,
    success: true,
    metrics: {
      firstContentfulPaint,
      largestContentfulPaint,
      interactive,
      speedIndex,
      totalBlockingTime,
      maxPotentialFID,
      cumulativeLayoutShift,
      timeToFirstByte
    }
  }
}

const getReport = async () => {
  const files = await getReports()
  const result = files.map(v => getMetrics(v))
  fs.writeFileSync(logFilePath, JSON.stringify(result, null, '\t'))
  logMetrics(result)
  // 删除 report
  removeAllReportFiles()
}

const getReportResult = (reportName) => {
  const file = fs.readFileSync(path.join(resultDirPath, reportName), { encoding: 'utf-8' })
  try {
    const result = JSON.parse(file)
    logMetrics(result)
  } catch(e) {
    console.log(e);
  }
}

const getAllReportList = () => {
  const files = fs.readdirSync(resultDirPath)
  files.forEach(v => {
    log(v)
  })
  if (!files.length) {
    log('Empty')
  }
}

const clearAllReportList = () => {
  const files = fs.readdirSync(resultDirPath)
  files.forEach(v => {
    log(`${v}, successfully deleted`)
    fs.rmSync(path.join(resultDirPath, v))
  })
}


export {
  getReport, getReportResult, getAllReportList, clearAllReportList
}
