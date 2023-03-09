# homey-web-api-example
Simplest possible example for controlling Homey WEB API from a node.js application

This example is based on the https://athombv.github.io/node-homey-api/AthomCloudAPI.html example, but also includes the a simple http server to pickup the webhook needed to authenticate.

# Usage

```
$> npm install

$> node app.js
```

*This will open a browser pointing to the login URL, select the correct account you want to use, and the homey you want to control*