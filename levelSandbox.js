/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
  db.put(key, value, function(err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
  })
}

// Get data from levelDB with key
function getLevelDBData(key){
	return new Promise(function(resolve, reject) {
		db.get(key, function(err, value) {
			if (err) {
				reject('Not found!', err);
			} else {
				resolve(JSON.parse(value));
			}
		});
	});
}

function getLastData(){
  let chain = [];
  return new Promise( function(resolve, reject){
	db.createReadStream().on('data', function(data) {
    chain.push(JSON.parse(data.value));
    }).on('error', function(err) {
        reject(err);
    }).on('close', function() {
	//last block 
      resolve(chain[chain.length-1]);
    });
});
}

function getAllData(){
  let chain = [];
  return new Promise( function(resolve, reject){
	db.createReadStream().on('data', function(data) {
    chain.push(JSON.parse(data.value));
    }).on('error', function(err) {
        reject(err);
    }).on('close', function() {
      resolve(chain);
    });
});
}
exports.addLevelDBData = addLevelDBData;
exports.getLevelDBData = getLevelDBData;
exports.getLastData = getLastData;
exports.getAllData = getAllData;

