const inquirer = require('inquirer');
const fs = require('fs');
const prompt = inquirer.createPromptModule();
const json = fs.readFileSync("data_base.json");
const database = JSON.parse(json);

function randomQuestion(type, block) {
    
    let info = database[type].preguntas[block];
    
    var size = Object.getOwnPropertyNames(info);

    let questionNum = Math.floor(Math.random() * size.length);
    
    let index = [];
    
    index.sort(function (a, b) {
        return a == b ? 0 : (a > b ? 1 : -1);
    });

    for (var x in info) {
        index.push(x);
    }
    return info[index[questionNum]];
}

function waitaMoment() {

        var P = ["\\", "|", "/", "-"];
        var x = 0;
        console.log('Dejame pensar!');
        return setInterval(function () {
            process.stdout.write("\r" + P[x++]);
            x &= 3;
        }, 250);

}

// Creamos el inicio del juego
// Por cada elemento, hay dos bloques, preguntas y respuestas,
// Las preguntas tienen dos bloques primero lanza una pregunta del primer bloque que filtra un gran número de respuestas y despues lanza una pregunta aleatoria del segundo bloque que define mejor la respuesta


// Bienvenida

let wellcomeQuestion = [{
    message: 'Bienvenido al juego Animal Vegetal Mineral, ¿Quiere jugar?',
    type: 'confirm',
    default: true,
    name: 'letsPlay'
}];




prompt(wellcomeQuestion)
    .then(answers => {
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
    })
    .catch( error => {
        throw error;
    });


// Seguimos con el juego

function continueExecution(continuePlay) {

    prompt(continuePlay)
    .then(answers => {

        //Si pulsamos enter sin introducir nombre, el nombre es tipo de incognito
        if (answers.namePlayer.length === 0) {
            answers.namePlayer = 'Tipo de incognito';
        }

        // Bienvenido!
        console.log(`Bienvenido al juego ${answers.namePlayer}! 
Con solo dos preguntas voy a adivinar lo que estás pensando. 
Comencemos con la primera pregunta...`);
        

        // Preguntamos por animal vegetal mineral

        let avmQuestion = [{
            message: '¿En qué elemento está pensando?',
            type: 'list',
            name: 'avmType',
            choices: ['animal', 'vegetal', 'mineral']
        }];
        

        prompt(avmQuestion)
            .then(answers => {

            // Generamos y lanzamos la pregunta aleatoria del bloque 1
            let typeQuestions = [{
                message: randomQuestion(answers.avmType, 'bloque1'),
                type: 'confirm',
                name: 'firstQuestion',
                default: false,
            },
            {
                message: randomQuestion(answers.avmType, 'bloque2'),
                type: 'confirm',
                name: 'secondQuestion',
                default: false,
            }];

            prompt(typeQuestions)
                .then(answers => {
                    waitaMoment();
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
