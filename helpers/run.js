const { spawn } = require('child_process');

function run(command) {
    return new Promise((resolve, reject) => {
        try {
            const process = spawn(command, { shell: true }); // Ensure it runs in a shell
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
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

module.exports = run;
