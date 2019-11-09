module.exports = {
    cookieSecret: 'secret',
    mongo:{
        development:{
            connectionString:'mongodb+srv://Roast:database@roastbase-coxeo.mongodb.net/test?retryWrites=true&w=majority'
        },
        production:{
            connectionString:''
        }
    }
};
