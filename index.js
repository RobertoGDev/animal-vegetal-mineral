const inquirer = require('inquirer');
const fs = require('fs');
const prompt = inquirer.createPromptModule();
const json = fs.readFileSync("data_base.json");
const database = JSON.parse(json);





function randomQuestion(type, block) {
    
    let info = database[type].preguntas[block];
    
    var size = Object.getOwnPropertyNames(info);

    let questionNum = Math.floor(Math.random() * size.length);
    
    let question = {};
    question.numQuestion = questionNum;
    question.msgQuestion = info[questionNum];

	return question;
}


function waitaMoment() {

        var P = ["\\", "|", "/", "-"];
        var x = 0;
        console.log('Ok dejame pensar!');
        return setInterval(function () {
            process.stdout.write("\r" + P[x++]);
            x = x % P.length;
        }, 100);

}

function resolveFormula(generatedQuestion, type, database) {
	
	let Qvalue = generatedQuestion.numQuestion;
	let obj = database[type].respuestas;
	
	let posibleAnswers = [];

	//recogemos en un array todas las respuestas que contengan al valor
	Object.keys(obj).forEach(function (key) {
		if (obj[key].indexOf(Qvalue) ) {
			posibleAnswers.push(key);
		}
	});

	var size = Object.getOwnPropertyNames(obj);
	let questionNum = Math.floor(Math.random() * size.length);

	return posibleAnswers[questionNum];

}


function surrender() {
	console.log('No doy más de mí');
}


// Creamos el inicio del juego
// Por cada elemento, hay dos bloques, preguntas y respuestas,
// Las preguntas tienen dos bloques primero lanza una pregunta del primer bloque que filtra un gran número de respuestas y despues lanza una pregunta aleatoria del segundo bloque que define mejor la respuesta


// Bienvenida y continuar si acepta el jugador

let wellcomeQuestion = [{
    message: 'Bienvenido al juego Animal Vegetal Mineral, ¿Quiere jugar?',
    type: 'confirm',
    default: true,
    name: 'letsPlay'
}];

prompt(wellcomeQuestion).then(answers => {
    if (!answers.letsPlay) {
        console.log(`Vuelve cuando quieras! :)`);
        return;
    }
    // Obtenemos el jugador

    let continuePlay = [{
        message: 'Por favor, dígame su nombre',
        type: 'input',
        name: 'namePlayer'
    }];

    continueExecution(continuePlay);
}).catch( error => {
    throw error;
});


// Si el jugador acepta seguimos con el juego

function continueExecution(continuePlay) {

    prompt(continuePlay)
    .then(answers => {

        //Si pulsamos enter sin introducir nombre, el nombre es tipo de incognito
        if (answers.namePlayer.length === 0) {
            answers.namePlayer = 'Tipo de incognito';
        }

        // Bienvenido!
        console.log(`Bienvenid@ al juego ${answers.namePlayer}! \r\nEl juego trata de averiguar lo que estas pensando con algunas preguntas sencillas. \r\nPero primero:`);
        





        // Preguntamos por animal vegetal mineral

        let avmQuestion = [{
            message: '¿En qué elemento está pensando?',
            type: 'list',
            name: 'avmType',
            choices: ['animal', 'vegetal', 'mineral']
        }];
        

        prompt(avmQuestion)
            .then(answersType => {
                let generatedFirst = randomQuestion(answersType.avmType, 'bloque1');

            // Generamos y lanzamos la pregunta aleatoria del bloque 1
            let firstQuestion = [{
                message: generatedFirst.msgQuestion,
                type: 'confirm',
                name: 'firstq',
                default: false,
            }];

            prompt(firstQuestion)
                .then((answer) => {

                    //Analiza la primera pregunta y prueba suerte

                    if (answer.firstq) {
                        
                        let loading = waitaMoment();
                        setTimeout(() => {
							clearInterval(loading);
							
							let resolveOne = [{
								message: 'Me la juego, ¿Es un '+resolveFormula(generatedFirst, answersType.avmType, database),
								type: 'confirm',
								name: 'resolveOne',
								default: false,
							}];
							
							prompt(resolveOne)
								.then((answer) => {
									if (!answer.resolveOne) {
										surrender();
									} else {
										console.log('Estupendo!! Ya conozco otra respuesta más, siento no poder registrarte como autor, pero mi programador se va a volver loco como le pida que registre autores :___( ')
									}
								}).catch(error => {
									throw error;
								});
							
                        }, 2500);
                    } else {
                        let generatedSecond = randomQuestion(answersType.avmType, 'bloque2');
                        // En caso de se no, gGeneramos y lanzamos la pregunta aleatoria del bloque 2 
                        let secondQuestion = [{
                            message: generatedSecond.msgQuestion,
                            type: 'confirm',
                            name: 'secondQ',
                            default: false,
                        }];

                        prompt(secondQuestion)
                            .then((secondAnswer) => {
                                let loading = waitaMoment();
                                setTimeout(() => {
                                    clearInterval(loading);
                                    resolveFormula(secondAnswer, answersType.avmType, database);
                                }, 2500);
                            }).catch(error => {
                                throw error;
                            });

                    }

                   
            }).catch(error => {
                throw error;
            });

        }).catch(error => {
            throw error;
        });



    })
    .catch( error => {
        throw error;
    });
    
}
