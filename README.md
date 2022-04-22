# WebpackSample
mpa dev server / build webpack
# BEFORE YOU START
* START THE SERVER README AT ROOT.

# Webpack Dev Mode
* Accepts two arguments/flags.
  - file is the name of feature's folder name.
  - host is defaulted to 8080 if no arg is passed. host will is needed to run   multiple apps.
  - analyze will run bundle analyzer. It shows how big your build is and break down package size used per feature.

## Example
```npm run startDev```
  - Will run **ALL** features in one page. NOT RECOMMENDED


```npm run startDev --file="Category"```
  - Will run Category feature at port 8080


```npm run startDev --file="Category Homepage"```
  - Will run Category feature at port 8080 and Homepage feature at port 8081


```npm run startDev --file="Category Homepage" --port="8081" ---analyze```
  - Will run Category feature at port 8081 and Homepage feature at port 8082 and will run analyzer

# Webpack Production Build
* Build for production or build for gain access to full website.


```npm run buildProd```
* Can also build specific features. Should only be using this for development purposes for now. 11/16/2021.


```npm run buildProd --file="YOURFILENAME ANOTHERFILENAME"```
