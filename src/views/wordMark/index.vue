<template>
  <div class="word-box">
    <Editor
      v-model="content"
      :init="init"
      :api-key="apiKey"
      :disabled="false"
      @contextmenu.prevent="rightClick"
      @click.left="editorLeft"
      ref="myEditor"
      id="myEditor323"
    />
    <div class="tips" ref="tip" id="mark_tips_bar" v-show="tipShow">
      <template v-for="(item, index) in fieldList" :key="index">
        <div
          :style="{ background: `${item.color} !important` }"
          :class="item.classTitle"
          @click="menuSelect(item)"
        >
          {{ item.fieldName }}
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  ref,
  nextTick,
} from "vue";

import Editor from "@tinymce/tinymce-vue";
// import defineConfig from "../config.js";
export default defineComponent({
  components: { Editor },
  props: { fieldList: Array },
  setup(props, { emit }) {
    console.log(props);
    const { fieldList } = toRefs(props);
    const myEditor = ref();
    const tip = ref();
    const state = reactive({
      currentSelectMarkId: "",
      currentId: null,
      apiKey: "qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc",
      tipShow: false,
      init: {
        // ...defineConfig,
        language: "zh_CN",
        placeholder: "在这里输入文字", //textarea中的提示信息
        min_width: 320,
        min_height: 220,
        height: 1000, //注：引入autoresize插件时，此属性失效
        resize: "both", //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
        branding: false, //tiny技术支持信息是否显示
        statusbar: false, //最下方的元素路径和字数统计那一栏是否显示
        elementpath: false, //元素路径是否显示
        toolbar_mode: "wrap",
        fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
        plugins:
          "searchreplace autolink directionality visualblocks visualchars fullscreen image media template code codesample table charmap  nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave", //插件配置 axupimgs indent2em
        toolbar: [
          "fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | subscript superscript removeformat " +
            "formatselect fontselect fontsizeselect |  table image axupimgs media charmap insertdatetime searchreplace | code print | indent2em lineheight formatpainter",
        ], //工具栏配置，设为false则隐藏
        menubar: false, //菜单栏配置，设为false则隐藏，不配置则默认显示全部菜单，也可自定义配置--查看 http://tinymce.ax-z.cn/configure/editor-appearance.php --搜索“自定义菜单”
        paste_data_images: true, //图片是否可粘贴
        //此处为图片上传处理函数
        images_upload_handler: (blobInfo, success, failure) => {
          // 这里用base64的图片形式上传图片,
          let reader = new FileReader(); //本地预览
          reader.readAsDataURL(blobInfo.blob());
          reader.onloadend = function () {
            const imgbase64 = reader.result;
            success(imgbase64);
          };
        },

        file_picker_types: "image", //file image media分别对应三个类型文件的上传：link插件，image和axupimgs插件，media插件。想屏蔽某个插件的上传就去掉对应的参数
        // 文件上传处理函数
        file_picker_callback: function (callback, value, meta) {
          // 使用案例http://tinymce.ax-z.cn/general/upload-images.php
          // meta.filetype  //根据这个判断点击的是什么file image media

          let filetype; //限制文件的上传类型,需要什么就添加什么的后缀
          if (meta.filetype == "image") {
            filetype = ".jpg, .jpeg, .png, .gif, .ico, .svg";
          } else if (meta.filetype == "media") {
            filetype = ".mp3, .mp4, .avi, .mov";
          } else {
            filetype =
              ".pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4, .jpg, .jpeg, .png, .gif, .ico, .svg";
          }
          let inputElem = document.createElement("input"); //创建文件选择
          inputElem.setAttribute("type", "file");
          inputElem.setAttribute("accept", filetype);
          inputElem.click();
          inputElem.onchange = () => {
            let file = inputElem.files[0]; //获取文件信息

            // 所有都转成base64文件流,来自官方文档https://www.tiny.cloud/docs/configure/file-image-upload/#file_picker_callback
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
              // Note: Now we need to register the blob in TinyMCEs image blob
              // registry. In the next release this part hopefully won't be
              // necessary, as we are looking to handle it internally.
              let id = "blobid" + new Date().getTime();
              let blobCache = tinymce.activeEditor.editorUpload.blobCache;
              let base64 = reader.result.split(",")[1];
              let blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);

              // call the callback and populate the Title field with the file name
              callback(blobInfo.blobUri(), { title: file.name });
            };
          };
        },
      },
      content: `<h1 style="margin-top: 17pt; margin-bottom: 16.5pt; break-after: avoid; text-align: justify; line-height: 70.4px; font-family: Calibri; font-size: 22pt;"><strong><span style="font-family: 宋体; font-size: 22pt;">设计文档使用示例</span></strong><strong><span style="font-family: 宋体; font-size: 22pt;"><span style="font-family: Calibri;">word</span><span style="font-family: 宋体;">文档</span></span></strong><strong><span style="font-family: 宋体; font-size: 22pt;">说明</span></strong></h1>
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri; font-size: 10.5pt;"><span style="font-size: 10.5pt;">&nbsp;</span></p>
<h1 style="margin-top: 17pt; margin-bottom: 16.5pt; break-after: avoid; text-align: justify; line-height: 70.4px; font-family: Calibri; font-size: 22pt;"><strong><span style="font-family: 宋体; font-size: 22pt;">知识工程二级标题&nbsp;</span></strong></h1>
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri; font-size: 10.5pt;"><span style="font-family: 宋体; font-size: 10.5pt;">知识工程是一个</span><strong><span style="font-family: 宋体; font-size: 10.5pt;">强大</span></strong><span style="font-family: 宋体; font-size: 10.5pt;">的管理知识的</span><span style="font-family: 宋体; color: #ff0000; font-size: 10.5pt;">概念</span><span style="font-family: 宋体; font-size: 10.5pt;">，分为如下</span><span style="font-family: 宋体; font-size: 12pt;">三个</span><span style="font-family: 宋体; font-size: 10.5pt;">内容</span></p>
<p class="15" style="margin-left: 21pt; text-indent: -21pt;"><span style="font-family: Wingdings; font-size: 10.5pt;">l&nbsp;</span><span style="font-family: 宋体; font-size: 10.5pt;">知识构建工程</span></p>
<p class="15" style="margin-left: 21pt; text-indent: -21pt;"><span style="font-family: Wingdings; font-size: 10.5pt;">l&nbsp;</span><span style="font-family: 宋体; font-size: 10.5pt;">知识标识工程</span></p>
<p class="15" style="margin-left: 21pt; text-indent: -21pt;"><span style="font-family: Wingdings; font-size: 10.5pt;">l&nbsp;</span><span style="font-family: 宋体; font-size: 10.5pt;">知识应用工程</span></p>
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri; font-size: 10.5pt;"><span style="font-size: 10.5pt;">&nbsp;</span></p>
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri; font-size: 10.5pt;"><span style="font-size: 10.5pt;">&nbsp;</span></p>
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri; font-size: 10.5pt;"><span style="font-family: 宋体; font-size: 10.5pt;"><span style="font-family: 宋体;">其中知识应用工程包含</span><span style="font-family: 宋体;">&ldquo;知识搜索&rdquo;&ldquo;智能问答&rdquo;。</span></span></p>
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri; font-size: 10.5pt;"><span style="font-size: 10.5pt;">&nbsp;</span></p>
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;"><span style="font-family: 宋体; font-size: 10.5pt;">投标人名称：</span><span style="font-family: 宋体; font-size: 10.5pt;">海乂知信息科技（南京）有限公司</span></p>
<div align="center">
<table class="MsoNormalTable" style="font-family: 'Times New Roman'; font-size: 10pt; border: none;" border="1" cellspacing="0">
<tbody>
<tr style="height: 28.2pt;">
<td style="width: 101.95pt; padding: 0pt 5.4pt; border-width: 1pt; border-color: windowtext;" valign="center" width="101">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">项目名称</span></p>
</td>
<td style="width: 87.75pt; padding: 0pt 5.4pt; border-width: 1pt; border-color: windowtext;" valign="center" width="87">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">单价</span></p>
</td>
<td style="width: 95.45pt; padding: 0pt 5.4pt; border-width: 1pt; border-color: windowtext;" valign="center" width="95">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">数量</span></p>
</td>
<td style="width: 64.7pt; padding: 0pt 5.4pt; border-width: 1pt; border-color: windowtext;" valign="center" width="64">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">总价</span></p>
</td>
<td style="width: 76.25pt; padding: 0pt 5.4pt; border-width: 1pt; border-color: windowtext;" valign="center" width="76">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">投标报价合计</span></p>
</td>
</tr>
<tr style="height: 30.4pt;">
<td style="width: 101.95pt; padding: 0pt 5.4pt; border-left-width: 1pt; border-left-color: windowtext; border-right-width: 1pt; border-right-color: windowtext; border-top: none; border-bottom-width: 1pt; border-bottom-color: windowtext;" valign="center" width="101">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">建设电子信息领域</span></p>
</td>
<td style="width: 87.75pt; padding: 0pt 5.4pt; border-left-width: 1pt; border-left-color: windowtext; border-right-width: 1pt; border-right-color: windowtext; border-top: none; border-bottom-width: 1pt; border-bottom-color: windowtext;" valign="center" width="87">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">&nbsp;<span style="font-family: 宋体;">1635000</span></span><span style="font-family: 宋体; font-size: 10.5pt;">元</span></p>
</td>
<td style="width: 95.45pt; padding: 0pt 5.4pt; border-left-width: 1pt; border-left-color: windowtext; border-right-width: 1pt; border-right-color: windowtext; border-top: none; border-bottom-width: 1pt; border-bottom-color: windowtext;" valign="center" width="95">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">1</span></p>
</td>
<td style="width: 64.7pt; padding: 0pt 5.4pt; border-left-width: 1pt; border-left-color: windowtext; border-right-width: 1pt; border-right-color: windowtext; border-top: none; border-bottom-width: 1pt; border-bottom-color: windowtext;" valign="center" width="64">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">1635000</span><span style="font-family: 宋体; font-size: 10.5pt;">元</span></p>
</td>
<td style="width: 76.25pt; padding: 0pt 5.4pt; border-left-width: 1pt; border-left-color: windowtext; border-right-width: 1pt; border-right-color: windowtext; border-top: none; border-bottom-width: 1pt; border-bottom-color: windowtext;" valign="center" width="76">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">1635000</span><span style="font-family: 宋体; font-size: 10.5pt;">元</span></p>
</td>
</tr>
<tr style="height: 29.4pt;">
<td style="width: 101.95pt; padding: 0pt 5.4pt; border-left-width: 1pt; border-left-color: windowtext; border-right-width: 1pt; border-right-color: windowtext; border-top: none; border-bottom-width: 1pt; border-bottom-color: windowtext;" valign="center" width="101">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">投标保证金</span></p>
</td>
<td style="width: 324.15pt; padding: 0pt 5.4pt; border-left-width: 1pt; border-left-color: windowtext; border-right-width: 1pt; border-right-color: windowtext; border-top: none; border-bottom-width: 1pt; border-bottom-color: windowtext;" colspan="4" valign="top" width="324">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">20200</span><span style="font-family: 宋体; font-size: 10.5pt;">元</span></p>
</td>
</tr>
<tr style="height: 27.55pt;">
<td style="width: 101.95pt; padding: 0pt 5.4pt; border-left-width: 1pt; border-left-color: windowtext; border-right-width: 1pt; border-right-color: windowtext; border-top: none; border-bottom-width: 1pt; border-bottom-color: windowtext;" valign="center" width="101">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">备注</span></p>
</td>
<td style="width: 324.15pt; padding: 0pt 5.4pt; border-left-width: 1pt; border-left-color: windowtext; border-right-width: 1pt; border-right-color: windowtext; border-top: none; border-bottom-width: 1pt; border-bottom-color: windowtext;" colspan="4" valign="top" width="324">
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: center; font-family: Calibri; font-size: 10.5pt; line-height: 25pt;" align="center"><span style="font-family: 宋体; font-size: 10.5pt;">无</span></p>
</td>
</tr>
</tbody>
</table>
</div>
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri; font-size: 10.5pt;"><span style="font-family: 宋体; font-size: 10.5pt;">代码目录结构截图：</span></p>
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri; font-size: 10.5pt;"><img src="/code.png" width="875" height="720" /><span style="font-size: 10.5pt;">&nbsp;</span></p>
<p class="MsoNormal" style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri; font-size: 10.5pt;"><span style="font-size: 10.5pt;">&nbsp;</span></p>`,
      curSelection: null,
    });
    const rightClick = (event) => {
      const editIframe = document.getElementById("myEditor323_ifr");
      const iframeWindow = editIframe?.contentWindow || null;
      state.curSelection = iframeWindow.getSelection();
      if (!state.curSelection.isCollapsed && !state.tipShow) {
        state.tipShow = true;
        tip.value.style.display = "inline-flex";
        tip.value.style.top = `${event.clientY + 150}px`;
        tip.value.style.left = `${event.clientX}px`;
      } else {
        state.tipShow = false;
        tip.value.style.display = "none";
      }
    };
    const editorLeft = (ev) => {
      state.tipShow = false;
      tip.value.style.display = "none";
      ev.stopPropagation();
    };
    const getMouseMarks = (ev) => {
      let id = ev.target.getAttribute("data-markid");
      if (id) {
        state.currentSelectMarkId = id;
        emit("wordToLineExpress", id);
      }
    };
    onMounted(() => {
      state.content = localStorage.getItem("content")
        ? localStorage.getItem("content")
        : state.content;
      nextTick(() => {
        state.tipShow = false;
        state.curSelection = null;
        state.timer = setInterval(() => {
          console.log(document.readyState);
          if (document.readyState === "complete") {
            const editIframe = document.getElementById("myEditor323_ifr");
            const iframeWindow = editIframe?.contentWindow || null;

            window.clearInterval(state.timer);
            window.selfIframe = editIframe.contentDocument;
            window.selfWindow = iframeWindow;
            iframeWindow.document.body.onclick = (event) => {
              getMouseMarks(event);
            };

            editIframe &&
              editIframe.addEventListener("mousedown", (event) => {
                state.tipShow = false;
                tip.value.style.display = "none";
                iframeWindow.getSelection().removeAllRanges();
                console.log(event.currentTarget);
              });
            webmark.init({
              immediate: true,
              onUrlChange: true,
            });
          }
        }, 1000);
      });
    });
    const menuSelect = (item) => {
      state.tipShow = false;
      if (item.fieldId && item.fieldValue) {
        webmark.remove(item.fieldId);
      }
      state.currentId = window.selfWindow.btoa(
        ""
          .concat(Date.now() * Math.random())
          .concat((Math.random() * 100).toFixed(2))
      );
      item.fieldValue = window.selfWindow.getSelection().toString();
      item.fieldId = state.currentId;
      webmark.mark({
        className: item.classTitle,
        id: state.currentId,
        selection: state.curSelection,
      });
    };
    return {
      fieldList,
      ...toRefs(state),
      tip,
      rightClick,
      editorLeft,
      menuSelect,
      getMouseMarks,
      myEditor,
    };
  },
});
</script>
<style>
.word-box {
  position: relative;
  width: 100%;
  display: flex;
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
</style>
