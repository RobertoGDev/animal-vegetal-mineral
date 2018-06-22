const fs = require('fs');
const json = fs.readFileSync("data_base.json");
const database = JSON.parse(json);

 let firstquestionId = 0;
 let secondquestionId = null;
 let obj = database['animal'].respuestas;
 let possibleAnswers = [];

	Object.keys(obj).forEach(function (key) {
	    if (obj[key].relQuestion.indexOf(firstquestionId) >= 0 || obj[key].relQuestion.indexOf(secondquestionId) >= 0) {
           
	        possibleAnswers.push(key);
	    }
    });
    
console.log(possibleAnswers);