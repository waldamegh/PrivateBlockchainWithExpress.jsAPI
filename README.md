# Private Blockchain with Express.js API

This project illustrates a simple example of private blockchain stored in LevelDB and interacted with it through a web server API (Express framework)

## RESTful web API (Express.js framework)

The app.js file has three endpoints:

1) Get a wellcoming message
```
app.get('/', (req, res) => {...});
```

2) Get a block by block height
```
app.get('/block/:blockHeight', (req, res) => {...});
```

3) Post a new block
```
app.post('/block', (req, res) => {...});
```

## Installation

- NPM required to initialize project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
- Install Express.js as the webserver framework
```
npm install express
```
- Install Joi to handle incorrect inputs
```
npm install joi
```

## How to run?
In the terminal run app.js file
```
node app.js
```

## Testing

- HTTP Get (Welcoming)
```
http://localhost:8000/
```
- HTTP Get (Get Block info by sending {blockHeight} as a prameter)
```
http://localhost:8000/block/{blockHeight}
```

- HTTP Post (Add new block)
```
http://localhost:8000/block
Request body: 
{
      "body": "Testing block with test string data"
}
```
