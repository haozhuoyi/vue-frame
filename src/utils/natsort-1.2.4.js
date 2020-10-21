/* eslint-disable */
/**
 * natsort.js
 * Sort an array using a "natural order" algorithm.
 *
 * @version 1.2.4
 * @author think49
 * @license http://www.opensource.org/licenses/mit-license.php (The MIT License)
 * @url https://gist.github.com/660141
 * @see <a href="http://sourcefrog.net/projects/natsort/">Natural Order String Comparison</a>
 */
'use strict';

export
    var natsort = (function (sort) {
        var natCompare = (function (String) {
          return function natCompare (string1, string2) {
            var reg1, reg2, result1, result2, number1, number2, token1, token2, diff;

            string1 = String(string1);
            string2 = String(string2);

            if (string1 === string2) {
              return 0;
            }

            reg1 = /(\d+(?:\.\d+)?)|\D+/g;
            reg2 = /(\d+(?:\.\d+)?)|\D+/g;

            while (result1 = reg1.exec(string1), result2 = reg2.exec(string2), result1 && result2) {
              number1 = result1[1];
              number2 = result2[1];

              if (number1 && number2) {
                diff = number1 - number2; // ToNumber

                if (diff) {
                  return diff;
                }
              } else {
                token1 = result1[0];
                token2 = result2[0];

                if (token1 !== token2) {
                  return token1 > token2 ? 1 : -1;
                }
              }
            }

            if (!result1) {
              return result2 ? -1 : 0;
            }

            return 1;
          };
        }(String));

        function createNatCompareWithCallback (convertfn) {
          return function (string1, string2) {
            return natCompare(convertfn(string1), convertfn(string2));
          };
        }

        return function natsort (array /* [, convertfn] */) {
          if (arguments.length > 1 && typeof arguments[1] === 'function') {
            return sort.call(array, createNatCompareWithCallback(arguments[1]));
          }

          return sort.call(array, natCompare);
        }
    })(Array.prototype.sort)
