'use strict';

exports.jsonSchemaValidation = (validatorName) => {
  return (error, req, res, next) => {
    
    if (error.name === validatorName) {
      
      console.error(`${req.method} ${req.originalUrl} 400 ${JSON.stringify(error.message)}`);
      
      res.status(400).json({
        result: {
          code: 400,
          description: 'Bad Request',
          info: error.validations
        }
      });
      
    } else {
      console.log("Request success");
      next(error);
    }
  }
};