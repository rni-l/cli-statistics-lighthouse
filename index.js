import { getReport, getReportResult, getAllReportList, clearAllReportList } from './statistics.js'
import { reportDirPath, pkg } from './config.js'
import { Command } from 'commander'
import { executeLighthouse } from './lighthouse.js'

const DEFAULT_NUMBER = 10
const KEY = Date.now()
let maxNumber = DEFAULT_NUMBER

// 递归执行命令列表
async function executeCommand(url, index, options) {
  if (index < maxNumber) {
    console.log(`Executing command ${index + 1}:`);
    await executeLighthouse(url, `${reportDirPath}/report-${KEY}-${index}.json`, options)
    await executeCommand(url, index + 1, options);
  } else {
    console.log('last');
    getReport()
  }
}

// 开始执行命令
// executeCommand(0);
const program = new Command();

program
  .name('statistics lighthouse')
  .description('CLI to execute multiple lighthouse')
  .version(pkg.version);

program.command('lighthouse')
  .description('Execute lighthouse and you can use other lighthouse params, such as --hostname 0.0.0.0')
  .argument('<url>', 'analyze url')
  .option('-n, --number <number>', 'execute number, 1/10/100 or more, default 10')
  .option('--preset <string>', 'desktop/mobile')
  .action((str, options) => {
    maxNumber = options.number || DEFAULT_NUMBER
    executeCommand(str, 0, options)
  });

program.command('analyze')
  .description('Analyze target report')
  .argument('<report name>', 'report name, xxx.json')
  .action((str, ) => {
    if (!str) {
      return console.log('Please enter report name. You can use the "xx history" command to get a list of reports.');
    }
    getReportResult(str)
  });

program.command('history')
  .description('Get history')
  .action((str, options) => {
    getAllReportList()
  });


program.command('clear')
  .description('Clear all local history')
  .action((str, options) => {
    clearAllReportList()
  });

program.parse();
