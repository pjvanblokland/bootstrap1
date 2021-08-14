

function isInteger(num) {
    return (num ^ 0) === num;
}
function sqr(x){
  return x*x;
}

function rotateLabel(help, context, x, y, hoek) {
    "use strict";
    context.save();
    help = help.toString();
    context.translate(x, y);

    context.rotate(hoek * Math.PI / 180);
    context.fillText(help, 0, 0);
    context.restore();
}

const assenfont = "12px Arial";
const defaultfont = "20px Arial";
const titelfont = "24px Arial";
const colors = ["#99C1DC", "Red", "Maroon", "Green", "Pink", "Aqua", "Lime", "Fuchsia"];
const klasgroot = 80;
var negpowers = [1, 0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001, 1E-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12, 1e-13, 1e-14, 1e-15, 1e-16, 1e-17, 1e-18, 1e-19, 1e-20, 1e-21, 1e-22, 1e-23, 1e-24, 1e-25, 1e-26, 1e-27, 1e-28, 1e-29, 1e-30];
var pospowers = [1, 10, 100, 1000, 10000, 1E5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 1e19, 1e20, 1e21, 1e21, 1e22, 1e23, 1e24, 1e25, 1e26, 1e27, 1e28, 1e29, 1e30];

/*var stripnumber = function (help) {
    "use strict";
    var l = help.indexOf('.'),
        h;
    if (l === 0) {
        return help;
    } else {
        return parseFloat(help);
        // help = help.replace(/\.0+$/, '');
        //    return help;
        //   h=regexp
        //    als laatste is punt dan verwijderen
    }
};*/

function geefcomma(step) {
    "use strict";
    if (step > 2.6) {
        return 0;
    } else if (step > 2.4) {
        return 1;
    } else if (step > 0.999) {
        return 0;
    } else {
        return Math.round(-Math.log(0.5 * step) / Math.log(10));
    }
}

function diffn(number, comma) {
    "use strict";

    var help;
    help = number.toFixed(comma);
    return +help - Math.pow(10, -comma);


    //  return Math.floor(+number * pospowers[comma]) / pospowers[comma];
}

function diffp(number, comma) {
    "use strict";
    return Math.ceil(+number * pospowers[comma]) / pospowers[comma];
}

function niceBorders(minimum, maximum) {
    // geeft kleiner en groter number dan minimum en maximum
    "use strict";
    var numberIntervals, i, number, fraction, roundNumber, step, firstBorder, commaNow; //numberIntervals volledig gekozen door programma
    number = +maximum - minimum;
    if (number < 1E-10) {
        maximum = minimum + 1;
        minimum = maximum - 2;
        commaNow = 1;
    } else {
        if (number > 5) {
            commaNow = 0;
        } else {
            commaNow = -Math.floor(Math.log(2 * number) / Math.log(10)) + 1;
        }
    }
    if (number >= 5 * diffp(0, commaNow)) {
        // zorg dat je een number tussen 15 en 100 krijgt
        i = Math.floor(Math.log(number) / Math.log(10)) - 1;
        fraction = number / Math.pow(10, i);
        if (fraction < 15) {
            step = 2;
        } else if (fraction < 20) {
            step = 3;
        } else if (fraction < 45) {
            step = 5;
        } else if (fraction < 80) {
            step = 10;
        } else {
            step = 20;
        }
        roundNumber = +(+step * Math.pow(10, i)).toFixed(commaNow);
    } else {
        roundNumber = diffp(0, commaNow);
    }
    step = +roundNumber;
    firstBorder = +Math.round(minimum / roundNumber) * roundNumber;
    if (minimum < firstBorder) {
        firstBorder -= step;
    }
    while (firstBorder + step < minimum) {
        firstBorder += step;

    }

    commaNow = geefcomma(step);
    numberIntervals = Math.round((maximum - firstBorder) / roundNumber);
    while (firstBorder + numberIntervals * roundNumber <= maximum) {
        numberIntervals += 1;
    }
    while (firstBorder + step < minimum) {
        firstBorder += step;
        numberIntervals -= 1;
    }
    while (firstBorder + (numberIntervals - 1) * step > maximum) {
        numberIntervals -= 1;
    }
    if (numberIntervals < 1) {
        numberIntervals = 1;
    }
    return {
        numberIntervals: numberIntervals,
        lowerB: firstBorder,
        bovengr: firstBorder + numberIntervals * step,
        step: step,
        comma: commaNow
    };
}

function withinBorders(numberIntervals, minimum, maximum, commaNow) {
    var firstBorder, intervalWidth;

    var i, number, step, roundNumber, tel;
    var stepmat = [1, 2, 3, 5, 10, 20, 25, 50, 100, 200, 300, 500];
    number = maximum - minimum;
    if (number >= -numberIntervals * diffn(0, commaNow)) {
        i = 0;
        if (number > 1) {
            while (number > pospowers[i]) {
                i += 1;
            }
            i = i - 1;
        } else {
            while (number < negpowers[-i]) {
                i -= 1
            }
        }
        tel = 0;
        do {
            step = stepmat[tel];
            roundNumber = step * Math.pow(10, +i - 1);
            firstBorder = Math.round(minimum / roundNumber) * roundNumber;
            if (minimum < firstBorder) {
                firstBorder -= roundNumber;
            }
            while (firstBorder + roundNumber < minimum) {
                firstBorder += roundNumber;
            }
            tel += 1;
        }
        while (firstBorder + numberIntervals * roundNumber <= maximum);
        intervalWidth = roundNumber;
    } else {
        firstBorder = minimum.toFixed(commaNow);
        intervalWidth = diffp(0.00000000001, commaNow);
    }
    return {
        firstBorder: firstBorder,
        intervalWidth: intervalWidth
    }
}


function berekenverdeling(many, range100) {
    // range100 is een number tussen 12 en 120 many is het aantal intervallen. op grond daarvan wordt de stepgrootte bepaald
    "use strict";
    var ran;
    ran = Math.floor(range100);
    switch (many) {
        case 1:
            if (ran <= 22) {
                return 10;
            } else if (ran <= 35) {
                return 20;
            } else if (ran <= 50) {
                return 30;
            } else if (ran <= 70) {
                return 40;
            } else if (ran <= 90) {
                return 50;
            } else {
                return 70;
            }
        case 2:
            if (ran <= 21) {
                return 5;
            } else if (ran <= 30) {
                return 10;
            } else if (ran <= 59) {
                return 20;
            } else if (ran <= 70) {
                return 25;
            } else if (ran <= 95) {
                return 30;
            } else {
                return 40;
            }
        case 3:
            if (ran <= 24) {
                return 5;
            } else if (ran <= 49) {
                return 10;
            } else if (ran <= 79) {
                return 20;
            } else if (ran <= 99) {
                return 25;
            } else {
                return 30;
            }

        case 4:
            if (ran <= 24) {
                return 5;
            } else if (ran <= 49) {
                return 10;
            } else if (ran <= 79) {
                return 20;
            } else if (ran <= 99) {
                return 25;
            } else {
                return 30;
            }

        case 5:
            if (ran <= 14) {
                return 2;
            } else if (ran <= 29) {
                return 5;
            } else if (ran <= 59) {
                return 10;
            } else if (ran <= 99) {
                return 20;
            } else {
                return 30;
            }

        case 6:
            if (ran <= 16) {
                return 2;
            } else if (ran <= 34) {
                return 5;
            } else if (ran <= 69) {
                return 10;
            } else {
                return 20;
            }

        case 7:
            if (ran <= 18) {
                return 2;
            } else if (ran <= 40) {
                return 5;
            } else if (ran <= 79) {
                return 10;
            } else {
                return 20;
            }
        default:
            if (ran <= 23) {
                return 2;
            } else if (ran <= 59) {
                return 5;
            } else if (ran <= 109) {
                return 10;
            } else {
                return 20;
            }
    }
}


function calcStep(many, maxCount, lowerBound, upperBound) {
    "use strict";
    var range100, mult, lowerB, range, step100, step;
    range = upperBound - lowerBound;
    mult = 1;
    range100 = range;
    if (range100 > 120) {
        while (range100 > 120) {
            range100 = range100 / 10;
            mult = mult * 10;
        }
    } else {
        while (range100 <= 12) {
            range100 = range100 * 10;
            mult = mult / 10;
        }
    }
    lowerB = Math.round(Math.abs(lowerBound / mult / 10)) * mult * 10;
    if (lowerBound < 0) {
        lowerB = -lowerB;
    }
    step100 = berekenverdeling(many, range100);
    step = step100 * mult;
    while (lowerB > lowerBound + 0.1 * range) {
        lowerB -= step;
    }
    while (lowerB <= (lowerBound + 0.001 * range)) {
        lowerB += step;
    }
    return {
        firstPoint: lowerB,
        step: step
    };

}

function calculateInterval(minimum, maximum) {
    //laat minimum en maximum staan en geeft mooie numberlen tussen minimum en maximum
    "use strict";
    var many, maxCount,  range, lowerB, zeronumber, zero, step, firstPoint, numberIntervals, answer;
    range = maximum - minimum;
    maxCount = 10;
    many = 5;
   
    //	do {
    if ((range >= 4) && (range < maxCount + 1) && (Math.abs(maximum) < 99)) {
        step = 1;
      
        lowerB = Math.floor(minimum);
    } else {
        zero = ((minimum <= 0) && (0 <= maximum));
        if (zero) {
            zeronumber = maximum / range;
            if (zeronumber > 0.5) {
                answer = calcStep(Math.round(many * zeronumber), Math.round(maxCount * zeronumber), 0, maximum);
            } else {
                zeronumber = 1 - zeronumber;
                answer = calcStep(Math.round(many * zeronumber), Math.round(maxCount * zeronumber), minimum, 0);
            }
            lowerB = 0;
        } else {
            answer = calcStep(many, maxCount, minimum, maximum);
            lowerB = answer.firstPoint;
        }
        step = answer.step;
    }
    while (lowerB - step >= minimum - 0.001 * range) {
        lowerB -= step;
    }
    if (lowerB < minimum - 0.0001 * range) {
        lowerB += step;
    }
    firstPoint = lowerB;
    numberIntervals = Math.floor((maximum - firstPoint) / step) + 1;

    return {
        firstPoint: lowerB,
        numberIntervals: numberIntervals,
        comma: geefcomma(step),
        step: step
    };
}


function Assen() {
    "use strict";
    var self = this;
    this.firstPointx = 0; // de echte x value van het eerste punt van de labels
    this.stepx = 0;
    this.fx = 0;
    this.cx = 0;
    this.factorx = 0;
    this.constx = 0;
    this.text = true;
    this.minimumx = 0;
    this.maximumx = 1;
    this.firstPointy = 0;
    this.stepy = 0;
    this.fy = 0;
    this.cy = 0;
   
    this.axisRight = false;
    this.factory = 0;
    this.consty = 0;
    this.minimumy = 0;
    this.maximumy = 1;

    this.countBars = 5;
    this.left = 0;
    this.right = 1;
    this.upper = 0;
    this.bottom = 1;
    this.comma = 0;

    this.omhoogy = 0;
    this.percentagesy = false;
    this.gridy = false;
    this.labely = "";
    this.labelx = "";
    this.yAxisToLeft = 0;
    this.percentagesx = false;
    this.verticaal = false;
    this.together = 1; // het aantal staafjes dat samen genomen wordt
    this.dimensions = function (chartLeft, chartTop, chartRight, chartBottom) {
        self.left = chartLeft;
        self.right = chartRight;
        self.bottom = chartBottom;
        self.upper = chartTop;
        self.rangex = self.right - self.left;
        self.rangey = self.bottom - self.upper;
        self.setfactors();
    };
    this.setfactors = function () {
        self.fx = (self.right - self.left) / (self.maximumx - self.minimumx);
        self.cx = self.left - self.fx * self.minimumx;
        self.factorx = 1 / self.fx;
        self.constx = -self.cx / self.fx;
        self.fy = (self.upper - self.bottom) / (self.maximumy - self.minimumy);
        self.cy = self.bottom - self.fy * self.minimumy;
        self.factory = 1 / self.fy;
        self.consty = -self.cy / self.fy;
    };
    this.fill = function (color, context) {
        context.fillStyle = color;
        context.fillRect(self.left, self.upper, self.right - self.left, self.bottom - self.upper);
        context.fill();
        context.beginPath()
    }
    this.drawx = function (context) { //alles is al berekend. Er hoeft alleen nog maar te worden getekend alleen 
        var hoogte = 5,
            value, number, help, i;

        //self.setfactors();


        context.moveTo(self.right, self.bottom);
        context.lineTo(self.left, self.bottom);
        context.font = assenfont;
        context.textBaseline = "top";
        context.textAlign = "center";
        context.strokeStyle = "Black";
        context.fillStyle = "Black";

        for (i = 0; i <= self.numberIntervalsx; i += 1) {
            value = i * self.stepx + self.firstPointx;
            if (self.percentagesx) {
                help = parseFloat((value * 100).toFixed(Math.max(self.commax - 2, 0))) + '%';
            } else {
                help = parseFloat(value.toFixed(this.commax)); //stripnumber}
            }
            number = Math.round(self.fx * value + self.cx);
            if (number <= self.right + 3) {
                if (self.text) { context.fillText(help, number, self.bottom + hoogte + 2); }
                context.moveTo(number, self.bottom);
                context.lineTo(number, self.bottom + hoogte);
                context.stroke();
                context.fill();
            }
        }
        context.textBaseline = "middle";

        if (self.labelx > '') {
            context.textAlign = "right";
            context.fillStyle = "Black";
            // rotateLabel("test",context,100,100,90);
            context.fillText(self.labelx, self.right, self.bottom + 25);
        }
        context.font = defaultfont;
    };
    this.shift = function (shiftx, shifty) {
        self.left += shiftx;
        self.right += shiftx
        self.bottom += shifty;
        self.upper += shifty;

        self.cx = self.left - self.fx * self.minimumx;
        self.cy = self.bottom - self.fy * self.minimumy;
        self.constx = -self.cx / self.fx;
    }
    this.drawxas = function (lowerB, bovengr, niceBorders, context) {
        var answer;
        self.omhoogy = 0;
        if (niceBorders) { //De grenzen moeten worden uitgebreid om mooie numberlen te krijgen}
            answer = niceBorders(lowerB, bovengr);
            self.firstPointx = answer.bottomgr;
            self.stepx = answer.step;
            self.minimumx = answer.bottomgr;
            self.maximumx = answer.uppergr;
            self.numberIntervalsx = answer.numberIntervals;
            self.commax = answer.comma;


        } else { //mooie numberlen tussen deez twee grenzen moeten worden getoond
            self.minimumx = lowerB;
            self.maximumx = bovengr;
            answer = calculateInterval(lowerB, bovengr);
            self.firstPointx = answer.firstPoint;
            self.stepx = answer.step;
            self.commax = answer.comma;
            self.numberIntervalsx = answer.numberIntervals;
        }
        self.setfactors();
        self.stepx = self.stepx * self.fx;

        self.drawx(context);
    };
    this.drawlabel = function (x, text, context) {
        var posx;
        context.beginPath();
        context.font = assenfont;
        context.textBaseline = "top";
        context.textAlign = "center";
        context.strokeStyle = "Black";
        context.fillStyle = "Black";
        posx = x * self.fx + self.cx
        context.moveTo(posx, self.bottom);
        context.lineTo(posx, self.bottom + 5);
        context.stroke();
        context.fillText(text, x * self.fx + self.cx, self.bottom + 5);
    }
    this.drawxtext = function (mat, titel, context, canvas, eerste, aantaly) {
        var aantalcat, i, help, number, hoogte = 10, hoogtegrafiek,
            eerstepunt, breed, klasbreed, onder;
        if (mat == undefined) {
            return;
        }
        if (eerste) { hoogtegrafiek = canvas.height / aantaly }
        else { hoogtegrafiek = canvas.height }
        self.maxbreed = 0;

        for (i in mat) {
            help = mat[i][1];
            breed = context.measureText(help).width;
            if (breed > self.maxbreed) {
                self.maxbreed = breed;
            }
        }
        console.log('canvas  ', canvas.width, hoogtegrafiek);
        self.verticaal = self.maxbreed > (self.fx - 10);
        if ((self.verticaal) && (self.maxbreed > hoogtegrafiek - self.bottom)) {
            onder = self.bottom;
            self.bottom = hoogtegrafiek - self.maxbreed - 10;
            self.rangey = self.bottom - self.upper;
            self.omhoogy = self.bottom - onder;
            self.setfactors();
        } else {
            self.omhoogy = 0;
        }
        context.moveTo(self.right, self.bottom);
        context.lineTo(self.left, self.bottom);
        console.log('x-as ', self.bottom)
        context.font = assenfont;
        context.textBaseline = "top";
        context.textAlign = "center";
        context.fillStyle = "Black";
        context.stroke();
        aantalcat = mat.length;
        self.stepx = 1;
        klasbreed = Math.max(120, self.maxbreed + 10);
        if (self.rangex > aantalcat * klasbreed) {
            //eerstepunt is midden eerste balk
            eerstepunt = (self.right + self.left - (aantalcat - 1) * klasbreed) / 2;
            self.fx = klasbreed;
        } else {
            self.fx = self.rangex / aantalcat;
            eerstepunt = self.left + self.fx / 2;
        }
        self.cx = eerstepunt;
        self.factorx = 1 / self.fx;
        self.constx = -self.cx / self.fx;
        self.minimumx = self.factorx * self.left + self.constx;
        self.maximumx = self.factorx * self.right + self.constx;
        self.numberIntervalsx = mat.length;
        self.firstPointx = -0.5;
        for (i in mat) {
            help = mat[i][1];
            number = Math.round(self.fx * i + self.cx);
            if (number <= self.right + 3) {
                if (self.verticaal) {
                    context.save();
                    context.translate(number, self.bottom + 10);
                    context.rotate(-Math.PI / 2);
                    context.textAlign = "right";
                    context.textBaseline = "middle";
                    context.fillText(help, 0, 0);
                    context.restore();
                } else {
                    context.fillText(help, number, self.bottom + hoogte + 2);
                }
                context.moveTo(number, self.bottom);
                context.lineTo(number, self.bottom + hoogte);
                context.stroke();
            }
        }
        context.textBaseline = "middle";
        context.font = defaultfont;
    };

    this.drawyas = function (lowerB, bovengr, niceBorders, context) {
        var answer;
        if (niceBorders) { //De grenzen moeten worden uitgebreid om mooie numberlen te krijgen}
            answer = niceBorders(lowerB, bovengr);
            self.firstPointy = answer.bottomgr;
            self.stepy = answer.step; //verwijderd 0 aan het einde
            self.minimumy = answer.bottomgr;
            self.maximumy = answer.uppergr;
            self.numberIntervalsy = answer.numberIntervals;
            self.commay = answer.comma;


        } else { //mooie numberlen tussen deez twee grenzen moeten worden getoond
            self.minimumy = lowerB;
            self.maximumy = bovengr;
            answer = calculateInterval(lowerB, bovengr);
            self.firstPointy = answer.firstPoint;
            self.stepy = answer.step;
            self.commay = answer.comma;
            self.numberIntervalsy = answer.numberIntervals;
        }
        self.setfactors();
        self.drawy(context);
    };
    this.geefIndelingx = function (minimum, maximum, firstPoint, step, context) { //minimum,maximum zijn gegeven
        
        self.firstPointx = firstPoint;
        self.stepx = step;
        self.stepx = step * self.fx; //in pixels
        self.minimumx = minimum;
    
        self.numberIntervalsx = Math.floor((maximum - firstPoint) / step);
        self.setfactors();
        self.drawx(context);
    };
    this.geefIndelingy = function (minimum, maximum, firstPoint, step, context) { //minimum,maximum zijn gegeven
        self.firstPointy = firstPoint;
        self.stepy = step;
        self.minimumy = minimum;
        self.maximumy = maximum;
        self.numberIntervalsy = Math.floor((maximum - firstPoint) / step);
        self.setfactors();


        self.drawy(context);
    };

    this.drawy = function (context) { //alles is al berekend. Er hoeft alleen nog maar te worden getekend
        var hoogte = 5,
            naarrechts = 0,
            value, number, help, i;
        context.font = assenfont;
        context.moveTo(self.left - self.yAxisToLeft, self.bottom);
        context.lineTo(self.left - self.yAxisToLeft, self.upper);
        context.textBaseline = "middle";
        if (self.axisRight) {
            context.textAlign = "left";
            naarrechts = 4;
            hoogte = -hoogte
        } else {
            context.textAlign = "right";
        }
        context.fillStyle = "Black";
        for (i = 0; i <= self.numberIntervalsy; i += 1) {
            value = i * self.stepy + self.firstPointy;
            if (self.percentagesy) {
                help = parseFloat((value * 100).toFixed(Math.max(self.commay - 2, 0))) + '%';
            } else {
                help = parseFloat(value.toFixed(this.commay)); //stripnumber}
            }

            //help = stripnumber(value.toFixed(this.commay));

            number = Math.round(self.fy * value + self.cy);
            if (number >= self.upper - 3) {
                if (self.text) { context.fillText(help, self.left - hoogte - 2 - self.yAxisToLeft + naarrechts, number); }
                context.moveTo(self.left - hoogte - self.yAxisToLeft, number);

                context.lineTo(self.left - self.yAxisToLeft, number);
                context.stroke();
                if ((self.gridy) && (number < self.bottom)) {
                    context.beginPath();
                    context.strokeStyle = "silver";
                    context.moveTo(self.left - self.yAxisToLeft, number);
                    context.lineTo(self.right, number);
                    context.stroke();
                    context.beginPath();
                    context.strokeStyle = "Black";
                }

            }
        }

        if (self.labely > '') {
            context.textAlign = "right";
            context.fillStyle = "Black";
            // rotateLabel("test",context,100,100,90);
            rotateLabel(self.labely, context, self.left - 50, self.upper, -90);
        }
        context.font = defaultfont;

    };
    this.grenzenaanpassen = function (bars) { //alleen nog maar in gebruik bij verdelingen 
        var minimum, maximum, bereikx, answer;
        // voor de discrete verdeling
        //{ Als samen =1 dan staat staaf in het midden anders aan het begin} 
        // eerst de staafjes netjes op de xas zetten
        minimum = self.minimumx;
        maximum = self.maximumx;
        bereikx = self.maximumx - self.minimumx;
        self.rangex = bereikx;


        if ((self.rangex < klasgroot) || (self.staven)) {
            self.together = 1;
        } else {
            self.together = 2;
            while ((bereikx / self.together) > klasgroot) {
                self.together += 1;
            }
            maximum = minimum + Math.ceil((maximum - minimum) / self.together) * self.together;
        }
        self.minimum = +minimum;
        self.maximum = +maximum;
        if (self.together > 1) {
            self.maximumy = self.maximumy * self.together;
        }
        self.setfactors();
        answer = calculateInterval(minimum, maximum);
        self.firstPointx = answer.firstPoint;
        self.stepx = answer.step;
        self.numberIntervalsx = answer.numberIntervals;
        if (bars) {
            self.minimumx = +self.minimum - 0.1 * (maximum - minimum) - 0.5;
            self.maximumx = +self.maximum + 0.1 * (maximum - minimum) + 0.5;
        } else {
            self.minimumx = +self.minimum - 0.1 * (maximum - minimum);
            self.maximumx = +self.maximum + 0.1 * (maximum - minimum);

        }
        //zorg dat de minimum begin is van staaf

        self.countBars = Math.round((maximum - minimum) / self.together) + 1;
        //nu de labels op de x-as bepalen

    };
    this.integergrenzen = function () { //alleen nog maar in gebruik bij crossboot
        var minimum, maximum, bereikx, answer;
        // voor de discrete verdeling
        //{ Als samen =1 dan staat staaf in het midden anders aan het begin} 
        // eerst de staafjes netjes op de xas zetten

        minimum = self.minimumx;
        maximum = self.maximumx;
        bereikx = self.maximumx - self.minimumx;
        self.minimum = self.minimumx;
        self.maximum = self.maximumx;
        if (bereikx < klasgroot) {
            self.together = 1;

            self.minimumx -= 0.5;
            self.maximumx += 0.5;

        } else {
            self.together = 2;
            while ((bereikx / self.together) > klasgroot) {
                self.together += 1;
            }
            self.maximumx = minimum + Math.ceil((maximum - minimum) / self.together) * self.together;
        }
        self.setfactors();


        answer = calculateInterval(minimum, maximum);
        self.firstPointx = answer.firstPoint;
        self.stepx = answer.step;
        self.numberIntervalsx = answer.numberIntervals;


        self.countBars = Math.round((self.maximumx - self.minimumx) / self.together);
        //nu de labels op de x-as bepalen

    };

    this.drawxas_discreet = function (context) {
        // dimensies zijn al bepaald
        var posx1, cbar, i, rechts,  aantalsteps, stepx, firststep;
        context.beginPath();
        cbar = self.minimum * self.fx + self.cx;
        context.textAlign = "center";
        context.textBaseline = "top";
        context.fillStyle = "Black";
        context.lineWidth = 1;
        context.font = assenfont;
        aantalsteps = self.countBars;
        stepx = 1;
        stepx = self.stepx;
        while (aantalsteps > 50) {
            if (isInteger(stepx / 5)) { // falsestepx  deelbaar door 5){
                stepx = 5 * stepx;
                aantalsteps = aantalsteps / 5;
            } else {
                if (isInteger(stepx / 2)) {
                    stepx = 2 * stepx;
                    aantalsteps = aantalsteps / 2;
                } else {
                    if (isInteger(stepx / 3)) {
                        stepx = 3 * stepx;
                        aantalsteps = aantalsteps / 3;
                    }
                }
            }
        }

        firststep = self.firstPointx % stepx;
        for (i = firststep; i < self.countBars; i += stepx) {
            posx1 = Math.round(self.fx * self.together * i + cbar);
            if (posx1 <= self.right) {
                context.moveTo(posx1, self.bottom);
                context.lineTo(posx1, self.bottom + 3);
                context.stroke();
            }
        }
        //grote strepen
        rechts = posx1 + 2 * self.fx;
        for (i = -1; i <= self.numberIntervalsx + 1; i += 1) {
            posx1 = (self.firstPointx + i * self.stepx) * self.fx + self.cx;
            if ((posx1 > cbar - self.fx) && (posx1 < rechts)) {
                if (parseInt(i * self.stepx, 10) == i * self.stepx) {
                    context.moveTo(posx1, self.bottom);
                    context.lineTo(posx1, self.bottom + 10);
                    context.fillText(Math.round(i * self.stepx + self.firstPointx), posx1, self.bottom + 12);
                }
            }
        }
        context.moveTo(self.left, self.bottom);
        context.lineTo(self.right, self.bottom);
        context.stroke();
        context.beginPath();
        context.font = defaultfont;
    };
    this.zetdots = function (van, tot, positions, radius) {
        "use strict";
        var all, maxhoog, i;

        function positiebepalen(position, radius, maxhoog) { //all is result
            var i, hoogte, positie, position1;
            hoogte = radius;
            positie = position.possx;
            for (i = van; i < tot; i++) {
                position1 = positions[i];
                if (position1.gezet) {
                    if ((positie - position1.possx < 2 * radius) && (position1.possx - positie < 2 * radius) && (position1.possy > hoogte - radius)) {
                        hoogte = Math.round(Math.sqrt(4 * radius * radius - sqr(positie - position1.possx))) + position1.possy;
                        if (hoogte > maxhoog) {
                            return false;
                        }
                    }
                }
            }
            if (hoogte <= maxhoog) {
                position.possy = hoogte;
                position.gezet = true;
            }
            return true;
        }
        maxhoog = 2 * radius;
        for (i = van; i < tot; i++) {
            positions[i].gezet = false;
            positions[i].possy = 0;
        }
        do {
            all = true;
            for (i = van; i < tot; i++) {
                if (!positions[i].gezet) {
                    all = positiebepalen(positions[i], radius, maxhoog) && all;
                }
            }
            maxhoog = maxhoog + radius;
        } while (!all);
        if (maxhoog > self.rangey) {
            for (i = van; i < tot; i++) {
                positions[i].possy = Math.round(positions[i].possy * self.rangey / maxhoog);
            }
            maxhoog = self.rangey;
        }
        for (i = van; i < tot; i++) {
            positions[i].possy = self.bottom - positions[i].possy;
        }
        return maxhoog;
    }
    this.zetdotslabels = function (van, tot, positions, radius) {
        var i, j, hoogte, max, maxhoog;
        max = 0;
        maxhoog = 0;
        for (i = van; i < tot; i += 1) {
            if (positions[i].value > max) {
                max = positions[i].value;
            }
        }

        for (j = 0; j <= max; j += 1) {
            hoogte = radius;
            for (i = van; i < tot; i += 1) {
                if (positions[i].value == j) {
                    positions[i].possy = hoogte;
                    hoogte += 2 * radius;
                }
            }
            if (hoogte > maxhoog) {
                maxhoog = hoogte;
            }
        }
        if (maxhoog > self.rangey) {
            for (i = van; i < tot; i++) {
                positions[i].possy = Math.round(positions[i].possy * self.rangey / maxhoog);
            }
            maxhoog = self.rangey;
        }
        for (i = van; i < tot; i++) {
            positions[i].possy = self.bottom - positions[i].possy;
        }
        return maxhoog;
    }
    this.drawpunt = function (posx, posy, context) {
        context.beginPath();
        context.moveTo(posx - 5, posy - 5);
        context.lineTo(posx + 5, posy + 5);
        context.moveTo(posx + 5, posy - 5);
        context.lineTo(posx - 5, posy + 5);
        context.stroke();
    }
    this.drawboxplot = function (sortarray, bessta, showextremes, hoogte, dikte, color, context) { //sortarray alleen nodig by showextremes
        var onderhange, bovenhange, range, i, van, tot, posx;
        var yboven = hoogte - dikte / 2;
        var yonder = hoogte + dikte / 2;
        var onderpunt, bovenpunt;
        //hoogte is midden van de boxplot;
        if (bessta.aantal == 0) {
            return;
        }
        van = bessta.van;
        tot = bessta.tot - 1;

        if (tot <= van) {
            return;
        }
        if (tot - van < 3) {
            this.drawpunt(bessta.minimum * this.fx + this.cx, hoogte, context);
            this.drawpunt(bessta.maximum * this.fx + this.cx, hoogte, context);
            this.drawpunt(bessta.q2 * this.fx + this.cx, hoogte, context);
            return;
        }
        range = bessta.q3 - bessta.q1;
        if (showextremes) {
            onderhange = bessta.q1 - 1.5 * range;
            bovenhange = bessta.q3 + 1.5 * range;

            if (onderhange <= sortarray[van][1]) {
                onderhange = sortarray[van][1];
                onderpunt = van;
            } else {
                onderpunt = van;

                while (sortarray[onderpunt][1] < onderhange) {
                    onderpunt += 1;
                }
                onderhange = sortarray[onderpunt][1];
            }
            if (bovenhange >= sortarray[tot][1]) {
                bovenhange = sortarray[tot][1];
                bovenpunt = tot;
            } else {
                //er zijn extremen
                bovenpunt = tot;
                while (sortarray[bovenpunt][1] > bovenhange) {
                    bovenpunt -= 1
                }
                bovenhange = sortarray[bovenpunt][1];
            }
        } else {
            onderhange = bessta.minimum;
            bovenhange = bessta.maximum;
        }
        context.fillStyle = color;
        context.fillRect(bessta.q1 * this.fx + this.cx, yboven, range * this.fx, dikte);
        context.strokeRect(bessta.q1 * this.fx + this.cx, yboven, range * this.fx, dikte)

        context.moveTo(bessta.q2 * this.fx + this.cx, yboven);
        context.lineTo(bessta.q2 * this.fx + this.cx, yonder);
        context.moveTo(onderhange * this.fx + this.cx, yboven);
        context.lineTo(onderhange * this.fx + this.cx, yonder);
        context.moveTo(onderhange * this.fx + this.cx, hoogte);
        context.lineTo(bessta.q1 * this.fx + this.cx, hoogte);
        context.moveTo(bessta.q3 * this.fx + this.cx, hoogte);
        context.lineTo(bovenhange * this.fx + this.cx, hoogte);
        context.moveTo(bovenhange * this.fx + this.cx, yboven);
        context.lineTo(bovenhange * this.fx + this.cx, yonder);
        context.stroke();
        context.beginPath();
        context.arc(bessta.q2 * this.fx + this.cx, hoogte, 4, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
        if (showextremes) {
            for (i = van; i < onderpunt; i += 1) {
                posx = sortarray[i][1] * this.fx + this.cx;
                this.drawpunt(posx, hoogte, context);
            }
            for (i = bovenpunt + 1; i <= tot; i += 1) {
                posx = sortarray[i][1] * this.fx + this.cx;
                this.drawpunt(posx, hoogte, context);
            }
        }
    }
    this.drawtitels = function (namexas, commentxas, context) {
        context.strokeStyle = "Black";
        context.fillStyle = "Black";
        context.lineWidth = 1;
        context.stroke();
        context.beginPath();
        context.font = titelfont;
        context.textAlign = 'center';
        context.fillText(namexas, (self.left + self.right) / 2, self.bottom + self.omhoogy + 35);
        context.fill();
        context.beginPath();
        context.font = assenfont;
        context.textalAlign = 'center';
        context.fillText(commentxas, (self.left + self.right) / 2, self.bottom + self.omhoogy + 60);
        context.beginPath();
    };
    this.drawgroup = function (nameGroup, color, context) {
        context.beginPath();
        context.fillStyle = color;
        context.font = assenfont;
        context.textBaseline = "middle";
        context.strokeStyle = "Black";
        context.arc(self.right - context.measureText(nameGroup).width - 13, self.upper - 10, 8, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
        // context.fillRect(assen.left + 20, assen.upper - 10, 20, 20);
        //context.strokeRect(assen.left + 20, assen.upper - 10, 20, 20);
        context.beginPath();

        context.textAlign = "right";

        context.fillText(nameGroup, this.right, self.upper - 10);
        context.beginPath();
        context.font = assenfont;
    }
    this.drawgroupen = function (context, namen) {
        var i, vanaf;
        context.font = assenfont;
        context.textBaseline = "middle";
        context.strokeStyle = "Black";
        context.textAlign = "left";
        vanaf = this.left + 40;
        for (i in namen) {
            context.fillStyle = colors[i];
            context.arc(vanaf - 10, this.upper, 5, 0, 2 * Math.PI, false);
            context.fill();
            context.stroke();
            context.fillText(namen[i].nameGroup, vanaf, this.upper);
            vanaf += context.measureText(namen[i].nameGroup).width + 50;
            context.beginPath();
        }
        context.font = assenfont;

    }
    this.drawMean = function (context, mean) {
        var posm;

        posm = this.fx * mean + this.cx;
        context.beginPath();
        context.fillStyle = "Red";
        context.strokeStyle = "Red";
        context.moveTo(posm, this.bottom);
        context.lineTo(posm - 10, this.bottom + 15);
        context.lineTo(posm + 10, this.bottom + 15);
        context.closePath();
        context.fill();
        context.stroke();
    }
    this.drawMedian = function (context, mean) {
        var posm;
        posm = this.fx * mean + this.cx;
        context.beginPath();
        context.fillStyle = "Blue";
        context.strokeStyle = "Blue";
        context.moveTo(posm - 4, this.bottom);
        context.lineTo(posm - 4, this.bottom + 15);
        context.lineTo(posm + 4, this.bottom + 15);
        context.lineTo(posm + 4, this.bottom);
        context.closePath();
        context.fill();
        context.stroke();
    }

}