const { spawn, exec } = require('child_process');

function run(command) {
    return new Promise((resolve, reject) => {
        const process = spawn(command);
        let output = '';

        process.stdout.on('data', (data) => {
            output += data.toString();
        });

        process.stderr.on('data', (data) => {
            output += data.toString();
        });

        process.on('close', (code) => {
            resolve(output);
        });
    });
}

module.exports = run;
