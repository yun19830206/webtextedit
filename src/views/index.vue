<template>
  <div class="rich-box">
    <div class="left-box">
      <wordMark
        :fieldList="fieldList"
        @wordToLineExpress="wordToLineExpress"
      ></wordMark>
    </div>
    <div class="right-box">
      <el-button class="save" @click="save">保存</el-button>
      <expressKn
        ref="expressKn"
        :fieldList="fieldList"
        :currentSelectMarkId="currentSelectMarkId"
        @expressToLineWord="expressToLineWord"
      ></expressKn>
    </div>
  </div>
</template>
<script>
import LeaderLine from "leader-line-vue";
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  onUnmounted,
  ref,
} from "vue";
import wordMark from "./wordMark";
import expressKn from "./expressKn";
export default defineComponent({
  components: { wordMark, expressKn },
  setup() {
    const expressKn = ref();
    const state = reactive({
      currentSelectMarkId: null,
      timer: null,
      linkLine: null,
      linkLineTimer: null,
      fieldList: [
        {
          fieldName: "名称",
          fieldValue: null,
          fieldId: null,
          classTitle: "mark_red",
          color: "rgba(247, 48, 48, 0.8)",
        },
        {
          fieldName: "格式",
          fieldValue: null,
          fieldId: null,
          classTitle: "mark_green",
          color: "rgba(19, 160, 19, 0.8)",
        },
        {
          fieldName: "类型",
          fieldValue: null,
          fieldId: null,
          classTitle: "mark_blue",
          color: "rgba(63, 81, 188, 0.8)",
        },
        {
          fieldName: "日期",
          fieldValue: null,
          fieldId: null,
          classTitle: "mark_default",
          color: "#ffff00",
        },
      ],
    });
    const expressToLineWord = ({ dom, data }) => {
      const currentDom = dom;
      state.linkLineTimer && clearTimeout(state.linkLineTimer);
      const Dom = window.selfIframe.querySelectorAll(
        `span[data-markid='${data.fieldId}']`
      )[0];
      if (Dom) {
        state.linkLine && state.linkLine.hide();
        const styleOption = {
          color: "red",
          size: 2,
          endSocket: "right",
          hide: true,
        };
        state.linkLine =
          Dom && LeaderLine.setLine(currentDom, Dom, styleOption);
        if (state.linkLine) {
          state.linkLine.show("draw");
          state.linkLineTimer = setTimeout(() => {
            state.linkLine.hide();
          }, 1000);
        }
      }
    };
    const wordToLineExpress = (currentSelectMarkId) => {
      state.currentSelectMarkId = currentSelectMarkId;
    };
    //保存数据
    const save = () => {
      localStorage.setItem("fieldList", JSON.stringify(state.fieldList));
      let currentItem = window.selfIframe.querySelectorAll("body")[0];
      localStorage.setItem("content", currentItem.innerHTML);
    };
    onUnmounted(() => {
      state.linkLine && state.linkLine.remove();
    });
    onMounted(() => {
      state.fieldList = JSON.parse(localStorage.getItem("fieldList"))
        ? JSON.parse(localStorage.getItem("fieldList"))
        : state.fieldList;
    });
    return {
      ...toRefs(state),
      save,
      expressToLineWord,
      wordToLineExpress,
      expressKn,
    };
  },
});
</script>
<style>
.rich-box {
  position: relative;
  width: 100%;
  display: flex;
}

.left-box {
  width: 70%;
}
.right-box {
  flex: auto;
  margin-left: 15px;
}
.data-box {
  border-radius: 16px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  padding: 0 20px;
  margin-bottom: 10px;
}
.tips {
  background: yellow;
  opacity: 0.6;
  display: flex;
  position: absolute;
  z-index: 11;
}
.tox-collection__group {
  display: none !important;
}
.tips div {
  width: 24%;
}
.mark_default {
  background-color: #ffff00 !important;
}

.mark_red {
  background-color: rgba(247, 48, 48, 0.8) !important;
}

.mark_green {
  background-color: rgba(19, 160, 19, 0.8) !important;
}

.mark_blue {
  background-color: rgba(63, 81, 188, 0.8) !important;
}
.leader-line {
  z-index: 1;
}
.selectField {
  color: #ffffff;
}
</style>
<style scoped>
.tinymce-boxz > textarea {
  display: none;
}
</style>
<style>
/* 隐藏apikey没有绑定当前域名的提示 */
.tox-notifications-container .tox-notification--warning {
  display: none !important;
}

.tox.tox-tinymce {
  max-width: 100%;
}
</style>
