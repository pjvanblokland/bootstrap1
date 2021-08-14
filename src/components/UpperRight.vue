<template>
    <div>
        <div>
            <table>
                <tr>
                    <td>
                        <input
                            type="radio"
                            value="0"
                            name="show"
                            v-model="showStat"
                            @click="recalculate()"
                        /><label>{{ $t("alg_gemiddelde") }}</label>
                    </td>
                    <td width="100">
                        <label>
                            <input
                                type="radio"
                                name="show"
                                value="1"
                                v-model="showStat"
                                @click="recalculate()"
                            />
                            {{ $t("alg_median") }}>
                        </label>
                    </td>
                </tr>
            </table>
        </div>
        <p class="kop">{{ $t("alg_statistics") }}:</p>
        <div>
            <table
                v-if="this.orgStats != null && this.orgStats.totalNumber > 0"
            >
                <tr>
                    <td>{{ $t("alg_aantal") }}</td>
                    <td class="getal">{{ orgStats.totalNumber }}</td>
                </tr>
                <tr>
                    <td>{{ $t("alg_gemiddelde") }}</td>
                    <td class="getal">{{ orgStats.mean.toFixed(2) }}</td>
                </tr>
                <tr >
                    <td>{{ $t("alg_median") }}</td>
                    <td class="getal">{{ orgStats.median.toFixed(2)}}</td>
                </tr>
                <tr>
                    <td>{{ $t("alg_sd") }}</td>
                    <td class="getal">{{ orgStats.sd.toFixed(2) }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "UpperRight",
    props: ['orgStats' ],
    data() {
        return {
            showStat: "0"
           
        };
    },
    
    methods: {
        recalulate() {
            this.showStat = 1 - this.showStat;
        },
    },
});
</script>
