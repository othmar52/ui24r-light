<template>
  <div>
    <h1>CreateConfig</h1>
    <p>TODO: create GUI to create config.<br>
    result will be a little javascript that has to be saved as ./config.js</p>
    <pre>
var mixerConfig = {
  mixer1: {
    enabled: true,
    ip: '10.0.1.126',
    port: 80,
    autoConnect: true
  },
  mixer2: {
    enabled: false,
    ip: '10.0.1.124',
    port: 80,
    autoConnect: true
  },
  paramRecorder1: {
    enabled: false,
    ip: '10.0.1.112',
    port: 8090,
    autoConnect: true
  },
  paramRecorder2: {
    enabled: false,
    ip: '10.0.1.112',
    port: 8092,
    autoConnect: true
  }
}
    </pre>
  </div>
</template>

<style>
pre {
    text-align: left;
    padding: 2em;
    margin-left: 200px;
    background: #CCC;
    color: #222;
}
</style>
