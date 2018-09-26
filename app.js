/* ===== Express ============================================
|  Learn more: Express: http://expressjs.com/                |
|  =========================================================*/
const express = require('express');
const app = express();
app.use(express.json());

/* ===== Joi ================================================
|  Learn more: Joi: https://github.com/hapijs/joi            |
|  =========================================================*/
const Joi = require('joi');

//create blockchain object
const {Block,Blockchain} = require('./simpleChain');
const blockchain = new Blockchain();

//Set blockchain height to the cuurent height in LevelDB
let chainHeight = 0;
blockchain.getBlockHeight().then(height => {
   if (height >0){
       chainHeight = height;
   } 
});


/*------ HTTP GET Request -------------------------------------
| URL = '/'                                                    |
| response with a welcome message                              |    
|_____________________________________________________________*/
app.get('/', (req, res) => {
    res.send('Welcome to the Privet Blockcahain API.');
});


/*------ HTTP GET Request -------------------------------------
| URL = '/block/{blockHeight}'                                 |
| response with the block details                              |
|_____________________________________________________________*/
app.get('/block/:blockHeight', (req, res) => {
     
    //console.log('      chainHeight   =   '+chainHeight);
    //handling incorrect input through Joi
    const schema = { blockHeight: Joi.number().integer().min(0).max(chainHeight).required() };
    const { error } = Joi.validate(req.params, schema);
    if (error) return res.status(400).send(error.details[0].message);

    //sending the requested block info
    blockchain.getBlock(req.params.blockHeight).then(block => {
        res.send(block);
    });
   
});

/*------ HTTP Post Request ------------------------------------
| URL = '/block'                                               |
| response with new block details                              |
|_____________________________________________________________*/
app.post('/block', (req, res) => {
    //handling incorrect input through Joi
    const schema = { data: Joi.string().min(1).required() }
    const { error } = Joi.validate(req.body, schema);
    if (error) return res.status(400).send(error.details[0].message);

    //adding new block
    blockchain.addBlock(new Block(req.body.data)).then(block => { 
        //update chain height
        chainHeight = block.height;
        //sending new block info
        blockchain.getBlock(chainHeight).then(block => {
                res.send(block);
        }).catch(err => {
                console.log(err);
        });
        
    }).catch(err => {
        console.log(err);
    });
});


// Server lisitening on port 8000
const port = 8000
app.listen(port, () => console.log(`Blockchain API listening on port ${port}...`));