const Joi = require("joi"); // npm i joi

class Vacation {

    constructor(existingVacation) {
        this.id = existingVacation.vacationId;
        this.destination = existingVacation.destination;
        this.description = existingVacation.description;
        this.fromDate = existingVacation.fromDate;
        this.toDate = existingVacation.toDate;
        this.price = existingVacation.price;
        this.imageName= existingVacation.imageName
    }

    // First - define rules regarding vacation properties - validation schema:
    static #postValidationSchema = Joi.object({
        id: Joi.number().optional(),
        destination: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(2).max(1000),
        fromDate: Joi.date().iso().min('now').required(),
        toDate: Joi.date().iso().greater('now').required(),
        price: Joi.number().required().min(2).max(10000),
        imageName: Joi.string().optional()
    });
    static #putValidationSchema = Joi.object({
        id: Joi.number().required().positive().integer(),
        destination: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(2).max(1000),
         fromDate: Joi.date().iso().min('now').required(),
         toDate: Joi.date().iso().greater('now').required(),
         price: Joi.number().required().min(2).max(10000),
        imageName: Joi.string().optional()
    });
 

    // Second - perform the validation on our product:
    validatePost() {
        const result = Vacation.#postValidationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null; // Return one string of the errors. for returning array of string errors: return result.error ? result.error.message.split(". ") : null;
    }
    validatePut() {
        const result = Vacation.#putValidationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null; // Return one string of the errors.
    }

}

module.exports = Vacation;