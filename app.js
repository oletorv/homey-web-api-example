/*
*
*
*/

const { createHttpTerminator } = require("http-terminator");

const AthomCloudAPI = require('homey-api/lib/AthomCloudAPI');
const { wait } = require('homey-api/lib/Util');
const http = require('http');
const open = require('open');
var code = null;



const cloudApi = new AthomCloudAPI({
  clientId: '5a8d4ca6eb9f7a2c9d6ccf6d',
  clientSecret: 'e3ace394af9f615857ceaa61b053f966ddcfb12a',
  redirectUrl: 'http://localhost'
});

server = http.createServer(function(req, res) {
  code = req.url.slice(req.url.indexOf('code=') + 5);
  console.log(code);
});

server.listen(80);

console.log("Homey WEB-API Test");
console.log("Opened WebHook Server on port 80 !");


start();



async function start() {
  
  const url = cloudApi.getLoginUrl();
  console.log("Accessing url: " + url);
  open(url);
  
  while(code == null) {
    await wait(500);
    console.log("Waiting for code from athom");
  }
  
  var token = await cloudApi.authenticateWithAuthorizationCode({
    code: code,
    removeCodeFromHistory: false
  });
  
  console.log("Token ", token);
  
  // Get the logged in user
  const user = await cloudApi.getAuthenticatedUser();
  
  // Get the first Homey of the logged in user
  const homey = await user.getFirstHomey();
  
  // Create a session on this Homey
  const homeyApi = await homey.authenticate();
  
  // Get all Zones from ManagerZones
  const zones = await homeyApi.zones.getZones();
  
  // Get all Devices from ManagerDevices
  const devices = await homeyApi.devices.getDevices();
  
  console.log("Devices: ", devices);
  
  
  for (const device of Object.values(devices)) {
    
    if(device.name.includes('Lamp')) {
      await device.setCapabilityValue({
        capabilityId: 'onoff',
        value: true,
      });
    }
    if(device.capabilities.includes('onoff')) {
      console.log('Device OnOff: ' + await device.capabilitiesObj['onoff'].value);
    }
    if (device.capabilities.includes('measure_temperature')) {
      console.log('Device Temperature: ' + await device.capabilitiesObj['measure_temperature'].value);
    }
  }
  
  const httpTerminator = createHttpTerminator({
    server,
  });
  
  console.log('Terminating HTTP server !');
  await httpTerminator.terminate();
  
}



