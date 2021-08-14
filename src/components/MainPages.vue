<template>
    <div>
        <div v-if="firstPage" class="page">
            <h2>
                {{ $t("bootstrap_single") }} &nbsp;
                <button class="helpButton" @click="giveHelp()">?</button>
            </h2>
            <button @click="startApp()">{{ $t("start_apps") }}</button>
            <p>{{ $t("bootstrap_singleCI") }}</p>
            <div style="margin-left: 75%; text-align: left">
                <p>
                    {{ $t("kies_taal") }}
                    <select v-model="selectedLanguage">
                        <option value="en">English</option>
                        <option value="de">Deutsch"</option>
                        <option value="tr">Türkçe</option>
                        <option value="nl">Nederlands</option>
                        <option value="pl">Polski</option>
                        <option value="es">Español</option>
                        <option value="sv">Svenska</option>
                        <option value="fr">Français</option>
                        <option value="ru">Пусский"</option>
                        <option value="it">Italiano</option>
                        <option value="ja">中国佬</option>
                        <option value="zh">日本語</option>
                        <option value="pt">Português</option>
                    </select>
                </p>
                <br />

                <p>Piet van Blokland</p>
                <p>&copy;NVvW amsterdam 2022</p>
            </div>
        </div>
        <div v-if="!firstPage" class="page">
            <div v-if="!firstPage" class="page">
                <div class="row upper">
                    <div class="col leftside">
                        <UpperLeft
                            @onUpdate="setDataList($event)"
                            @onUpdateStats="setOrgStats"
                        ></UpperLeft>
                    </div>
                    <div class="col colCenter">
                        <UpperCenter></UpperCenter>
                    </div>
                    <div class="col rightside">
                        <UpperRight :orgStats="orgStats"> </UpperRight>
                    </div>
                </div>
                <div class="row middleRow">
                    <div class="col leftside">
                        <MiddleLeft
                            @onTempo="setTempo($event)"
                            @doStop="doesStop()"
                            @make1000="make1000()"
                            :active="active"
                            :tempo="tempo"
                        >
                        </MiddleLeft>
                    </div>
                    <div class="col colCenter">
                        <MiddleCenter />
                    </div>
                    <div class="col rightside">
                        <MiddleRight />
                    </div>
                </div>
                <div class="row lower">
                    <div class="col leftside">
                        <LowerLeft></LowerLeft>
                    </div>
                    <div class="col colCenter">
                        <LowerCenter />
                    </div>
                    <div class="col rightside">
                        <LowerRight />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.page {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
.helpbutton {
    width: 30px;
    font-weight: bolder;
    border-radius: 50%;
    color: blue;
}

.row,
.col {
    overflow-x: hidden;
    overflow-y: hidden;
    position: absolute;
}
.row {
    left: 0;
    right: 0;
}
.col {
    overflow: hidden;
    top: 0;
    bottom: 0;
}
.scroll-x {
    overflow-x: auto;
}
.scroll-y {
    overflow-y: auto;
}
.leftside {
    left: 0;
    width: 170px;
    background: #d6d6d6;
    padding: 10px;
}
.rightside {
    right: 0;
    width: 180px;
    background: #d6d6d6;
    padding-left: 10px;
}
.colCenter {
    left: 170px;
    right: 180px;
}
.upper {
    top: 0;
    height: 33%;
}
.middleRow {
    top: 33%;
    bottom: 33%;
    border-top: solid silver;
}
.lower {
    height: 33%;
    bottom: 0;
    border-top: solid silver;
}
</style>




<script>
/*function median(myMat) {
    var halve = Math.floor(myMat.length / 2);
    if (myMat.length % 2) return myMat[halve];
    else return (myMat[halve - 1] + myMat[halve]) / 2.0;
}
/*
function getStats(myMat1) {
    console.log('getStats',myMat1);
    var myMat=myMat1.slice();
    var stats = {
        totalNumber: myMat.length,
        mean: NaN,
        median: NaN,
        sd: NaN,
        minimum: Number.MAX_VALUE,
        maximum: -Number.MAX_VALUE,
    };
    var sum = 0;
    var sum2 = 0;
    console.log('getStats aangeroepen');
     console.log('getStats',myMat);
    for (let i = 0; i < stats.totalNumber; i++) {
        sum += myMat[i];
        sum2 += myMat[i] * myMat[i];
    }
    console.log(sum,sum2,stats.totalNumber);
    if (stats.totalNumber > 0) {
        stats.mean = sum / stats.totalNumber;
        myMat.sort(function (a, b) {
            return a - b;
        });
        console.log('gesorteerd ',myMat);
        stats.median = median(myMat);
        stats.minimum = myMat[0];
        stats.maximum = myMat[stats.totalNumber - 1];
        if (stats.totalNumber > 1) {
            stats.sd = Math.sqrt(
                (sum2-sum*sum) / stats.totalNumber / (stats.totalNumber - 1)
            );
        }
    }
    return stats;
}*/
import { defineComponent } from "vue";
import bootstrap1Data from "@/js/fingertips1.js";

import UpperLeft from "./UpperLeft.vue";
import UpperCenter from "./UpperCenter.vue";
import UpperRight from "./UpperRight.vue";
import MiddleLeft from "./MiddleLeft.vue";
import MiddleCenter from "./MiddleCenter.vue";
import MiddleRight from "./MiddleRight.vue";
import LowerLeft from "./LowerLeft.vue";
import LowerCenter from "./LowerCenter.vue";
import LowerRight from "./LowerRight.vue";


export default defineComponent({
    name: "MainPages",
    components: {
        UpperLeft,
        UpperCenter,
        UpperRight,
        MiddleLeft,
        MiddleCenter,
        MiddleRight,
        LowerLeft,
        LowerCenter,
        LowerRight,
    },
    data() {
        return {
            firstPage: true,
            tempo: 0,
            selectedLanguage: "nl",
            switch: 500,
            fullDraws: [],
            statDraws: [],
            lastDraw: [],
            dataList: [1, 2, 3],
            orgStats: null,
            active: false,
            isDirty: false,
            bootstrap1Data: bootstrap1Data,
            timer1: null,

            helpURL: "../help/en/index.html?bootstrap1.htm",
            languages: [
                { id: 0, text: "English", value: "en" },
                { id: 1, text: "Deutsch", value: "de" },
                { id: 2, text: "Türkçe", value: "tr" },
                { id: 3, text: "Nederlands", value: "nl" },
                { id: 4, text: "Polski", value: "pl" },
                { id: 5, text: "Español", value: "es" },
                { id: 6, text: "Svenska", value: "sv" },
                { id: 7, text: 'Français"', value: "fr" },
                { id: 8, text: "Пусский", value: "ru" },
                { id: 9, text: "Italiano", value: "it" },
                { id: 10, text: '中国佬"', value: "ja" },
                { id: 11, text: "日本語", value: "zh" },
                { id: 12, text: "Português", value: "pt" },
            ],
        };
    },
    watch: {
        selectedLanguage(payload) {
            console.log("selected language payload ",payload);
            this.$i18n.locale = payload;
            localStorage.setItem("locale", payload);
            if (
                payload == "tr" ||
                payload == "pl" ||
                payload == "es" ||
                payload == "sv" ||
                payload == "fr" ||
                payload == "ru" ||
                payload == "it" ||
                payload == "zh" ||
                payload == "ja" ||
                payload == "pt"
            ) {
                payload = "en";
            }
            this.helpURL = "../help/" + payload + "/index.html?bootstrap1.htm";
        },
    },
    methods: {
        startApp() {
            this.firstPage = false;
        },
        giveHelp() {
            window.open(this.helpURL, "_blank");
        },

        setDataList(value) {
            console.log("setDataList", value);
            this.dataList = Object.freeze(value.slice()); //https://vuedose.tips/improve-performance-on-large-lists-in-vue-js
            console.log("dataList ", this.dataList);
        },
        setOrgStats(value) {
            console.log("orgStat", value);
            this.orgStats = value;
            console.log("this.orgStats  ", this.orgStats);
        },

        /************************************Simuleren ******************************** */

        makeFullDraw(len) {
            let res = { mean: 0, median: 0, sd: 0 };
            var myDraws = [];
            var myMat = [];
            var choice;
            var number,
                sum = 0,
                sum2 = 0;
            for (let i = 0; i < len; i += 1) {
                choice = Math.floor(len * Math.random());
                myDraws.push(choice);
                number = this.dataList[choice];
                sum += number;
                sum2 += number * number;
                myMat.push(number);
            }
            myMat.sort()(function (a, b) {
                return a - b;
            });
            res.mean = sum / len;
            res.sd = (sum2 - sum * sum) / len / (len - 1);
            this.statDraws.push(res);
            this.fullDraws.push(myDraws);
            return myDraws;
        },
        makeShortDraw(len) {
            let res = { mean: 0, median: 0, sd: 0 };
            var myMat = [];
            var number,
                sum = 0,
                sum2 = 0;
            for (let i = 0; i < len; i += 1) {
                number = this.dataList[Math.floor(len * Math.random(len))];
                sum += number;
                sum2 += number * number;
                myMat.push(number);
            }
            myMat.sort()(function (a, b) {
                return a - b;
            });
            res.mean = sum / len;
            res.sd = (sum2 - sum * sum) / len / (len - 1);
            this.statDraws.push(res);
        },
        makeDraws(extra) {
            const len = this.dataList.length;

            var addToList = extra + this.fullDraws.length < this.switch;
            if (addToList) {
                for (let i = 0; i < extra; i += 1) {
                    this.makeFullDraw(len);
                }
                this.lastDraw =
                    this.fullDraws[this.fullDraws[this.fullDraws.length - 1]];
            } else {
                for (let i = 0; i < extra - 1; i += 1) {
                    this.makeShortDraw(this.dataList);
                }
                this.lastDraw = this.makeFullDraw();
            }
        },

        make1000() {
            if (this.dataList.length > 2)
                if (!this.active()) {
                    this.doStart();
                }
            this.nextStep(999);
        },
        finishDraw() {
            console.log("finish Draw");
        },
        enableAll() {
            console.log("enableall");
        },
        disableAll() {
            console.log("disable all");
        },
        cleanAll() {
            if (this.isDirty) {
                this.statDraws = [];
                this.fullDraws = [];
                this.isDirty = false;
            }
        },

        doStart() {
            if (this.dataList.length > 0) {
                this.disableAll();
                console.log("doStart");
                this.active = true;
            }
        },
        nextStep() {
            console.log("nextStep");
        },
        makeClean() {
            if (this.isDirty) {
                this.cleanAll();
            }
        },
        doesStop() {
            this.finishDraw();
            this.active = false;
            this.tempo = 0;
            this.enableAll();
        },

        setTempo(tempo) {
            //onRating(rating)
            console.log("tempo in main.vue ", tempo);
            this.finishDraw();
            if (this.timer1 != null) {
                window.clearInterval(this.timer1);
                this.timer1 = null;
            }
            if (this.active) {
                if (tempo == this.tempo) {
                    if (tempo == "0") {
                        this.nextStep();
                    } else {
                        this.tempo = 0;
                    }
                } else {
                    this.tempo = tempo;
                }
            } else {
                //not active()
                this.tempo = tempo;
                this.doStart();
                if (this.tempo < 2) {
                    this.nextStep();
                }
            }
            if (this.tempo == 2) {
                this.timer1 = setInterval(this.nextStep(), 50);
            }
        },
    },

    /************************************Language******************************** */

    created() {
        var locale = localStorage.getItem("locale");
        console.log("locale  ", locale);
        var url = document.URL,
            q,
            hash,
            number;
        const language_codes = [
            "en",
            "de",
            "tr",
            "nl",
            "pl",
            "sp",
            "sv",
            "ru",
            "it",
            "ja",
            "zh",
            "pt",
        ];
        q = url.split("?")[1];
        if (q != undefined) {
            q = q.split("&");
            for (let i = 0; i < q.length; i++) {
                hash = q[i].split("=");
                if (hash[0] == "language") {
                    number = parseInt(hash[1], 10); // to keep inline with old version
                    if (number) {
                        locale = language_codes[number];
                    } else locale = hash[1];
                }
            }
        }
        if (!locale) {
            if (navigator.language) {
                locale = navigator.language.substring(0, 2);
            }
        }
        this.selectedLanguage = locale;
    },
});
</script>


