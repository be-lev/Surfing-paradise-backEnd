function getError(err) {

    if(config.isProduction) {
        return "We are sorry but something went wrong, please try again.";
    }

    return err.message;

}

module.exports = {
    getError
};