module.exports = {
    apps: [
        {
            name: 'backend', // Name of the application, shown in PM2 process list
            script: 'dist/server.js', // Entry point of the application. Here, 'dist/server.js' is the transpiled or compiled version of the server (often TypeScript compiled to JavaScript).
            instances: '1', // Number of instances of the application to run (in this case, just one instance).
            exec_mode: 'cluster', // Running in 'cluster' mode, which allows PM2 to distribute incoming connections across multiple instances for better scalability.
            env: {
                NODE_ENV: 'production', // Environment variable to specify the app is running in production. NODE_ENV helps distinguish between production and development settings.
            },
        },
    ],
};
