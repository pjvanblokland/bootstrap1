<template>
    <div>
        <input v-model="dataTitle" />
        <textarea v-model="editorData"></textarea>
    </div>
</template>
<script>
import { defineComponent } from "vue";
//import bootstrap1Data from "@/data/fingertips1";
export default defineComponent({
    name: "UpperLeft",
    data() {
        return {
            editorData: "1,2",
            dataTitle: "Tikken op tafel",
            locale: "de",
            dataList: [],
            orgStats: {},
            oldDataList: [Math.random()],
            bootstrap1Data: `{
 	"app": "bootstrap1",
 	"words": [{
 		"en": "Tap with finger",
 		"de": "Tippen Sie mit dem Finger",
 		"tr": "Parmakla dokunun",
 		"nl": "Tikken met vinger",
 		"pl": "Dotknij palcem",
 		"es": "Toque con el dedo",
 		"sv": "Tryck med fingret",
 		"fr": "Tap avec le doigt",
 		"ru": "Постучите пальцем",
 		"it": "Toccare con il dito",
 		"zh": "用手指轻拍",
 		"ja": "指でタップする",
 		"pt": "Toque com o dedo"
 	}],
 	"dataTitle": "Tap with finger",
 	"dataA": "245 246 246 248 248 248 250 250 250 252",
 	"info": {
 		"en": "The number of tapping a finger on a table in a minute",
 		"de": "Die Zahl der mit dem Finger auf einem Tisch in einer Minute tippen",
 		"tr": "Bir dakika içinde bir masada bir parmak dokunarak sayısı",
 		"nl": "Het aantal tikken met de vinger op een tafel binnen een minuut",
 		"pl": "Liczba stukając palcem na stole w minutę",
 		"es": "El número de tocar con un dedo sobre una mesa en un minuto",
 		"sv": "Antalet knacka ett finger på ett bord i en minut",
 		"fr": "Le nombre de tapotant un doigt sur une table dans une minute",
 		"ru": "Число постукивая пальцем по столу в минуту",
 		"it": "Il numero di toccando un dito su un tavolo in un minuto",
 		"zh": "在一分钟内轻击手指在桌子上数",
 		"ja": "分でテーブルの上に指をタップ数",
 		"pt": "O número de batendo um dedo sobre uma mesa em um minuto"
 	}
 }`,
       
        };
    },
    methods: {
        setOldData(myDataList) {
            this.oldDataList = [...myDataList];
        },
        updateData(value) {
            var myDataList = value.slice();
            console.log("onUpdate ", value);

            console.log("dataList ", myDataList);
            this.$emit("onUpdate", myDataList);
        },
        updateStats(value) {
            console.log(value);
            this.orgStats=value;
            this.$emit("onUpdateStats", this.orgStats);
        },
        analyze() {
            var content = this.editorData,
                res,
                sum = 0,
                sum2 = 0,
                h,
                j,
                myDataList = [],
                number;
            var stats = {
                totalNumber: 0,
                mean: NaN,
                median: NaN,
                sd: NaN,
                minimum: Number.MAX_VALUE,
                maximum: -Number.MAX_VALUE,
            };

            content = content.replace(/\s\s+/g, " ");
            content = content.replace(/,/g, ".");
            res = content.split(/\s/);

            for (let i in res) {
                number = parseFloat(res[i]);
                if (!isNaN(number)) {
                    sum += number;
                    sum2 += number * number;
                    myDataList.push(number);
                }
            }

            var equal = myDataList.length == this.oldDataList.length;

            if (equal) {
                for (let i = 0; i < myDataList.length; i += 1) {
                    if (myDataList[i] != this.oldDataList[i]) {
                        equal = false;
                        break;
                    }
                }
            }
            if (!equal) {
                myDataList.sort(function (a, b) {
                    return a - b;
                });
             
                stats.totalNumber = myDataList.length;
                   console.log(stats.totalNumber,sum,sum2);
                   console.log((sum2-(sum*sum)/stats.totalNumber));
                   console.log ((sum2-(sum*sum)/stats.totalNumber)/(stats.totalNumber-1));
                if (stats.totalNumber > 0) {
                    stats.minimum = myDataList[0];
                    stats.maximum = myDataList[stats.totalNumber - 1];
                    stats.mean = sum / stats.totalNumber;
                    if (stats.totalNumber > 1) {
                        
                        stats.sd = Math.sqrt(
                            (sum2 -  (sum * sum) /stats.totalNumber )/(stats.totalNumber - 1));
                        
                    } // https://nl.wikipedia.org/wiki/Variantie
                }
                var halve = Math.floor(myDataList.length / 2);
                if (myDataList.length % 2) {
                    stats.median = myDataList[halve];
                } else {
                    stats.median =
                        (myDataList[halve - 1] + myDataList[halve]) / 2.0;
                    for (let i = 0; i < myDataList.length; i += 1) {
                        j = Math.floor(stats.totalNumber * Math.random());
                        h = myDataList[i];
                        myDataList[i] = myDataList[j];
                        myDataList[j] = h;
                    }

                    this.setOldData(myDataList);
                    this.updateData(myDataList);
                    this.updateStats(stats);
                }
            }
        }
    },

        created: function () {
            var datas = JSON.parse(this.bootstrap1Data);
            this.editorData = datas.dataA;
            this.analyze();
        },
    
});
</script>


