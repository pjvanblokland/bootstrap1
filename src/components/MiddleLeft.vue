<template>
  <div>
    <div>
      <h2 class="header">{{ $t("alg_bootstrap") }}</h2>
      <div
        style="display:flex; align-items:center;  "
      >
        <button
          :class="tempo == 0 ? 'blue' : 'notblue'"
          @click="onTempo(0)"
        >
          &#9658;
        </button>
        <button
          style="width: 35px;letter-spacing:-6px"
          :class="tempo == 1 ? 'blue' : 'notblue'"
          @click="onTempo(1)"
        >
          &#9658;&#9658;
        </button>
        <button
          style="width: 40px; letter-spacing:-6px"
          :class="tempo == 2 ? 'blue' : 'notblue'"
          @click="onTempo(2)"
        >
          &#9658;&#9658;&#9658;
        </button>
        <button
          @click="doStop()"
          :class= "active?'red':'silver'" 
          style=" margin-left:5px;disabled:!active , @click:doStop"
        >
          &#11044;
        </button>
      </div>
      <div style="float:left">
        <button
          @click="make1000()"
          style="letter-spacing: 0; width: 50px; color: blue;margin-top:2px;"
        >
          +1000
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MiddleLeft",
  data() {
    return {}
  },
  props: {
    tempo: {type:Number,required:true},
    active:{type:Boolean,required:true},
  },
  methods: {
    onTempo(value) {
      console.log( 'ontempo ', value)
      this.$emit("onTempo", value);
    },
    make1000() {
      this.$emit("make-1000");
    },
    doStop() {
      this.$emit("doStop");
    },
  },
});
</script>
<style scoped>
button {
  width: 30px;
  height: 30px;
  /*line-height: 30px;*/

  border: 2px solid black;
  /* outline: none;*/

  padding: 0;
  font-size: 1em;
  text-align:center;
}
.blue {
  color: blue;
}
.notblue {
  color: #33ccff;
}
.red {
  color:red;
}
.silver {
  color:silver;
}
</style>


