
import regression from 'regression';

export default function (data) {
  let result = regression('polynomial', data, 2);
  let [c, b, a] = result.equation;

  return function (x) {
    return a*(x**2) + b*x + c;
  };
};
