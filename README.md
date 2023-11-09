# cli-statistics-lighthouse

Based on Node.js and [lighthouse](https://github.com/GoogleChrome/lighthouse), a website performance utility. It executes batches of Lighthouse tests on your website to obtain average data.

## Using the Node CLI

```shell
npm i -g cli-statistics-lighthouse

cli-statistics-lighthouse lighthouse https://github.com -n 2
# result:
---------------
success:  2
fail: 0
---------------
Average web performance metrics in 2 active tests:
  FCP(首次内容绘制) : 3.8s slow
  LCP(最大内容绘制): 6.9s slow
  TTI(可交互时间): 8.5s slow
  Speed Index(速度指数): 5.6s moderate
  TBT(总阻塞时间): 0.5s moderate
  maxPotentialFID(最大可能的首次输入延迟): 0.5s slow
  CLS(累积布局变动): 0.1s moderate
  TTFB(首字节到达时间): 0.7s fast
---------------
error msg:
```

CLI options
```shell
cli-statistics-lighthouse --help
Usage: statistics lighthouse [options] [command]

CLI to execute multiple lighthouse

Options:
  -V, --version               output the version number
  -h, --help                  display help for command

Commands:
  lighthouse [options] <url>  Execute lighthouse
  analyze <report name>       Analyze target report
  history                     Get history
  clear                       Clear all local history
  help [command]              display help for command
```

Other commands:

```shell
# Get history
cli-statistics-lighthouse history
# Clear history
cli-statistics-lighthouse clear
# Analyze a history
cli-statistics-lighthouse report {logFile-xxx.json}
```

