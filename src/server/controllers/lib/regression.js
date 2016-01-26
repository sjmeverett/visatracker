
import regression from 'regression';

export default function (data) {
  let result = regression('logarithmic', data);
  let [a, b] = result.equation;

  return function (x) {
    return a + b * Math.log(x);
  };
};
