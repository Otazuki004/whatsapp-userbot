const { spawn, exec } = require('child_process');

function run(command) {
    return new Promise((resolve, reject) => {
        const process = spawn(command);
        let output = '';

        process.stdout.on('data', (data) => {
            output += data.toString();
        });

        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });
    });
}

module.exports = run;
