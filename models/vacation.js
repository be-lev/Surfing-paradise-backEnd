const Joi = require("joi"); // npm i joi

class Vacation {

    constructor(existingVacation) {
        this.id = existingVacation.vacationId;
        this.destination = existingVacation.destination;
        this.description = existingVacation.description;
        this.fromDate = existingVacation.fromDate;
        this.toDate = existingVacation.toDate;
    }

    // First - define rules regarding vacation properties - validation schema:
    static #postValidationSchema = Joi.object({
        id: Joi.number().optional(),
        destination: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(2).max(1000),
        //! pay attention to the format of the date and the validation scheme iam suspecting it at QA level
        fromDate: Joi.date().greater('now').required(),
        toDate: Joi.date().required()
    });
    static #putValidationSchema = Joi.object({
        id: Joi.number().required().positive().integer(),
        destination: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(2).max(1000),
         //! pay attention to the format of the date and the validation scheme iam suspecting it at QA level
        fromDate: Joi.date().greater('now').required(),
        toDate: Joi.date().required()
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