Module['locateFile'] = function(fileName, prefix) {
  if(fileName === 'MaxWasm.wasm') {
    if (Max.isAbsoluteURL) {
      return Max.pipelinePath + 'Wasm.wasm'
    }
    if (typeof Max.moduleScriptDir !== 'undefined') {
      return Max.moduleScriptDir + '/MaxWasm.wasm'
    }
    return prefix + '../Pipelines/MaxWasm.wasm'
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
