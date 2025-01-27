const preventError = (thefunc) => (req, res, next) => {
    Promise.resolve(thefunc(req, res, next)).catch(next);
  };

export default preventError;
