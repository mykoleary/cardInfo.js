/* 
* This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License. 
* To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/ 
* or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
* 
* created by Myk OLeary 2011
*
* source available at https://github.com/mykoleary/cardInfo.js
*
* copyright information MUST be maintained in this header
*/

function cardInfo(cardNumber) {
    this.length = cardNumber.length; // determine length once so it isn't recalculated
    this.number = cardNumber;
    this.type = "unknown";
    
    this.luhnValid = validateLuhn(cardNumber);
    // MUST check for luhnValid == null if China UnionPay is an accepted type, since it does not use the Luhn algorithm for number verification
    
    // use table at http://en.wikipedia.org/wiki/Bank_card_number to determine card type
    var subFirstTwo = cardNumber.substring(0,2);
    var subFirstFour = cardNumber.substring(0,4);
    if (subFirstTwo == "34" || subFirstTwo == "37") {
        this.type = "American Express";
    } 
    else if (subFirstTwo == "62") {
        this.type = "China UnionPay";
        this.luhnValid = null;
    }
    else if (parseInt(cardNumber.substring(0,3)) >=300 && parseInt(cardNumber.substring(0,3)) <=305) {
        this.type = "Diners Club Carte Blanche";
    }
    else if (subFirstTwo == "30" || subFirstTwo == "36" || subFirstTwo == "38" || subFirstTwo == "39") {
        this.type = "Diners Club International";
    }
    else if (subFirstTwo == "65" || subFirstFour == "6011" || 
            (parseInt(cardNumber.substring(0,3)) >=644 && parseInt(cardNumber.substring(0,3)) <=649) ||
            (parseInt(cardNumber.substring(0,6)) >=622126 && parseInt(cardNumber.substring(0,6)) <=622925) ) {
        this.type = "Discover Card";
    }
    else if ((parseInt(subFirstFour) >=3528 && parseInt(subFirstFour) <=3589)) {
        this.type = "JCB";
    }
    else if (subFirstFour == "6304" || subFirstFour == "6706" || subFirstFour == "6771" || subFirstFour == "6709" ) {
        this.type = "Laser";
    }
    else if (subFirstFour == "5018" || subFirstFour == "5020" || subFirstFour == "5038" || subFirstFour == "6304" ||
            subFirstFour == "6759" || subFirstFour == "6761" || subFirstFour == "6762" || subFirstFour == "6763") {
        this.type ="Maestro";       
    } 
    else if ((parseInt(subFirstTwo) >=51 && parseInt(subFirstTwo) <=55)) {
        // 54/55 are treated as MasterCard due to MasterCard/Diner's Club merger (differs from chart)
        this.type = "MasterCard";
    }
    else if (subFirstFour == "6334" || subFirstFour == "6767") {
        this.type ="Solo";
    }
    else if (subFirstFour == "4903" || subFirstFour == "4905" || subFirstFour == "4911" || subFirstFour == "4936" ||
            subFirstFour == "6333" || subFirstFour == "6759" || cardNumber.substring(0,6) == "564182" || cardNumber.substring(0,6) == "633110") {
        this.type ="Switch";
    } 
    else if (cardNumber.substring(0,1) == "4") {
        this.type = "Visa";
    }
    else if ( subFirstFour == "4026" || subFirstFour == "4508" || subFirstFour == "4844" || subFirstFour == "4913" || 
            subFirstFour == "4917" || cardNumber.substring(0,6) == "417500") {
        this.type = "Visa Electron";
    }
    else {
        this.type = "Unknown";
    }

    this.lengthValid = validateCardLength(this);
    
    if (this.luhnValid && this.lengthValid) {
        this.cardValid = true;
    } else {
        this.cardValid = false;
    }   
    
    this.toString = "number: " + this.number + " / luhnValid: " + this.luhnValid 
        + " / type: " + this.type + " / length: " + this.length + " / lengthValid: " + this.lengthValid
        + " / cardValid: " + this.cardValid + " <br/>";
    
    return this; 
}

function validateLuhn(cardNumber) {
    // uses algorithm at http://en.wikipedia.org/wiki/Luhn_algorithm to determine card number validity
    var sum = 0; // set initial sum at 0
    var oddOrEven = 1; // allows us to determine which numbers to double while working backwards on a number that can be odd or even lengthed
    
    for (i=cardNumber.length; i>0; i--) {
        var curNum = parseInt(cardNumber.substring(i-1,i));
        booleanAdded= false;
        if (oddOrEven % 2 == 0) {
            curNum = curNum * 2;
            if (curNum >= 10) {
                sum += curNum - 9;
                booleanAdded = true;
            }
        }
        if (!booleanAdded) {
            sum += curNum;
        }
        oddOrEven++;
    }
    if (sum % 10 == 0) {
        return true;
    }
    return false;
}

function validateCardLength(cardInfo) {
    // use table at http://en.wikipedia.org/wiki/Bank_card_number to validate card number length
    var boolReturn = false;
    switch(cardInfo.type)
    {
        case "Diners Club Carte Blanche":
        case "Diners Club International":
          if (cardInfo.length == 14) {
            boolReturn = true;
          }
          break;
        case "American Express":
          if (cardInfo.length == 15) {
            boolReturn = true;
          }
          break;
        case "China UnionPay":
        case "Diners Club USA/Canada":
        case "Discover Card":
        case "JCB":
        case "MasterCard":
        case "Visa":
        case "Visa Electron":
          if (cardInfo.length == 16) {
            boolReturn = true;
          }
          break;
        case "Laser":
          if (cardInfo.length >= 16 && cardInfo.length <= 19) {
            boolReturn = true;
          }
          break;
        case "Maestro":
          if (cardInfo.length >= 12 && cardInfo.length <= 19) {
            boolReturn = true;
          }
          break;
        case "Solo":
        case "Switch":
          if (cardInfo.length == 16 || cardInfo.length == 18 || cardInfo.length == 19) {
            boolReturn = true;
          }
          break;
        default:
          // nothing here
    }
    return boolReturn;
}
