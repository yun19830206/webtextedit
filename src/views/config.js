//引入主题和图标信息
import 'tinymce/themes/silver/theme.min.js'
import 'tinymce/icons/default/icons'
//引入插件
//https://www.tiny.cloud/docs/plugins
import 'tinymce/plugins/lists' //列表插件
import 'tinymce/plugins/code' //源代码插件
import 'tinymce/plugins/pagebreak'//分页符插件
import 'tinymce/plugins/charmap'//特殊符号插件
import 'tinymce/plugins/save'//保存插件
import 'tinymce/plugins/preview'//预览插件
import 'tinymce/plugins/print'//打印
import 'tinymce/plugins/image'//上传图片插件
import 'tinymce/plugins/media'//视频插件
import 'tinymce/plugins/link'//链接插件
import 'tinymce/plugins/anchor'//锚点插件
import 'tinymce/plugins/codesample'//代码插件
import 'tinymce/plugins/table'//表格插件插件
import 'tinymce/plugins/searchreplace'//查找替换插件
import 'tinymce/plugins/hr'//水平分割线插件
import 'tinymce/plugins/insertdatetime'//时间日期插件
import 'tinymce/plugins/paste'//粘贴插件
import 'tinymce/plugins/wordcount'//字数统计插件
import 'tinymce/plugins/fullscreen'//全屏插件
import 'tinymce/plugins/help'//帮助插件
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/template'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/autosave'
// "searchreplace autolink directionality visualblocks visualchars fullscreen image media template code codesample table charmap  nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave", //插件配置 axupimgs indent2em

export default {
  language_url: '/tinymce/langs/zh_CN.js',
  language: 'zh_CN',
  skin_url: '/tinymce/skins/ui/oxide',
  content_css: '/tinymce/skins/content/default/content.min.css',

}