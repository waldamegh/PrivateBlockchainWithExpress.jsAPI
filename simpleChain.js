/* ===== LevelDB ===============================
|  Learn more: LevelDB: https://github.com/Level/level    |
|  =========================================================*/

const levelSandbox = require('./levelSandbox.js');

/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
    
  constructor(){
     
    let self = this;
	// create Genesis Block if not exist
	levelSandbox.getLevelDBData(0).then( function(block) {
		//Genesis Block is exist
		//console.log('Blockchain Genesis Block is :');
		//console.log(block);
        
	}).catch(function (message) {
		//Genesis Block is not exist
		if (message === 'Not found!'){
            // add a Genesis block
			console.log('Creating Genesis Block ...');
			self.addBlock(new Block("First block in the chain - Genesis block")).then( function(block){
                    console.log(JSON.stringify(block));
            }).catch(function(messsage){
                console.log(messsage);
            });
		}else{
			console.log(message);
		}
	});
      
	
  }

  // Add new block
  addBlock(newBlock){
    let self = this;
      return new Promise(function(resolve, reject) {
		//Get last Block in the chain
		levelSandbox.getLastData().then(function(block) {
			// Block height
			if (block === undefined){
				newBlock.height = 0;
			}else {
				newBlock.height = (block.height)+1;
			}
			// UTC timestamp
			newBlock.time = new Date().getTime().toString().slice(0,-3);
			// previous block hash
			if(newBlock.height > 0){
				newBlock.previousBlockHash = block.hash;
			}
			// Block hash with SHA256 using newBlock and converting to a string
			newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
			// Adding block object to chain
			console.log('Adding a new block ...');
            levelSandbox.addLevelDBData(newBlock.height, JSON.stringify(newBlock));
            self.getBlockHeight().then(function (height) {
                if (height > 0) { 
                    //console.log('Blockchain height is : '+height);
                }
            });
            resolve(newBlock);
            
		}).catch(function (message) {
			console.log(message);
            reject(message);
		});
      });
      
	
  }

    
  // Get block height
  getBlockHeight(){
        let i = -1;
		//Get last Block in the chain
		return new Promise(function(resolve, reject) {
           //Get last Block in the chain
		levelSandbox.getLastData().then(function(block) {
			// Blockchain height
			if (block === undefined){
				console.log('Block Height is: 0' );
                resolve(0);
			}else {
				console.log('Block Height is: ' + block.height);
                resolve(7);
			}
		}).catch(function (message) {
			console.log(message);
		});
		
    });
      
      
  }

    // get block
    getBlock(blockHeight){
		//get block
		return new Promise(function(resolve, reject) {
            levelSandbox.getLevelDBData(blockHeight).then( function(block) {
                //block info
                console.log('Block Number ('+ blockHeight + '):\n' + JSON.stringify(block));
                resolve(block);
            }).catch(function (message) {
                console.log(message);
            });
    });
                           
                           
}
     
    // validate block
    validateBlock(blockHeight){
		
		//get block
		levelSandbox.getLevelDBData(blockHeight).then( function(block) {
			//get block hash
			let blockHash = block.hash;
			// remove block hash to test block integrity
			block.hash = '';
			// generate block hash
			let validBlockHash = SHA256(JSON.stringify(block)).toString();
			// Compare
			if (blockHash === validBlockHash) {
				console.log('Block #' + blockHeight + ' is valid block');
			} else {
				console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
				console.log(false);
			}
		}).catch(function (message) {
			console.log(message);
		});
    }
	
   // Validate blockchain
    validateChain(){
		let errorLog = [];
		//Get All Blocks in the chain
		levelSandbox.getAllData().then(function(chain) {
			// Blockchain length
			if (chain === undefined){
				console.log('chain is empty' );
			}else {
				for (var i = 0; i < chain.length-1; i++) {
					// compare blocks hash link
					let blockHash = chain[i].hash;
					let previousHash = chain[i+1].previousBlockHash;
					if (blockHash !== previousHash) {
						errorLog.push(i);
					}
				}
				if (errorLog.length>0) {
					console.log('Block errors = ' + errorLog.length);
					console.log('Blocks: '+errorLog);
				}else{
					console.log('No errors detected');
				}
			}
		}).catch(function (message) {
			console.log(message);
		});
	}


}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block; 

/*==============Test====================*/

/*
var blockchain = new Blockchain();
blockchain.addBlock(new Block('Test 0'));
blockchain.getBlockHeight();
blockchain.getBlock(0);
blockchain.validateBlock(0);
blockchain.validateChain();*/