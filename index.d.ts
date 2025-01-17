declare class FriendItem {
  // 名称
  siteName: string;
  // 网站链接
  siteLink: string;
  // 头像
  siteLogo: string;
  // 描述
  description: string;
}

declare class TalkItem {
  // 标签
  author: string;
  // 发布时间
  time: string;
  // 说说内容
  text: string;
  // 配图
  img: string;
}

declare class IconItem {
  // 菜单栏名称, 对应菜单名称
  menuName: string;
  // 图标(外链), 使用默认值 / 或填写图标外链
  iconUrl: string;
}

declare class Fog {
  // 菜单栏布局
  menuPosition: 'top' | 'left';
  // 文章列表风格
  postListMode: 'default' | 'elegant';
  // 网站名称颜色 默认：antiquewhite
  siteNameColor: string;
  // 网站描述颜色 默认：white
  siteDescriptionColor: string;
  // 网站菜单按钮颜色 默认：antiquewhite
  siteMenuColor: string;
  //文章标题颜色 默认：white
  titleColor: string;
  //底部信息颜色（默认:white）
  footInfoColor: string;
  // 站点名称字体
  siteNameFont: string;
  // 站点介绍字体
  siteDescriptionFont: string;
  // 文章标题字体
  titleFont: string;
  // 菜单栏字体
  siteMenuFont: string;
  // 文章正文字体
  postFont: string;
  // 是否开启站点创建时间
  siteGoTimeChoice: boolean;
  //输入日期（格式:2020/22/02）
  siteGoTime: string;
  // 是否开启访客统计, 不蒜子会影响网页加载速度，请慎重考虑
  siteNumChoice: boolean;
  // 访客统计URL
  siteNumUrl: string;
  // 是否开启文章阅读量统计, 需要在配置页面填写Leancloud_id和key值
  postNumChoice: boolean;
  // 文章阅读量统计URL
  postNumUrl: string;
  //填写网站备案号，如无则空着即可
  recordText: string;
  // 是否开启文章分享转载功能
  shareChoice: boolean;
  // 是否开启文章赞赏功能, 请在下方放置赞赏图片外链
  donateChoice: boolean;
  //请输入图片外链
  donateImg: string;
  //社交按钮开关, 是否开启个人社交信息展示栏
  socialChoice: 'default' | 'close';
  //社交按钮上的文字显示
  socialText: string;
  //链接地址
  github: string;
  //QQ号
  QQ: string;
  //链接地址
  zhihu: string;
  //链接地址
  bilibili: string;
  //链接地址
  wechat: string;
  //链接地址
  weibo: string;
  //链接地址
  wyy: string;
  //链接地址
  steam: string;
  //图片加载方式, 选择本地上传便在下方选项添加图片，选择外链则在下方输入框输入外链链接【推荐使用外链】
  bgChoice: 'default' | 'link';
  // 背景虚化图-外链
  bgImageLink: string;
  // 移动端背景图-外链
  mobileBgImageLink: string;
  // 文章封面默认背景图-外链
  postDefaultLink: string;
  // 全局背景虚化图
  bgImage: string;
  // 移动端背景图
  mobileBgImage: string;
  // 文章封面默认背景图
  postDefaultImage: string;
  //代码主题
  codeTheme: string;
  //是否开启数学公式, 开启后支持数学公式（影响博客加载速度）
  mathChoice: boolean;
  
  
  // 是否开启看板娘
  live2d: boolean;
  //第三方评论系统选择
  commentChoice: 'default' | 'valine' | 'twikoo';
  //[valine/阅读量统计] Leancloud_appId
  Leancloud_appId: string;
  //[valine/阅读量统计] Leancloud_key
  Leancloud_key: string;
  //[twikoo] 配置查看文档 https://twikoo.js.org/
  twikooId: string;
  //是否开启哔哔, [丰富版说说系统]配置查看文档
  bbchoice: boolean;
  //哔哔-昵称
  bbname: string;
  //请输入头像外链【可以填写自己站点头像地址】
  bbavatar: string;
  //哔哔-每次加载的数目，默认值：5
  bblimit: number;
  //哔哔-加载时gif动画（请输入外链），默认：https://7.dusays.com/2021/03/04/d2d5e983e2961.gif
  bbgif: string;
  //是否开启哔哔-ontalk, 首页轮播哔哔消息
  bbonetalkchoice: boolean;
  //首页轮播哔哔消息时配置
  bbjson: string;
  
  
  //是否开启友链
  friendsChoice: boolean;
  //提示信息
  friendsRule: string;
  //友链
  friends: Array<FriendItem>;
  //是否开启说说
  talkChoice: boolean;
  //说说
  talks: Array<TalkItem>;
  //图标icon, 默认值：Home / Archive / Tag / About / Talk / Friends (填写时删除空格)
  icons: Array<IconItem>;
  
  
  //是否开启音乐播放器
  aplayerChoice: boolean;
  // 音乐播放器的源平台
  aplayerServer: 'netease' | 'tencent' | 'kugou' | 'xiami' | 'baidu';
  // 音乐播放器的歌单ID
  aplayerId: string;
  // 音乐播放器的播放模式
  aplayerOrder: 'default' | 'random';
  // 音乐播放器是否自动播放
  aplayerAutoplay: boolean;
  
  
  // 即时通讯工具
  instantchoice: 'default' | 'daovoice' | 'crisp';
  //[使用daovoice时配置]在控制台-安装到网站-appid里的内容复制过来
  daovoice_id: string;
  //[使用Crisp时配置] 在设置-网站设置-网站id里的内容复制过来
  crisp_id: string;
}


/* 代码主题
1c-light
1c-light-min
a11y-dark
a11y-dark-min
a11y-light
a11y-light-min
agate
agate-min
an-old-hope
an-old-hope-min
androidstudio
androidstudio-min
arduino-light
arduino-light-min
arta
arta-min
ascetic
ascetic-min
atom-one-dark-reasonable
atom-one-dark-reasonable-min
atom-one-dark
atom-one-dark-min
atom-one-light
atom-one-light-min
base16-3024
base16-3024-min
base16-apathy
base16-apathy-min
base16-apprentice
base16-apprentice-min
base16-ashes
base16-ashes-min
base16-atelier-cave-light
base16-atelier-cave-light-min
base16-atelier-cave
base16-atelier-cave-min
base16-atelier-dune-light
base16-atelier-dune-light-min
base16-atelier-dune
base16-atelier-dune-min
base16-atelier-estuary-light
base16-atelier-estuary-light-min
base16-atelier-estuary
base16-atelier-estuary-min
base16-atelier-forest-light
base16-atelier-forest-light-min
base16-atelier-forest
base16-atelier-forest-min
base16-atelier-heath-light
base16-atelier-heath-light-min
base16-atelier-heath
base16-atelier-heath-min
base16-atelier-lakeside-light
base16-atelier-lakeside-light-min
base16-atelier-lakeside
base16-atelier-lakeside-min
base16-atelier-plateau-light
base16-atelier-plateau-light-min
base16-atelier-plateau
base16-atelier-plateau-min
base16-atelier-savanna-light
base16-atelier-savanna-light-min
base16-atelier-savanna
base16-atelier-savanna-min
base16-atelier-seaside-light
base16-atelier-seaside-light-min
base16-atelier-seaside
base16-atelier-seaside-min
base16-atelier-sulphurpool-light
base16-atelier-sulphurpool-light-min
base16-atelier-sulphurpool
base16-atelier-sulphurpool-min
base16-atlas
base16-atlas-min
base16-bespin
base16-bespin-min
base16-black-metal-bathory
base16-black-metal-bathory-min
base16-black-metal-burzum
base16-black-metal-burzum-min
base16-black-metal-dark-funeral
base16-black-metal-dark-funeral-min
base16-black-metal-gorgoroth
base16-black-metal-gorgoroth-min
base16-black-metal-immortal
base16-black-metal-immortal-min
base16-black-metal-khold
base16-black-metal-khold-min
base16-black-metal-marduk
base16-black-metal-marduk-min
base16-black-metal-mayhem
base16-black-metal-mayhem-min
base16-black-metal-nile
base16-black-metal-nile-min
base16-black-metal-venom
base16-black-metal-venom-min
base16-black-metal
base16-black-metal-min
base16-brewer
base16-brewer-min
base16-bright
base16-bright-min
base16-brogrammer
base16-brogrammer-min
base16-brush-trees-dark
base16-brush-trees-dark-min
base16-brush-trees
base16-brush-trees-min
base16-chalk
base16-chalk-min
base16-circus
base16-circus-min
base16-classic-dark
base16-classic-dark-min
base16-classic-light
base16-classic-light-min
base16-codeschool
base16-codeschool-min
base16-colors
base16-colors-min
base16-cupcake
base16-cupcake-min
base16-cupertino
base16-cupertino-min
base16-danqing
base16-danqing-min
base16-darcula
base16-darcula-min
base16-dark-violet
base16-dark-violet-min
base16-darkmoss
base16-darkmoss-min
base16-darktooth
base16-darktooth-min
base16-decaf
base16-decaf-min
base16-default-dark
base16-default-dark-min
base16-default-light
base16-default-light-min
base16-dirtysea
base16-dirtysea-min
base16-dracula
base16-dracula-min
base16-edge-dark
base16-edge-dark-min
base16-edge-light
base16-edge-light-min
base16-eighties
base16-eighties-min
base16-embers
base16-embers-min
base16-equilibrium-dark
base16-equilibrium-dark-min
base16-equilibrium-gray-dark
base16-equilibrium-gray-dark-min
base16-equilibrium-gray-light
base16-equilibrium-gray-light-min
base16-equilibrium-light
base16-equilibrium-light-min
base16-espresso
base16-espresso-min
base16-eva-dim
base16-eva-dim-min
base16-eva
base16-eva-min
base16-flat
base16-flat-min
base16-framer
base16-framer-min
base16-fruit-soda
base16-fruit-soda-min
base16-gigavolt
base16-gigavolt-min
base16-github
base16-github-min
base16-google-dark
base16-google-dark-min
base16-google-light
base16-google-light-min
base16-grayscale-dark
base16-grayscale-dark-min
base16-grayscale-light
base16-grayscale-light-min
base16-green-screen
base16-green-screen-min
base16-gruvbox-dark-hard
base16-gruvbox-dark-hard-min
base16-gruvbox-dark-medium
base16-gruvbox-dark-medium-min
base16-gruvbox-dark-pale
base16-gruvbox-dark-pale-min
base16-gruvbox-dark-soft
base16-gruvbox-dark-soft-min
base16-gruvbox-light-hard
base16-gruvbox-light-hard-min
base16-gruvbox-light-medium
base16-gruvbox-light-medium-min
base16-gruvbox-light-soft
base16-gruvbox-light-soft-min
base16-hardcore
base16-hardcore-min
base16-harmonic16-dark
base16-harmonic16-dark-min
base16-harmonic16-light
base16-harmonic16-light-min
base16-heetch-dark
base16-heetch-dark-min
base16-heetch-light
base16-heetch-light-min
base16-helios
base16-helios-min
base16-hopscotch
base16-hopscotch-min
base16-horizon-dark
base16-horizon-dark-min
base16-horizon-light
base16-horizon-light-min
base16-humanoid-dark
base16-humanoid-dark-min
base16-humanoid-light
base16-humanoid-light-min
base16-ia-dark
base16-ia-dark-min
base16-ia-light
base16-ia-light-min
base16-icy-dark
base16-icy-dark-min
base16-ir-black
base16-ir-black-min
base16-isotope
base16-isotope-min
base16-kimber
base16-kimber-min
base16-london-tube
base16-london-tube-min
base16-macintosh
base16-macintosh-min
base16-marrakesh
base16-marrakesh-min
base16-materia
base16-materia-min
base16-material-darker
base16-material-darker-min
base16-material-lighter
base16-material-lighter-min
base16-material-palenight
base16-material-palenight-min
base16-material-vivid
base16-material-vivid-min
base16-material
base16-material-min
base16-mellow-purple
base16-mellow-purple-min
base16-mexico-light
base16-mexico-light-min
base16-mocha
base16-mocha-min
base16-monokai
base16-monokai-min
base16-nebula
base16-nebula-min
base16-nord
base16-nord-min
base16-nova
base16-nova-min
base16-ocean
base16-ocean-min
base16-oceanicnext
base16-oceanicnext-min
base16-one-light
base16-one-light-min
base16-onedark
base16-onedark-min
base16-outrun-dark
base16-outrun-dark-min
base16-papercolor-dark
base16-papercolor-dark-min
base16-papercolor-light
base16-papercolor-light-min
base16-paraiso
base16-paraiso-min
base16-pasque
base16-pasque-min
base16-phd
base16-phd-min
base16-pico
base16-pico-min
base16-pop
base16-pop-min
base16-porple
base16-porple-min
base16-qualia
base16-qualia-min
base16-railscasts
base16-railscasts-min
base16-rebecca
base16-rebecca-min
base16-ros-pine-dawn
base16-ros-pine-dawn-min
base16-ros-pine-moon
base16-ros-pine-moon-min
base16-ros-pine
base16-ros-pine-min
base16-sagelight
base16-sagelight-min
base16-sandcastle
base16-sandcastle-min
base16-seti-ui
base16-seti-ui-min
base16-shapeshifter
base16-shapeshifter-min
base16-silk-dark
base16-silk-dark-min
base16-silk-light
base16-silk-light-min
base16-snazzy
base16-snazzy-min
base16-solar-flare-light
base16-solar-flare-light-min
base16-solar-flare
base16-solar-flare-min
base16-solarized-dark
base16-solarized-dark-min
base16-solarized-light
base16-solarized-light-min
base16-spacemacs
base16-spacemacs-min
base16-summercamp
base16-summercamp-min
base16-summerfruit-dark
base16-summerfruit-dark-min
base16-summerfruit-light
base16-summerfruit-light-min
base16-synth-midnight-terminal-dark
base16-synth-midnight-terminal-dark-min
base16-synth-midnight-terminal-light
base16-synth-midnight-terminal-light-min
base16-tango
base16-tango-min
base16-tender
base16-tender-min
base16-tomorrow-night
base16-tomorrow-night-min
base16-tomorrow
base16-tomorrow-min
base16-twilight
base16-twilight-min
base16-unikitty-dark
base16-unikitty-dark-min
base16-unikitty-light
base16-unikitty-light-min
base16-vulcan
base16-vulcan-min
base16-windows-10-light
base16-windows-10-light-min
base16-windows-10
base16-windows-10-min
base16-windows-95-light
base16-windows-95-light-min
base16-windows-95
base16-windows-95-min
base16-windows-high-contrast-light
base16-windows-high-contrast-light-min
base16-windows-high-contrast
base16-windows-high-contrast-min
base16-windows-nt-light
base16-windows-nt-light-min
base16-windows-nt
base16-windows-nt-min
base16-woodland
base16-woodland-min
base16-xcode-dusk
base16-xcode-dusk-min
base16-zenburn
base16-zenburn-min
brown-paper
brown-paper-min
codepen-embed
codepen-embed-min
color-brewer
color-brewer-min
dark
dark-min
default
default-min
devibeans
devibeans-min
docco
docco-min
far
far-min
felipec
felipec-min
foundation
foundation-min
github-dark-dimmed
github-dark-dimmed-min
github-dark
github-dark-min
github
github-min
gml
gml-min
googlecode
googlecode-min
gradient-dark
gradient-dark-min
gradient-light
gradient-light-min
grayscale
grayscale-min
hybrid
hybrid-min
idea
idea-min
intellij-light
intellij-light-min
ir-black
ir-black-min
isbl-editor-dark
isbl-editor-dark-min
isbl-editor-light
isbl-editor-light-min
kimbie-dark
kimbie-dark-min
kimbie-light
kimbie-light-min
lightfair
lightfair-min
lioshi
lioshi-min
magula
magula-min
mono-blue
mono-blue-min
monokai-sublime
monokai-sublime-min
monokai
monokai-min
night-owl
night-owl-min
nnfx-dark
nnfx-dark-min
nnfx-light
nnfx-light-min
nord
nord-min
obsidian
obsidian-min
panda-syntax-dark
panda-syntax-dark-min
panda-syntax-light
panda-syntax-light-min
paraiso-dark
paraiso-dark-min
paraiso-light
paraiso-light-min
pojoaque
pojoaque-min
purebasic
purebasic-min
qtcreator-dark
qtcreator-dark-min
qtcreator-light
qtcreator-light-min
rainbow
rainbow-min
routeros
routeros-min
school-book
school-book-min
shades-of-purple
shades-of-purple-min
srcery
srcery-min
stackoverflow-dark
stackoverflow-dark-min
stackoverflow-light
stackoverflow-light-min
sunburst
sunburst-min
tokyo-night-dark
tokyo-night-dark-min
tokyo-night-light
tokyo-night-light-min
tomorrow-night-blue
tomorrow-night-blue-min
tomorrow-night-bright
tomorrow-night-bright-min
vs
vs-min
vs2015
vs2015-min
xcode
xcode-min
xt256
xt256-min
*/