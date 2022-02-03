function NotAvailableSelectorError (selector) {
  this.message = selector + 'is not availabele to select';
  this.name = 'NotAvailableSelectorError';
}

function ConditionException (message = 'Unacceptable condtion') {
  this.message = message 
  this.name = 'ConditionException';
}

function ZeroDenominatorException (message = 'Zero in the Denominator of a Fraction') {
  this.message = message ;
  this.name = 'ZeroDenominator';
}

export {NotAvailableSelectorError, ConditionException, ZeroDenominatorException};