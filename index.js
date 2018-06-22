const inquirer = require('inquirer');
const fs = require('fs');
const prompt = inquirer.createPromptModule();
const json = fs.readFileSync("data_base.json");
const database = JSON.parse(json);
   


function randomQuestions(type) {

    let info = database[type].preguntas;
    let size = Object.getOwnPropertyNames(info);

    const n = size.length;
    const arr = new Array(n);
    for (let i = 0; i < n; i++) {
        arr[i] = i + 1;
    }

    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    const randomQuestion = arr.slice(0, 2);


    let firstNumber = randomQuestion[0];
    let secondNumber = randomQuestion[1];
    let question = {};
    question['first'] = [firstNumber, info[firstNumber]];
    question['second'] = [secondNumber, info[secondNumber]];

    return question;
}



function waitaMoment() {

        var P = ["\\", "|", "/", "-"];
        var x = 0;
        let waiting = setInterval(function () {
            process.stdout.write("\r" + P[x++]);
            x = x % P.length;
        }, 100);
        
        console.log(`Ok dejame pensar!`)
        
        setTimeout(() => {
            clearInterval(waiting);
        }, 1400);

}


function resolveFormula(firstQuestionId, secondQuestionId, type, database) {
    
    
    let obj = database[type].respuestas;
    let possibleAnswers = [];

	//recogemos en un array todas las respuestas que contengan al valor
	Object.keys(obj).forEach(function (key) {
        if (obj[key].relQuestion.indexOf(firstQuestionId) >= 0 || obj[key].relQuestion.indexOf(secondQuestionId) >= 0) {
            possibleAnswers.push(key);
        }
	});

	var size = Object.getOwnPropertyNames(possibleAnswers);
	let questionNum = Math.floor(Math.random() * size.length);

	return possibleAnswers[questionNum];

}

function getMaster(resolve, type) {
    return resolve + ' ' + type;
}

function learnNewAnswer(resolved, avm, database, namePlayer) {
    if (!resolved) {
        let answerUnknown = [{
                message: 'Ok, quiero aprender. ¿Podrías decirme que respuesta tenías en mente?',
                type: 'input',
                name: 'answerRevelated'
            },
            {
                message: '¿Podrías crear una pregunta que pueda responderse con "si" o "no" y que diferencie a este elemento?',
                type: 'input',
                name: 'questionForAnswerRevelated'
            },
        ];


        prompt(answerUnknown).then((answer) => {
            
            let element = answer.answerRevelated;
            let questionElement = answer.questionForAnswerRevelated;
            let obj = database[avm].respuestas;
            obj.push({
                "7": questionElement
            })

        }).catch(error => {
            throw error;
        });


    } else {
        let master = getMaster(resolve, avm);
        console.log('Estupendo!! Esta respuesta ha sido posible gracias a ' + master);
    }
}






///////////////////////////////////////////////////////////////////////////////////
// Bienvenida y continuar si acepta el jugador
///////////////////////////////////////////////////////////////////////////////////

let wellcomeQuestion = [{
    message: 'Bienvenido al juego Animal Vegetal Mineral, ¿Quiere jugar?',
    type: 'confirm',
    default: true,
    name: 'play'
}];

prompt(wellcomeQuestion).then(answers => {

    if (!answers.play) {
        console.log(`Vuelve cuando quieras! :)`);
        return;
    }


    ///////////////////////////////////////////////////////////////////////////////////
    // Bienvenida y continuar si acepta el jugador
    ///////////////////////////////////////////////////////////////////////////////////

    let namePlayer = [{
        message: 'Por favor, dígame su nombre',
        type: 'input',
        name: 'name'
    }];


    prompt(namePlayer).then(answers => {

        //Si pulsamos enter sin introducir nombre, el nombre es tipo de incognito

        if (answers.name.length === 0) {
            answers.name = 'Tipo de incognito';
        }

        let namePlayer = answers.name;

        // Texto de introducción
        console.log(`Bienvenid@ al juego ${answers.name}! \r\nEl juego trata de averiguar lo que estas pensando con algunas preguntas sencillas. \r\nPero primero:`);
        
        launchTypeElement(namePlayer);


    }).catch(error => {
        throw error;
    });


}).catch( error => {
    throw error;
});



function launchTypeElement(namePlayer) {
    // Preguntamos por animal vegetal mineral

    let avmQuestion = [{
        message: '¿En qué elemento está pensando?',
        type: 'list',
        name: 'Type',
        choices: ['animal', 'vegetal', 'mineral']
    }];

    prompt(avmQuestion).then(answers => {
        
        let questions = randomQuestions(answers.Type);
        launchFirstQuestion(questions, answers.Type, namePlayer);
        
    }).catch(error => {
        throw error;
    });
}


// Generamos las preguntas


function launchFirstQuestion(questions, avm, namePlayer) {
  
    
    let TypeElement = [{
        message: questions.first[1],
        type: 'confirm',
        name: 'firstq',
        default: true,
    }];
    
    prompt(TypeElement).then((answer) => {
        
        if (answer.firstq) {

            waitaMoment();


            let resolve = resolveFormula(questions.first[0], secondAnswer = null, avm, database);
            setTimeout(() => {
                let resolveOne = [{
                    message: 'Me la juego, ¿Es un ' + resolve + '?',
                    type: 'confirm',
                    name: 'resolveOne',
                    default: false,
                }];
            


                prompt(resolveOne).then((answer) => {
                    learnNewAnswer(answer.resolveOne, avm, database, namePlayer);
                }).catch(error => {
                    throw error;
                });
            }, 1500);

        } else {

            // En caso de se no, gGeneramos y lanzamos la pregunta aleatoria del bloque 2 
            let secondQuestion = [{
                message: questions.second[1],
                type: 'confirm',
                name: 'secondQ',
                default: false,
            }];

            prompt(secondQuestion).then((secondAnswer) => {
                waitaMoment();
                 let resolve = resolveFormula(questions.first[0], questions.second[0], avm, database);
                 setTimeout(() => {
                     let resolvetwo = [{
                         message: 'Me la juego, ¿Es un ' + resolve + '?',
                         type: 'confirm',
                         name: 'resolvetwo',
                         default: false,
                     }];



                     prompt(resolvetwo).then((answer) => {
                         learnNewAnswer(answer.resolvetwo, avm, database, namePlayer);
                     }).catch(error => {
                         throw error;
                     });
                 }, 1500);
            }).catch(error => {
                throw error;
            });

        }
    }).catch(error => {
        throw error;
    });
}