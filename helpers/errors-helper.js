function getError(err) {

    if(config.isProduction) {
        return "Some error occurred, please try again.";
    }

    return err.message;

}

module.exports = {
    getError
};