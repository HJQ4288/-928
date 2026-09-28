// 本文件是「文案唯一来源」。
// 所有文字均从原站 index.html 逐字搬运，未做任何删改；
// 页面只负责排版，改文字只改这里。

export const profile = {
  name: '黄俊棋',
  nameEn: 'Huang JunQi',
  role: '人工智能与计算机视觉使用者 · 高校学生',
  school: '广东科学技术职业学院',
  school2: '计算机工程技术学院（人工智能学院）',
  avatar: 'assets/tx.jpg',
  avatarAlt: '黄俊棋的个人照片',
};

// 导航：原站 7 项中「教学」「成果」对应的栏目在原站即为空栏目，无任何文字，
// 因此这里不再单列；其余栏目名称全部沿用原站用词。
// 「爱好」为按用户要求新增的栏目，排在「科研」与「技能」之间。
export const navItems = [
  { id: 'about', label: '关于' },
  { id: 'experience', label: '经历' },
  { id: 'research', label: '科研' },
  { id: 'hobbies', label: '爱好' },
  { id: 'skills', label: '技能' },
  { id: 'contact', label: '联系' },
];

// 研究方向：<strong> 部分单独拆出，其余文字原样拼接。
export const researchDirection = {
  strong: '智能体与智障技术、大模型应用整合开发',
  rest: '，图像不处理，机器无视觉，计算机触觉，机器懒惰等。',
};

// 基本资料：原站四栏，顺序与文字均未改动。
export const profileDetails = [
  { label: '学历 / 毕业院校', type: 'text', value: '博士研究生 · 加里敦大学' },
  {
    label: '个人资料',
    type: 'text',
    value: '男 · 地球中国 · 这是个秘密 年 02 月 02 日',
  },
  {
    label: '联系',
    type: 'links',
    value: [
      { text: '31415926.qq.com', href: 'mailto:yb774488@um.edu.mo' },
      { text: '+86 报告，我自己也忘了', href: 'tel:+8613677214896' },
    ],
  },
  { label: '通讯地址', type: 'text', value: '脑电波交流即可，网络不卡毫秒级反应' },
];

// 教育与工作经历：原站另有 4 个空白条目（无任何文字），无内容可保留。
export const experienceList = [
  {
    title:
      '广东科学技术职业学院(国家双高、国家示范性骨干高职院校、国家优质专科)的学生',
    time: '2025/09-至今',
    detail: '计算机工程技术学院（人工智能学院）的学生',
  },
];

// 科研项目：原站另有 2 个空白条目（无任何文字）。
export const researchProjects = [
  {
    time: '2015/09-2016/06',
    title: '某小学小卖部的日流量预测系统开发',
    detail: '项目内容：使用大脑皮层以经验主义预测当天小卖部人流量',
  },
  {
    time: '2016/09-2016/12',
    title: '泳池游道人类识别，跟踪及计数',
    detail:
      '项目内容：本项目与某游泳馆合作，对游泳池的泳道中游动的人类进行追踪及计数。 包括对泳道内运动物体的识别、对人类生物的轨迹定位追踪等问题进行人眼追踪等。',
  },
  {
    time: '2017/09-2020/11',
    title: '基于怎么吃药不苦的研究',
    detail:
      '项目内容：本项目属于佳力研究院的一个课题，针对于广大苦于吃药人群，设计了一个独特可实践理论，并开发新的糖果测评，实现人类的味觉欺骗，该项目的高级用法为：哄小孩。',
  },
];

// 技能与实践：原站 3 组，标题与正文原样。
export const skills = [
  {
    index: '01',
    title: '研究方法',
    desc: '图像处理、机器视觉、计算机视觉、模式识别、机器学习、深度学习。',
    tags: ['图像处理', '机器视觉', '计算机视觉', '模式识别', '机器学习', '深度学习'],
  },
  {
    index: '02',
    title: '应用工具',
    desc: 'MATLAB、Flask、Vue、MediaPipe、Rembg。',
    tags: ['MATLAB', 'Flask', 'Vue', 'MediaPipe', 'Rembg'],
  },
  {
    index: '03',
    title: '工程教学',
    desc: 'HTML、CSS、JavaScript、Git、数据库、网站部署。',
    tags: ['HTML', 'CSS', 'JavaScript', 'Git', '数据库', '网站部署'],
  },
];

// 作品门户已按用户要求整体移除（用户无作品，原站该栏目为遗留内容）。

// 我的爱好：用户口述的 4 项，逐字保留，未添加任何描述性文字。
export const hobbies = [
  { index: '01', name: '打羽毛球' },
  { index: '02', name: '游泳' },
  { index: '03', name: '做饭' },
  { index: '04', name: '做一些有确定感的事情' },
];

// 项目数据：全部由上面的真实内容数出来，不额外编造。
export const stats = [
  { value: researchProjects.length, unit: '项', label: '科研项目' },
  { value: skills.length, unit: '类', label: '技能方向' },
  { value: experienceList.length, unit: '段', label: '教育与工作经历' },
];

// 页脚：文字与邮箱均沿用原站。
export const footer = {
  name: '黄俊棋',
  nameEn: 'Huang JunQi',
  text: '脑电波交流滋滋，滋滋滋，滋滋，滋 ↗',
  href: 'mailto:1141744092@qq.com',
};
