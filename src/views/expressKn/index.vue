<template>
  <div class="field-box">
    <template v-for="(item, index) in fieldList" :key="index">
      <div
        class="data-box"
        :class="currentId && currentId === item.fieldId ? 'selectField' : ''"
        :style="{ background: item.color }"
        :id="item.fieldId || index"
        @click="lineFun($event, item)"
      >
        {{ item.fieldName }}
      </div>
      <Editor
        v-if="index === 1"
        :api-key="apiKey"
        v-model="item.fieldValue"
        :init="fieldInit"
      />
      <el-input
        v-else
        style="margin-bottom: 30px"
        v-model="item.fieldValue"
        placeholder="请输入内容"
      ></el-input>
    </template>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, toRefs, watch } from "vue";
import { defineConfig } from "../config.js";
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
export default defineComponent({
  props: {
    currentSelectMarkId: String,
    fieldList: Array,
  },
  components: { Editor },
  setup(props, { emit }) {
    const { currentSelectMarkId, fieldList } = toRefs(props);
    const state = reactive({
      currentId: null,
      apiKey: "qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc",
      fieldInit: {
        ...defineConfig,
        placeholder: "在这里输入文字", //textarea中的提示信息
        min_width: 120,
        min_height: 220,
        height: 100, //注：引入autoresize插件时，此属性失效
        resize: "both", //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
        branding: false, //tiny技术支持信息是否显示
        statusbar: false, //最下方的元素路径和字数统计那一栏是否显示
        elementpath: false, //元素路径是否显示
        toolbar: [
          "forecolor backcolor bold italic underline strikethrough" +
            "formatselect fontselect fontsizeselect |  table image axupimgs media charmap insertdatetime searchreplace",
        ], //工具栏配置，设为false则隐藏
        menubar: false, //菜单栏配置，设为false则隐藏，不配置则默认显示全部菜单，也可自定义配置--查看 http://tinymce.ax-z.cn/configure/editor-appearance.php --搜索“自定义菜单”
        paste_data_images: true, //图片是否可粘贴
      },
    });
    const lineFun = (ev, item) => {
      if (!item.fieldId) {
        console.log("未标注数据");
        return;
      }
      emit("expressToLineWord", { dom: ev.target, data: item });
    };
    watch(
      () => currentSelectMarkId.value,
      (val) => {
        state.currentId = val;
      }
    );
    onMounted(() => {
      tinymce.init({});
    });
    return {
      ...toRefs(state),
      lineFun,
      fieldList,
    };
  },
});
</script>
<style>
.data-box {
  border-radius: 16px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  padding: 0 20px;
  margin-bottom: 10px;
}
.leader-line {
  z-index: 1;
}
.selectField {
  color: #ffffff;
}
</style>
