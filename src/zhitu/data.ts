import type { RiasecScores } from '../app/engine/types';
import type { OccupationSkillReq } from '../app/data/knowledge/schema';

export const SKILLS = [
  { id: 'python', name: 'Python 编程', short: '编程', desc: '变量、函数、数据结构与调试' },
  { id: 'math', name: '数学与统计', short: '数理', desc: '线性代数、概率与统计思维' },
  { id: 'data', name: '数据处理', short: '数据', desc: '清洗、探索和可视化数据' },
  { id: 'ml', name: '机器学习', short: '算法', desc: '特征、训练、验证与误差分析' },
  { id: 'dl', name: '深度学习', short: '深度学习', desc: '神经网络、PyTorch 与迁移学习' },
  { id: 'engineering', name: '工程实践', short: '工程', desc: 'Git、接口、测试与应用部署' },
  { id: 'sql', name: 'SQL 与数据库', short: 'SQL', desc: '查询、聚合与数据建模' },
  { id: 'product', name: '产品与设计', short: '产品', desc: '需求分析、原型与效果指标' },
  { id: 'communication', name: '沟通与表达', short: '表达', desc: '团队协作、文档与成果展示' },
  { id: 'research', name: '研究与阅读', short: '研究', desc: '阅读技术资料并复现实验' },
] as const;
export const LEVELS = ['尚未接触', '了解基础', '能完成练习', '能独立实践', '能指导他人'];
export const DIMENSIONS: { id: keyof RiasecScores; name: string; label: string; desc: string }[] = [
  { id: 'R', name: '实践型', label: '动手实践', desc: '喜欢构建、操作与解决实际问题' },
  { id: 'I', name: '研究型', label: '分析研究', desc: '享受分析规律、提出假设与探索原理' },
  { id: 'A', name: '艺术型', label: '创意设计', desc: '愿意用新的表达和设计创造体验' },
  { id: 'S', name: '社会型', label: '协作助人', desc: '从分享、沟通和帮助他人中获得动力' },
  { id: 'E', name: '企业型', label: '组织推动', desc: '喜欢推动想法、决策与组织团队' },
  { id: 'C', name: '常规型', label: '秩序细节', desc: '擅长梳理信息、遵循流程与保证质量' },
];
// An 18-item, AI-study-context adaptation of CareerCase's RIASEC item IDs.
// This is an exploratory screener, not a validated psychometric inventory.
export const QUESTIONS = [
  ['r1', '亲手组装或调试一个传感器、机器人或智能设备。'],
  ['i1', '分析一份数据，找出别人没有注意到的规律。'],
  ['a1', '为一个 AI 工具设计清晰、有吸引力的界面。'],
  ['s1', '把一个复杂的技术概念讲给刚入门的同学。'],
  ['e1', '向团队介绍一个想法，并争取大家一起实现它。'],
  ['c1', '把零散的数据、笔记或文件整理得井井有条。'],
  ['r2', '把一个课堂算法做成能实际运行的应用。'],
  ['i2', '通过对照实验，解释模型效果为什么发生变化。'],
  ['a2', '尝试不同的表达方式，让技术作品更有创意。'],
  ['s2', '倾听用户遇到的困难，并一起寻找解决方法。'],
  ['e2', '组织小组分工，推动项目按时完成。'],
  ['c2', '逐项检查实验步骤和结果，发现遗漏或错误。'],
  ['r3', '排查软件或硬件的问题，直到它正常工作。'],
  ['i3', '阅读论文或技术资料，弄清一个方法的原理。'],
  ['a3', '构思一种新的 AI 应用场景或交互形式。'],
  ['s3', '参与开源社区，与他人分享知识、协作解决问题。'],
  ['e3', '在多个方案之间权衡价值、成本并作出选择。'],
  ['c3', '按照规范编写文档、维护数据与实验记录。'],
].map(([id, text]) => ({ id, text }));
export const VALUES = [
  { id: 'growth', name: '持续成长', desc: '学习新知识、挑战新的问题' },
  { id: 'impact', name: '实际价值', desc: '让自己的工作帮助真实的人' },
  { id: 'autonomy', name: '自主探索', desc: '拥有选择方法和方向的空间' },
  { id: 'stability', name: '稳定有序', desc: '明确的安排和可预期的环境' },
  { id: 'balance', name: '生活平衡', desc: '保持可持续的工作学习节奏' },
  { id: 'compensation', name: '回报认可', desc: '付出得到合理回报与肯定' },
] as const;

export interface Career {
  id: string; name: string; en: string; code: string; group: string; color: string;
  summary: string; detail: string; tags: string[]; skills: OccupationSkillReq[];
  interests: RiasecScores; values: string[]; project: string; deliverable: string;
  daily: string[]; resources: string[]; stages: [string, string, string, string];
}
const requirements = (items: [string, 1 | 2 | 3 | 4, number][]): OccupationSkillReq[] => items.map(([skillId, requiredProficiency, importance]) => ({ skillId, requiredProficiency, importance }));
export const CAREERS: Career[] = [
  { id: 'llm', name: '大模型应用工程师', en: 'LLM Application Engineer', code: 'LLM', group: '应用工程', color: 'teal',
    summary: '连接模型与真实场景，让 AI 成为好用的产品。', detail: '将语言模型与知识库、工具和应用界面连接，围绕检索质量、回答依据与使用体验构建可评估的应用。', tags: ['RAG', '智能体', '应用开发'],
    skills: requirements([['python',3,1],['engineering',3,1],['data',2,.7],['ml',2,.6],['product',2,.6],['communication',2,.5],['research',2,.7]]),
    interests:{R:65,I:90,A:70,S:50,E:55,C:65}, values:['growth','impact','autonomy'], project:'带引用的课程知识助手', deliverable:'一个能展示来源、处理资料外问题的知识问答应用', daily:['整理知识文档与检索流程','设计提示、工具接口和交互体验','用问题集评估引用准确性与失败案例'], resources:['r6','r7','r8','r12'], stages:['编程与模型基础','检索与知识组织','RAG 应用实践','评估、部署与展示'] },
  { id: 'ml', name: '机器学习工程师', en: 'Machine Learning Engineer', code: 'ML', group: '算法研发', color: 'blue',
    summary: '从数据中发现规律，把算法变成解决问题的方法。', detail: '针对分类、回归与推荐等问题建立可验证的模型，重视数据质量、实验设计和模型在真实输入上的表现。', tags:['模型训练','特征工程','算法评估'],
    skills:requirements([['python',3,1],['math',3,1],['data',3,.9],['ml',3,1],['engineering',2,.6],['research',2,.7]]),
    interests:{R:55,I:95,A:35,S:35,E:35,C:80}, values:['growth','autonomy','stability'], project:'公开数据分类实验台', deliverable:'包含基线比较、混淆矩阵和误差分析的可复现实验', daily:['整理数据与构建特征','训练模型并进行交叉验证','分析模型误差与整理实验记录'], resources:['r1','r2','r3'], stages:['Python 与数理基础','数据与经典算法','模型训练与比较','工程化与项目复盘'] },
  { id:'cv', name:'计算机视觉工程师', en:'Computer Vision Engineer', code:'CV', group:'算法研发', color:'violet',
    summary:'让计算机看懂图像，为现实世界增加一种感知。', detail:'从图像和视频中提取信息，使用图像预处理、神经网络与迁移学习完成视觉识别，并检查不同场景下的误判。', tags:['图像识别','PyTorch','迁移学习'],
    skills:requirements([['python',3,1],['math',3,.8],['data',2,.7],['ml',3,.8],['dl',3,1],['engineering',2,.6],['research',3,.8]]),
    interests:{R:75,I:90,A:65,S:30,E:30,C:60}, values:['growth','autonomy','impact'], project:'校园植物识别器', deliverable:'基于自采或授权图片的分类演示与误判分析', daily:['检查图像数据与标注质量','微调视觉模型与优化训练策略','比较类别表现和推理效果'], resources:['r3','r4','r5'], stages:['图像与张量基础','神经网络与视觉','迁移学习项目','误差分析与部署'] },
  { id:'nlp', name:'自然语言处理工程师', en:'Natural Language Processing', code:'NLP', group:'算法研发', color:'amber',
    summary:'理解语言背后的信息，让文字成为可计算的知识。', detail:'面向文本分类、信息抽取和搜索任务，处理语言数据并评估模型表现，理解传统方法与预训练模型的适用边界。', tags:['文本理解','Transformer','信息抽取'],
    skills:requirements([['python',3,1],['math',2,.7],['data',3,.9],['ml',3,.9],['dl',3,.9],['research',3,.9],['communication',2,.5]]),
    interests:{R:35,I:95,A:70,S:55,E:30,C:65}, values:['growth','autonomy','impact'], project:'课程反馈主题分析器', deliverable:'对匿名示例文本进行分类、主题整理并比较方法', daily:['清洗文本并准备评估数据','训练或适配语言模型','检查分类错误与信息遗漏'], resources:['r2','r3','r6'], stages:['文本与统计基础','表示学习与模型','分类与抽取实践','评估与应用展示'] },
  { id:'data', name:'数据分析师', en:'Data Analyst', code:'DA', group:'数据与产品', color:'cyan',
    summary:'把零散的数据变成清晰的洞察，用证据讲好故事。', detail:'通过查询、清洗、统计和可视化回答明确的问题，并让每一条分析结论都能追溯到数据和合理的指标定义。', tags:['SQL','数据可视化','分析表达'],
    skills:requirements([['python',2,.6],['math',2,.7],['data',3,1],['sql',3,1],['product',2,.6],['communication',3,.9]]),
    interests:{R:30,I:85,A:50,S:60,E:60,C:95}, values:['impact','stability','balance'], project:'校园学习数据看板', deliverable:'使用合成数据的指标字典、交互图表与分析报告', daily:['用 SQL 提取与校验数据','建立指标并制作可视化','向团队解释发现、假设与局限'], resources:['r9','r10','r2'], stages:['统计与数据思维','SQL 与 pandas','分析看板实践','洞察表达与复盘'] },
  { id:'product', name:'AI 产品经理', en:'AI Product Manager', code:'PM', group:'数据与产品', color:'rose',
    summary:'从人的需求出发，找到 AI 能创造价值的位置。', detail:'理解用户问题和 AI 能力边界，设计需求、原型与效果指标，协调团队验证产品是否真正解决了问题。', tags:['需求洞察','原型设计','产品评估'],
    skills:requirements([['product',3,1],['communication',3,1],['data',2,.7],['ml',1,.5],['engineering',1,.4],['research',2,.6]]),
    interests:{R:25,I:60,A:80,S:85,E:95,C:55}, values:['impact','growth','autonomy'], project:'学习助手产品原型', deliverable:'需求文档、交互原型、用户反馈与一次迭代记录', daily:['访谈用户并梳理任务流程','定义 AI 功能边界与成功指标','组织体验测试并推动迭代'], resources:['r11','r12','r1'], stages:['用户与 AI 能力','需求与评价指标','产品原型与验证','反馈迭代与展示'] },
];
export interface Resource {id:string; title:string; provider:string; category:string; language:string; level:string; url:string; description:string}
export const RESOURCES: Resource[] = [
  {id:'r1', title:'机器学习速成课程', provider:'Google Developers', category:'算法基础', language:'中文', level:'入门', url:'https://developers.google.com/machine-learning/crash-course?hl=zh-cn', description:'从回归、分类到模型评估，建立机器学习的基本思维。'},
  {id:'r2', title:'scikit-learn 机器学习入门', provider:'scikit-learn', category:'算法基础', language:'英文', level:'入门', url:'https://scikit-learn.org/stable/getting_started.html', description:'用实际代码理解预处理、模型训练与交叉验证。'},
  {id:'r3', title:'PyTorch 深度学习基础', provider:'PyTorch', category:'深度学习', language:'英文', level:'基础', url:'https://docs.pytorch.org/tutorials/beginner/basics/intro.html', description:'从张量开始，走完数据加载、训练和保存模型的流程。'},
  {id:'r4', title:'视觉迁移学习实战', provider:'PyTorch', category:'深度学习', language:'英文', level:'实践', url:'https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html', description:'基于预训练视觉模型，完成自己的图像分类实验。'},
  {id:'r5', title:'计算机视觉课程', provider:'Hugging Face · 社区课程', category:'深度学习', language:'英文', level:'进阶', url:'https://huggingface.co/learn/computer-vision-course/en/unit0/welcome/welcome', description:'探索视觉模型、数据集与常见计算机视觉任务。'},
  {id:'r6', title:'NLP 与大模型课程', provider:'Hugging Face', category:'大模型应用', language:'中文', level:'基础', url:'https://huggingface.co/learn/llm-course/zh-CN/chapter1/1', description:'理解 Transformer，并学习语言模型的使用与微调。'},
  {id:'r7', title:'AI Agents 课程', provider:'Hugging Face · 社区课程', category:'大模型应用', language:'中文', level:'进阶', url:'https://huggingface.co/learn/agents-course/zh-CN/unit0/introduction', description:'理解智能体、工具调用和可执行的应用流程。'},
  {id:'r8', title:'RAG 检索增强实践', provider:'Hugging Face · 社区教程', category:'大模型应用', language:'英文', level:'实践', url:'https://huggingface.co/learn/cookbook/en/advanced_rag', description:'搭建检索增强生成流程，关注检索与回答评估。'},
  {id:'r9', title:'pandas 数据分析入门', provider:'pandas', category:'数据分析', language:'英文', level:'入门', url:'https://pandas.pydata.org/docs/getting_started/intro_tutorials/', description:'通过表格数据完成读取、筛选、汇总和可视化。'},
  {id:'r10', title:'SQL 查询与数据处理', provider:'Microsoft Learn', category:'数据分析', language:'中文', level:'入门', url:'https://learn.microsoft.com/zh-cn/training/paths/get-started-querying-with-transact-sql/', description:'从 SELECT 开始，练习查询、联接与数据汇总。'},
  {id:'r11', title:'设计可信赖的 AI 产品', provider:'Google PAIR', category:'产品设计', language:'英文', level:'实践', url:'https://codelabs.developers.google.com/codelabs/pair-guidebook', description:'从用户需求、信任和反馈出发，思考人机协作体验。'},
  {id:'r12', title:'负责任 AI 原则与实践', provider:'Microsoft Learn', category:'产品设计', language:'中文', level:'入门', url:'https://learn.microsoft.com/zh-cn/training/modules/embrace-responsible-ai-principles-practices/', description:'认识公平性、可靠性、透明度等 AI 产品设计原则。'},
];
export const TASK_TITLES = ['认识岗位与确定目标','补齐基础与建立仓库','完成方向入门练习','定义项目与成功标准','整理数据或需求证据','构建最小可运行版本','实现项目核心流程','评估错误与失败情况','完成一次明确改进','完善文档与演示体验','收集反馈并修复问题','展示成果与规划下一程'];
export const TASK_DETAILS = ['记录选择这个方向的原因、优势与待补能力。','完成基础练习，创建项目目录并记录运行环境。','学习推荐资料的核心章节，提交一个可运行示例。','写下一页项目计划，说明范围、输入和验收方式。','检查资料来源、数据质量或访谈记录，形成说明文档。','先跑通最简单的流程，保留一个可比较的初始版本。','实现从输入到输出的完整演示，并记录遇到的问题。','设计测试样例，整理误差、失败案例或体验问题。','选择一个重要问题改进，记录前后变化。','补全 README、截图、运行步骤与已知限制。','邀请同学体验，收集反馈并完成一轮修正。','整理作品链接和项目复盘，更新能力自评与下一阶段目标。'];
