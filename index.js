const inquirer = require('inquirer');
const fs = require('fs');

let prompt = inquirer.createPromptModule();

//Creamos el inicio del juego

//Solo dos preguntas, aleatorias

let wellcomeQuestion = [{
    message: 'Bienvenido al juego Animal Vegetal Mineral, ¿Quiere jugar?',
    type: 'confirm',
    default: false,
    name: 'letsPlay'
}];

// Obtenemos el jugador

let getNamePlayer = [{
    message: 'Por favor, dígame su nombre',
    type: 'input',
    name: 'namePlayer'
}];

 
inquirer.prompt(wellcomeQuestion)
.then(answers => {
    if (!answers.letsPlay) {
        console.log(`Vuelve cuando quieras! :) ${answers.letsPlay}`);
        return;
    }
    continueExecution();
})
.catch( error => {
    throw error;
});

function continueExecution() {
    inquirer.prompt(getNamePlayer)
    .then(answers => {
        if (answers.namePlayer.length === 0) {
            answers.namePlayer = 'Tipo de incognito';
        }
        console.log(`Bienvenido al juego ${answers.namePlayer}`);
        return true;
    })
    .catch( error => {
        throw error;
    })
    
}
