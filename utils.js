const checkIfWordle = (message) => {
    return message.body.contains("La palabra del día")
}


const dataFromWordle = (message) => {
    const numberMatch = message.body.match(/#(\d+)/);
    const number = numberMatch ? parseInt(numberMatch[1]) : null;
    const scoreMatch = message.body.match(/(\d+)\/6/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
    return {
        number,
        score
    }
}

exports.checkIfWordle = checkIfWordle;
exports.dataFromWordle = dataFromWordle;
