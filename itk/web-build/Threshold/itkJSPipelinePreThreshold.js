Module['locateFile'] = function(fileName, prefix) {
  if(fileName === 'ThresholdWasm.wasm') {
    if (Threshold.isAbsoluteURL) {
      return Threshold.pipelinePath + 'Wasm.wasm'
    }
    if (typeof Threshold.moduleScriptDir !== 'undefined') {
      return Threshold.moduleScriptDir + '/ThresholdWasm.wasm'
    }
    return prefix + '../Pipelines/ThresholdWasm.wasm'
  }
  return prefix + fileName
}

var moduleStdout = null
var moduleStderr = null

Module['resetModuleStdout'] = function() {
  moduleStdout = ''
}

Module['resetModuleStderr'] = function() {
  moduleStderr = ''
}

Module['print'] = function(text) {
  console.log(text)
  moduleStdout += text + '\n'
}

Module['printErr'] = function(text) {
  console.log(text)
  moduleStderr += text + '\n'
}

Module['getModuleStdout'] = function() {
  return moduleStdout
}

Module['getModuleStderr'] = function() {
  return moduleStderr
}

Module['preRun'] = function() {
}
