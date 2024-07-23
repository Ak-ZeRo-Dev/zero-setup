export const catchAsyncErrors = (asyncFN) => {
  return (req, res, next) => {
    Promise.resolve(asyncFN(req, res, next)).catch(next);
  };
};
