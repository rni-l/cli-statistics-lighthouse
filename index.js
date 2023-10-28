const { exec } = require('child_process');
const { getReport, getReportResult, getAllReportList } = require('./statistics')
const { reportDirPath } = require('./config')
const { Command } = require('commander');
const pkg = require('./package.json')
const DEFAULT_NUMBER = 10
const key = Date.now()
let maxNumber = DEFAULT_NUMBER
// 定义要执行的命令列表
const getCommand = (url, version) => `lighthouse ${url}  --output=json --output-path=${reportDirPath}/report-${key}-${version}.json --save-assets   --preset=desktop --screenEmulation.width=1000 --only-categories=performance`

// 递归执行命令列表
function executeCommand(url, index) {
  if (index < maxNumber) {
    const command = getCommand(url, index);
    console.log(`Executing command ${index + 1}: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command ${index + 1}: ${error.message}`);
        return;
      }

      console.log(`Command ${index + 1} executed successfully.`);
      executeCommand(url, index + 1);
    });
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
  .description('Execute lighthouse')
  .argument('<url>', 'analyze url')
  .option('-n, --number <number>', 'execute number, 1/10/100 or more, default 10')
  .action((str, options) => {
    const number = options.number || DEFAULT_NUMBER
    executeCommand(str, number)
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

program.parse();