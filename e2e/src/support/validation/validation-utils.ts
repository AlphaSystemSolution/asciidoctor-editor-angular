/// <reference path="../../../../typings/index.d.ts"/>

let expect = require('chai').expect;

/**
 *
 *
 * @export
 * @class ValidationUtils
 */
export class ValidationUtils {
  /**
   *
   *
   * @static
   * @param {string} type type of element, either of `inputfield` or `element`
   * @param {string} selector element selector
   * @param {boolean} falseCase if true then validate the non existence of content
   * @param {boolean} partialMatch if true the validate the content partially
   * @param {string} [expectedText]
   *
   * @memberOf ValidationUtils
   */
  public static validateContent(type: string, selector: string, falseCase: boolean,
    partialMatch: boolean, expectedText?: string): void {
    let parsedExpectedText: string = '';
    if (typeof expectedText === 'string') {
      parsedExpectedText = expectedText;
    } else {
      // if there is no "expectedText" and test for input field or element does not contain any
      // text, "falseCase" should be equal to " not" and "boolFalseCase"
      // should be true in this case, make "boolFalseCase" false and we will test eqaulity
      // with current value of input field or element
      //
      // if there is no "expectedText" and test for input field or element does contain any text,
      // "falseCase" should be "undefined" and "boolFalseCase"
      // should be false in this case, make "boolFalseCase" true and we will test ineqaulity
      // with current value of input field or element
      falseCase = !falseCase;
    }
    if (parsedExpectedText === '' && !falseCase) {
      falseCase = true;
    }
    let text: string = <string>((type === 'inputfield') ? browser.getValue(selector) :
      browser.getText(selector));
    if (falseCase) {
      if (partialMatch) {
        expect(text).to.not.contain(parsedExpectedText);
      } else {
        expect(text).to.not.equal(parsedExpectedText);
      }
    } else {
      if (partialMatch) {
        expect(text).to.contain(parsedExpectedText);
      } else {
        expect(text).to.equal(parsedExpectedText);
      }
    }
  }

}
