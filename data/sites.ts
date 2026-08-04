import type {
  CoordinateRecord,
  CoordinateTarget,
  SiteRecord,
} from "../lib/content/types";
import {
  AMAP_GEOCODER_SOURCE_ID,
  DESIGN_SPEC_SOURCE_ID,
  PROJECT_SCOPE_SOURCE_ID,
} from "./sources";

const directorySource = "source-beijing-red-tourism-directory";
const coordinateVerifiedAt = "2026-07-29";

function verifiedCoordinate(
  lng: number,
  lat: number,
  target: CoordinateTarget,
  precision: Extract<
    CoordinateRecord,
    { status: "verified" }
  >["precision"] = "verified-poi",
): Extract<CoordinateRecord, { status: "verified" }> {
  return {
    status: "verified",
    lat,
    lng,
    crs: "GCJ-02",
    target,
    precision,
    sourceId: AMAP_GEOCODER_SOURCE_ID,
    verifiedAt: coordinateVerifiedAt,
    verifiedBy: "project-owner",
  };
}

export const sites: readonly SiteRecord[] = [
  {
    id: "beida-honglou",
    slug: "beida-honglou",
    routeId: "awakening",
    order: 1,
    name: {
      value: "北大红楼",
      sourceIds: [
        PROJECT_SCOPE_SOURCE_ID,
        directorySource,
        "source-beida-honglou-beijing-gov",
      ],
    },
    officialAddress: {
      value: "北京市东城区五四大街29号",
      sourceIds: ["source-beida-honglou-beijing-gov"],
    },
    coordinateTarget: "main-entrance",
    coordinate: verifiedCoordinate(
      116.40534,
      39.924634,
      "main-entrance",
    ),
    historySummary: [],
    practiceSummary: [],
    assetIds: ["field-01"],
    reviewStatus: "draft",
    publicationStatus: "planned",
    detailContent: [
      {
        id: "beida-honglou-detail",
        text: "【建馆背景】北大红楼始建于1916年9月，发起者是时任校长胡仁源和预科学长徐崇钦。当时预科学生宿舍严重不足，学生多侨居在外漫无约束，校方遂向比利时仪品公司借款22万大洋，计划建造一栋学生宿舍楼。1916年12月，蔡元培被任命为北大校长。随着他大刀阔斧的改革和学校规模扩大，全校学生增至2000余人，校舍更为紧张。1918年3月，学校决定将这座在建大楼改为教学办公用房，作为文科教室、研究所、图书馆及校部机关所在地，称为“北大第一院”。1918年8月，大楼正式竣工。建筑通体红砖砌筑、红瓦铺顶，平面呈工字形，地上四层、半地下一层。因全楼红砖红瓦，故俗称“红楼”。大楼建筑面积约1万平方米，融合西洋古典风格与中国传统元素，是当年北京城最具现代气息的建筑之一。\n\n【新文化运动的大本营】蔡元培提出“思想自由，兼容并包”的办学方针，陈独秀、李大钊、鲁迅、胡适等新文化运动主将汇聚于此。1918年12月，陈独秀与李大钊在红楼创办《每周评论》。红楼地下室印刷厂印制了《新青年》《新潮》等进步刊物，民主与科学的旗帜在这里高高飘扬。\n\n【五四运动的策源地】1919年5月3日，巴黎和会中国外交失败的消息传来，北大学生在红楼连夜起草《北京全体学界通告》，赶制旗帜标语。5月4日下午，北大学生从红楼北面操场集合出发，与北京十余所学校三千余人齐集天安门前游行示威，“外争主权、内除国贼”的口号响彻云霄。\n\n【马克思主义传播的中心】李大钊任北大图书馆主任期间，将红楼一层图书馆办成传播马克思主义的阵地。1920年3月，他指导邓中夏、高君宇等成立马克思学说研究会。毛泽东1918年10月至1919年3月在红楼二层第二阅览室任助理员，在此接受马克思主义。\n\n【中国共产党的重要发祥地】1920年10月，北京共产党早期组织“共产党小组”在红楼图书馆主任室成立，李大钊任书记。中共一大召开时全国50多名党员中，大部分曾在北大红楼工作或学习过。\n\n1961年，北大红楼被列为全国重点文物保护单位。如今，这座百年红楼作为中国共产党早期北京革命活动纪念馆，静静伫立在五四大街，无声诉说着那段波澜壮阔的历史。",
        sourceIds: [PROJECT_SCOPE_SOURCE_ID, DESIGN_SPEC_SOURCE_ID],
      },
    ],
    galleryAssetIds: [
      "beida-honglou-01", "beida-honglou-02", "beida-honglou-03", "beida-honglou-04", "beida-honglou-05", "beida-honglou-06", "beida-honglou-07", "beida-honglou-08", "beida-honglou-09", "beida-honglou-10", "beida-honglou-11",
    ],
  },
  {
    id: "new-youth-editorial-office",
    slug: "new-youth-editorial-office",
    routeId: "awakening",
    order: 2,
    name: {
      value: "《新青年》编辑部旧址",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID],
    },
    officialAddress: {
      value: "北京市东城区北池子大街箭杆胡同20号",
      sourceIds: ["source-beijing-red-tourism-directory"],
    },
    coordinateTarget: "main-entrance",
    coordinate: verifiedCoordinate(
      116.404106,
      39.917353,
      "main-entrance",
    ),
    historySummary: [],
    practiceSummary: [],
    assetIds: [],
    reviewStatus: "draft",
    publicationStatus: "planned",
    detailContent: [
      {
        id: "new-youth-editorial-office-detail",
        text: "《新青年》编辑部旧址相关资料\n一、基础信息\n全称：《新青年》编辑部旧址（陈独秀旧居）\n地址：北京市东城区北池子大街箭杆胡同20号（旧门牌为箭杆胡同9号）\n旧址性质：陈独秀1917年至1920年在北京的居所，也是《新青年》编辑部在北京时期的重要办公、议事地点。\n保护利用：2001年公布为北京市文物保护单位；2021年作为“北大红楼与中国共产党早期北京革命活动旧址”组成部分对外开放。\n建筑概况\n旧址原为一座清代四合院私宅，建筑面积约189平方米。院内现存北房三间、南房三间以及靠街门的一间倒座小房，空间并不宽阔。北房在当年主要承担编辑部功能，南房为陈独秀及家人居住之处。今天北房设置“历史上的《新青年》”专题展，南房设置“陈独秀在北京”专题展。居住空间与编辑空间同处一院，是理解这处旧址的第一把钥匙：当时许多影响全国的思想活动，最初就是在普通住宅、学校办公室与小型印刷传播网络中展开的。\n二、历史背景\n1. 从上海创刊到迁入北京\n1915年9月15日，陈独秀在上海创办《青年杂志》，并在创刊号发表《敬告青年》。1916年9月出版第二卷第一号时，刊物改名为《新青年》。1917年1月，陈独秀受蔡元培聘请出任北京大学文科学长，北上后租住箭杆胡同院落，《新青年》编辑部也随之由上海迁到北京。刊物与北京大学新派学人由此形成密切联系，“一刊一校”相互激荡，箭杆胡同小院逐渐成为新文化运动的重要思想节点。\n2. 从个人主编到同人刊物\n从1918年1月出版的第四卷第一号起，《新青年》由陈独秀个人主编改为同人刊物。李大钊、胡适、钱玄同、刘半农、高一涵、沈尹默、鲁迅等先后参与编辑或撰稿。编辑部同人在此讨论选题、组织稿件，围绕伦理、文学、教育、妇女、科学与社会改造展开争论。1918年5月，鲁迅的《狂人日记》刊于第四卷第五号；同年，李大钊陆续发表介绍俄国十月革命及其世界意义的文章。杂志不再只是一本刊物，而成为连接作者、读者、学校、社团和社会运动的公共平台。\n三、思想转向与历史进程\n1. 新文化运动的“编辑中枢”\n《新青年》早期最鲜明的任务，是反思辛亥革命以后社会变革未能深入的原因，并把目光转向人的思想、伦理与知识结构。它倡导民主与科学，推动白话文和文学革命，批判封建礼教及盲从、守旧的社会心理。许多后来被视为现代中国思想史标志的文章，并非孤立出现，而是在杂志持续组稿、互相回应和公开论争中形成。箭杆胡同旧址所见证的，正是“编辑”如何成为一种组织思想和塑造公共议题的实践。\n2. 马克思主义早期传播的重要平台\n俄国十月革命后，李大钊在《新青年》发表《法俄革命之比较观》《庶民的胜利》《Bolshevism的胜利》等文章。1919年，第六卷第五、六号刊载《我的马克思主义观》，较为系统地介绍马克思主义学说。杂志的思想重心由文化启蒙逐渐扩展到社会革命、劳工问题与马克思主义研究，一批被新文化运动唤醒的青年也开始寻求更具组织性和实践性的救国道路。\n3. 北京阶段的结束与刊物后续\n1920年2月，陈独秀为躲避北洋军阀政府迫害离开北京赴上海，《新青年》编辑部随之迁回上海。同年9月以后，《新青年》成为上海共产党早期组织的机关刊物；1923年又成为中共中央机关理论刊物，直至1926年停刊。因此，箭杆胡同旧址对应的是《新青年》的北京编辑时期及其新文化运动、五四运动和马克思主义早期传播阶段；刊物后来作为党组织刊物的发展，则发生在编辑部迁沪之后。两段历史彼此连续，但不应在空间上混为一处。\n四、历史意义\n（一）思想史意义\n这里见证了现代中国一批知识分子对“人如何获得独立人格、国家如何走向新生、社会如何实现根本改造”的集中追问。民主、科学、白话文学、妇女解放、劳工与社会主义等议题在同一刊物中交汇，反映出近代思想从文化启蒙走向社会革命的复杂过程。\n（二）传播史意义\n《新青年》把分散的作者、读者与社团组织成跨地域的思想网络。狭小院落与全国影响之间的强烈反差说明，现代公共舆论的力量不取决于场所是否宏大，而取决于编辑、印刷、发行、阅读和讨论能否形成连续链条。\n（三）革命史意义\n《新青年》推动马克思主义在中国的早期传播，并对五四时期青年产生广泛影响。许多受到刊物启发的青年后来转向马克思主义和有组织的革命实践。旧址因而成为理解新文化运动、五四运动与中国共产党创建之间思想联系的重要地点。",
        sourceIds: [PROJECT_SCOPE_SOURCE_ID, DESIGN_SPEC_SOURCE_ID],
      },
    ],
    galleryAssetIds: [
      "new-youth-editorial-01", "new-youth-editorial-02", "new-youth-editorial-03", "new-youth-editorial-04", "new-youth-editorial-05", "new-youth-editorial-06", "new-youth-editorial-07", "new-youth-editorial-08", "new-youth-editorial-09", "new-youth-editorial-10",
    ],
  },
  {
    id: "li-dazhao-residence",
    slug: "li-dazhao-residence",
    routeId: "awakening",
    order: 3,
    name: {
      value: "李大钊故居",
      sourceIds: [
        PROJECT_SCOPE_SOURCE_ID,
        directorySource,
        "source-li-dazhao-residence-beijing-heritage",
      ],
    },
    officialAddress: {
      value: "北京市西城区文华胡同24号",
      sourceIds: ["source-li-dazhao-residence-beijing-heritage"],
    },
    coordinateTarget: "main-entrance",
    coordinate: verifiedCoordinate(
      116.365919,
      39.904855,
      "main-entrance",
    ),
    historySummary: [],
    practiceSummary: [],
    assetIds: [],
    reviewStatus: "draft",
    publicationStatus: "planned",
    detailContent: [
      {
        id: "li-dazhao-residence-detail",
        text: "一、基础信息\n全称：北京李大钊故居\n地址：北京市西城区文华胡同24号（旧址为石驸马大街后宅35号北院）\n居住时间：1920年春至1924年1月，是李大钊在故乡河北乐亭之外与家人共同生活时间最长的一处住所。\n保护利用：1979年公布为北京市文物保护单位；2007年正式对社会开放。\n建筑概况\n故居是一座占地约550平方米的小三合院，院门开在北墙。有北房三间，东、西耳房各两间，东、西厢房各三间。北房东屋为李大钊与夫人赵纫兰的卧室，东耳房为长女李星华的卧室，东厢房有长子李葆华的卧室和客房，西厢房则是李大钊的书房。院落规模普通，陈设简朴，却同时承担家庭生活、读书写作、接待青年和革命联络等多重功能。\n二、历史背景\n1. 从新文化运动先驱到马克思主义传播者\n李大钊1916年回国后在北京工作，投身新文化运动。1918年任北京大学图书馆主任后，他利用报刊、讲演、课程和图书馆资源介绍俄国十月革命与马克思主义，并与陈独秀等共同推动《新青年》《每周评论》等刊物。1920年春入住此处时，他已成为中国传播马克思主义最有影响力的先驱之一。此后的四年，也是他的理论研究、建党活动和北方革命工作迅速展开的时期。\n2. 建党活动与北方革命工作的展开\n1920年，李大钊发起成立北京共产党早期组织，积极推动马克思学说研究和工人运动。中国共产党成立后，他代表中共中央指导北方地区工作。中共北方党组织的一些重要会议曾在故居西厢房书房召开，许多青年学生、进步人士和革命者也来此商谈、求教或暂住。这个家庭院落由此成为学校与社会、理论与组织之间的一个联结点。\n3. 统一战线与更广阔的政治实践\n在此居住期间，李大钊还参与推动建立国民革命统一战线，促成第一次国共合作，并持续领导北方工人、学生和民众运动。他的工作已不限于著书立说，而是把马克思主义研究转化为政党建设、群众组织和现实政治行动。1924年1月前后，他离开文华胡同寓所，随后赴广州参加中国国民党第一次全国代表大会。故居所对应的，正是他由思想传播者进一步成为职业革命组织者的重要阶段。\n三、家庭空间中的革命生活\n李大钊身为北京大学教授和图书馆主任，却长期租住在普通院落中，生活俭朴。故居既保留了夫妇卧室、子女房间和日常生活陈设，也保存了书房、会客和会议空间的历史记忆。许多青年在这里得到帮助和教诲，家庭成员也在长期耳濡目染中走上革命道路。与大型会议会址相比，这处小院更能说明早期革命并非只发生在公开集会和宏大场面中，也存在于写作、阅读、接待、照料、掩护与日常关系之中。\n四、历史意义\n（一）马克思主义中国化早期探索的见证\n李大钊并非停留在译介概念，而是努力把马克思主义同中国的社会现实、劳工问题和革命任务联系起来。故居时期的研究、讲演与组织实践，体现了先进理论由文本进入现实的过程。\n（二）中国共产党创建与北方党组织活动的见证\n1920—1924年间，李大钊参与创建中国共产党并领导北方革命工作。书房中的会谈和会议，使一处普通住宅成为早期党组织网络中的重要节点。这里的价值不只在于“名人曾居住”，更在于它承载了组织关系的形成和延续。\n（三）革命者人格与家国关系的见证\n故居把李大钊作为思想家、革命家、教师、丈夫与父亲的多重身份放在同一空间中。它提醒参观者：历史人物并非抽象符号，宏大理想要通过具体生活承担代价，也要依靠家庭、友人和青年群体的支持。\n五、两处旧址如何合读\n《新青年》编辑部旧址更侧重展示思想怎样经由编辑、刊物和公开论争形成社会影响；李大钊故居则更侧重展示思想怎样进入研究、建党、组织和群众工作。前者可概括为“文字成为公共力量”，后者可概括为“理论转化为组织行动”。两处旧址共同说明，中国共产党创建并非突然发生，而是在新文化运动、五四运动、马克思主义传播、青年觉醒和早期组织实践的连续演变中逐步形成。",
        sourceIds: [PROJECT_SCOPE_SOURCE_ID, DESIGN_SPEC_SOURCE_ID],
      },
    ],
    galleryAssetIds: [
      "li-dazhao-01", "li-dazhao-02", "li-dazhao-03", "li-dazhao-04", "li-dazhao-05", "li-dazhao-06", "li-dazhao-07", "li-dazhao-08", "li-dazhao-09", "li-dazhao-10", "li-dazhao-11", "li-dazhao-12",
    ],
  },
  {
    id: "jingbao-hall",
    slug: "jingbao-hall",
    routeId: "awakening",
    order: 4,
    name: {
      value: "京报馆旧址",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID, directorySource],
    },
    officialAddress: {
      value: "北京市西城区椿树街道魏染胡同30号、32号",
      sourceIds: ["source-beijing-red-tourism-directory"],
    },
    coordinateTarget: "main-entrance",
    coordinate: verifiedCoordinate(
      116.380723,
      39.891063,
      "main-entrance",
    ),
    historySummary: [],
    practiceSummary: [],
    assetIds: [],
    reviewStatus: "draft",
    publicationStatus: "planned",
    detailContent: [
      {
        id: "jingbao-hall-detail",
        text: "京报馆相关资料\n一、基础信息\n全称：京报馆旧址（邵飘萍故居）\n地址：北京市西城区椿树街道魏染胡同30号、32号\n建筑概况\n占地面积1120㎡，建筑面积约820㎡，1925年10月落成。由邵飘萍挚友吴定九设计，中西合璧二层临街小楼+两座四合院。30号为报馆办公地，门楣“京报馆”三字为邵飘萍亲笔题写；32号是邵飘萍一家居所。\n二、历史背景\n1. 《京报》诞生与迁徙\n1918年10月5日，邵飘萍创办进步报纸《京报》，发刊词立下宗旨：必使政府听命于正当民意之前。 于1925年迁入魏染胡同现址，是民国时期中国北方唯一拥有自建馆舍的报社。邵飘萍目睹民生困苦、强权当道，立志新闻救国，创办独立民间报纸《京报》，希望依靠舆论监督政府、唤醒民众。《京报》坚持独立办报，不依附军阀、不受外国资本操控。积极声援五四运动，持续抨击北洋反动势力，介绍十月革命，传播马克思主义。鲁迅曾在《京报》创办《莽原》周刊，大量杂文在此刊发。\n2. “铁肩辣手”——邵飘萍的一生\n邵飘萍（1886—1926），近代杰出报人、中国共产党早期秘密党员、中国新闻教育先驱。影壁上铁肩辣手四字，化用明代杨继盛名句“铁肩担道义，辣手著文章”，是邵飘萍毕生信条。“铁肩”代表担当道义；“辣手”代表不畏强权、秉笔直书。20世纪20年代北洋军阀统治时期，政局动荡，各路军阀割据混战，舆论受到严厉管控。当时大量报刊依附军阀、外国势力，缺少独立发声的进步媒体。他创办北京新闻编译社，打破外国通讯社垄断国内新闻市场；他曾任北大新闻学研究会讲师，毛泽东曾在此聆听他讲授新闻学；1925年，邵飘萍经李大钊、罗章龙介绍秘密加入中国共产党；1926年4月24日邵飘萍遭军阀张作霖诱捕，4月26日英勇就义，年仅40岁；同日《京报》被查封。民间评价：飘萍一支笔，抵过十万军。邵飘萍牺牲后，夫人汤修慧接续重振《京报》，报纸几经停刊、复刊，最终落幕。\n三、历史意义\n（一）新闻史意义\n《京报》是近代北京极具代表性的独立民间进步报刊，拒绝军阀收买，践行独立办报理想；\n邵飘萍奠定中国早期新闻学理论，是中国新闻教育先驱；“铁肩辣手”成为后世新闻工作者的精神标杆；\n京报馆是北京唯一保存至今的自建民国报社原址，实物见证中国近代报业发展史。\n（二）革命史、红色传播意义\n京报馆是北方早期传播马克思主义重要阵地，大量进步文章在此刊发，宣传革命思想；积极声援五四运动、三一八爱国运动，以报刊为阵地动员民众，推动国民革命；作为中共早期秘密党员的活动地点，京报馆是北京重要红色革命旧址。\n（三）精神价值意义\n“铁肩担道义，辣手著文章”在这里落地实践。邵飘萍以笔为刃、不畏强权、为真理献身，体现近代知识分子救国图强的家国情怀；如今京报馆作为爱国主义教育基地、马克思主义新闻观教育基地，持续传承红色新闻精神。",
        sourceIds: [PROJECT_SCOPE_SOURCE_ID, DESIGN_SPEC_SOURCE_ID],
      },
    ],
    galleryAssetIds: [
      "jingbao-hall-01", "jingbao-hall-02", "jingbao-hall-03", "jingbao-hall-04", "jingbao-hall-05", "jingbao-hall-06", "jingbao-hall-07", "jingbao-hall-08", "jingbao-hall-09", "jingbao-hall-10", "jingbao-hall-11", "jingbao-hall-12", "jingbao-hall-13", "jingbao-hall-14", "jingbao-hall-15",
    ],
  },
  {
    id: "beijing-lu-xun-museum",
    slug: "beijing-lu-xun-museum",
    routeId: "awakening",
    order: 5,
    name: {
      value: "北京鲁迅博物馆",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID, directorySource],
    },
    officialAddress: {
      value: "北京市西城区阜成门内大街宫门口二条19号",
      sourceIds: ["source-beijing-red-tourism-directory"],
    },
    coordinateTarget: "main-entrance",
    coordinate: verifiedCoordinate(
      116.358707,
      39.925314,
      "main-entrance",
    ),
    historySummary: [],
    practiceSummary: [],
    assetIds: [],
    reviewStatus: "draft",
    publicationStatus: "planned",
    detailContent: [
      {
        id: "beijing-lu-xun-museum-detail",
        text: "北京鲁迅博物馆（北京新文化运动纪念馆）坐落于西城区阜成门内大街宫门口二条19号，是首批国家一级博物馆、全国爱国主义教育基地，也是鲁迅在北京四处居所里保存最为完整的一处旧址。场馆由鲁迅故居四合院与鲁迅生平陈列展厅两大区域组成。\n\n鲁迅故居是一座朴素雅致的老北京小型四合院，1924年鲁迅出资购置，并亲自绘制图纸改造。1924年5月至1926年8月，鲁迅在此居住两年多。院内两棵白丁香为鲁迅亲手栽种。院落北侧一间向外延伸的小屋，被鲁迅戏称为“老虎尾巴”，也就是他的书房兼卧室，又称“绿林书屋”。就在这间不足八平米的小屋中，鲁迅写下《野草》《华盖集》《华盖集续编》，以及《彷徨》《朝花夕拾》中的大量经典篇章。在此期间，他扶持青年文学社团、主编《语丝》《莽原》刊物，持续以文字针砭时弊，投身新文化运动与进步思想传播。\n\n东侧的鲁迅生平陈列展厅，系统完整梳理鲁迅先生一生求索道路。馆内珍藏七万余件文物，包含鲁迅手稿、原版书刊、书信、照片、生前生活用品等珍贵史料。展览沿着时间线，讲述他远赴东瀛学医、幻灯片事件后毅然弃医从文，以笔墨唤醒国民灵魂的人生抉择，展现他作为文学家、思想先驱，追寻真理、为民发声的一生。\n\n作为新文化运动重要的历史见证地，这里不仅留存着珍贵文学记忆，更承载着近代中国思想启蒙的红色脉络。百年间，鲁迅先生“横眉冷对千夫指，俯首甘为孺子牛”的精神跨越时代，持续激励当代青年思索使命、勇担责任。如今这里也是红色研学、社会实践的重要地点，无数青年走进院落与展厅，在文物与文字之间读懂觉醒年代的理想与坚守。",
        sourceIds: [PROJECT_SCOPE_SOURCE_ID, DESIGN_SPEC_SOURCE_ID],
      },
    ],
    galleryAssetIds: [
      "lu-xun-museum-01", "lu-xun-museum-02", "lu-xun-museum-03", "lu-xun-museum-04", "lu-xun-museum-05", "lu-xun-museum-06", "lu-xun-museum-07", "lu-xun-museum-08", "lu-xun-museum-09", "lu-xun-museum-10", "lu-xun-museum-11", "lu-xun-museum-12", "lu-xun-museum-13", "lu-xun-museum-14", "lu-xun-museum-15", "lu-xun-museum-16", "lu-xun-museum-17", "lu-xun-museum-18", "lu-xun-museum-19", "lu-xun-museum-20", "lu-xun-museum-21", "lu-xun-museum-22", "lu-xun-museum-23", "lu-xun-museum-24",
    ],
  },
  {
    id: "war-sculpture-park",
    slug: "war-sculpture-park",
    routeId: "war",
    order: 1,
    name: {
      value: "中国人民抗日战争纪念雕塑园",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID],
    },
    officialAddress: {
      value: "北京市丰台区卢沟桥南里10号",
      sourceIds: ["source-beijing-red-tourism-directory"],
    },
    coordinateTarget: "site-center",
    coordinate: verifiedCoordinate(
      116.22681,
      39.84903,
      "site-center",
    ),
    historySummary: [],
    practiceSummary: [],
    assetIds: ["field-03"],
    reviewStatus: "draft",
    publicationStatus: "planned",
    detailContent: [
      {
        id: "war-sculpture-park-detail",
        text: "中国人民抗日战争纪念雕塑园位于北京市丰台区卢沟桥城南街77号，是为纪念抗日战争胜利55周年于2000年7月竣工，同年8月16日正式对外开放的爱国主义教育基地。园区占地20公顷，北倚宛平城墙，西临卢沟桥，包含中国人民抗日战争纪念碑、雕塑群区、下沉式中心广场等景观，其中纪念碑高15米，由花岗岩和铸铜雕塑组成。雕塑群区占地2.25万平方米，按历史进程分为“日寇侵凌”“奋起救亡”“抗日烽火”“正义必胜”四部分，以《国歌》为主线展现抗战历程。园内设有“黄河”形鹅卵石甬道及雪松、银杏等植被，绿化面积达12万平方米。2025年经整体修缮后，雕塑园与卢沟桥、宛平城实现“馆桥城园”一体化运营，新增标准化导览牌及数字化展示系统，采用二维码语音导览模式。",
        sourceIds: [PROJECT_SCOPE_SOURCE_ID, DESIGN_SPEC_SOURCE_ID],
      },
    ],
    galleryAssetIds: [
      "war-sculpture-park-01", "war-sculpture-park-02", "war-sculpture-park-03", "war-sculpture-park-04", "war-sculpture-park-05", "war-sculpture-park-06", "war-sculpture-park-07", "war-sculpture-park-08",
    ],
  },
  {
    id: "lugou-bridge",
    slug: "lugou-bridge",
    routeId: "war",
    order: 2,
    name: {
      value: "卢沟桥",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID, directorySource],
    },
    officialAddress: {
      value: "北京市丰台区卢沟桥城北街",
      sourceIds: ["source-beijing-red-tourism-directory"],
    },
    coordinateTarget: "site-center",
    coordinate: verifiedCoordinate(
      116.218791,
      39.850278,
      "site-center",
    ),
    historySummary: [],
    practiceSummary: [],
    assetIds: [],
    reviewStatus: "draft",
    publicationStatus: "planned",
    detailContent: [
      {
        id: "lugou-bridge-detail",
        text: "卢沟桥位于北京市丰台区永定河上，因横跨卢沟河（即永定河）而得名，是北京市现存古老的石造联拱桥，也是华北最大的古代石拱桥。卢沟桥始建于金大定二十九年（南宋淳熙十六年，1189年），金明昌三年（1192年）建成。明、清都曾加以修葺，如今桥的形制、桥基、桥身的构件和桥上石雕部分仍为金代原物。古时，每当黎明斜月西沉之时，明月倒映水中，更显明媚皎洁，“卢沟晓月”从金章宗年间就被列为“燕京八景”之一。桥东头立有乾隆帝亲笔题写的“卢沟晓月”碑。 卢沟桥的石雕精美奇特，构思巧妙，具有浓厚的民族特色。卢沟桥桥面两旁有石栏杆，栏杆望柱头上雕刻着石狮子，因其数多，且小狮子多雕于隐蔽处，故明代即有“卢沟桥的狮子——数不清”的歇后语。\n\n1937年7月7日，日本在此发动全面侵华战争，史称“卢沟桥事变”（亦称“七七事变”）。 中国抗日军队在卢沟桥打响了全面抗战的第一枪。 当日夜间，驻丰台日军诡称演习中“失踪”一名士兵，要求进宛平城搜查，遭拒绝后，即炮轰宛平城，向卢沟桥发起进攻。中国驻军第二十九军奋起抗击。8日，中国共产党通电全国，号召全民族抗战。11日，日本政府决定增兵，调关东军及驻朝鲜日军各一部进攻北平，调日本国内陆海军一部进攻天津。17日，蒋介石表示应战。27日，日军陷廊坊、宝珠寺等地。28日，日军猛攻南苑，第二十九军副军长佟麟阁、师长赵登禹殉国。至30日，平津陷落。从此，中国开始了全国性的抗日战争。\n\n卢沟桥作为北京市现存最古老的石造联拱桥和全民族抗战爆发地，不仅是北京市丰台区的重要文化资源，也是影响深远的国家重大活动纪念地。",
        sourceIds: [PROJECT_SCOPE_SOURCE_ID, DESIGN_SPEC_SOURCE_ID],
      },
    ],
    galleryAssetIds: [
      "lugou-bridge-01", "lugou-bridge-02", "lugou-bridge-03", "lugou-bridge-04", "lugou-bridge-05", "lugou-bridge-06", "lugou-bridge-07", "lugou-bridge-08", "lugou-bridge-09",
    ],
  },
  {
    id: "wanping-city",
    slug: "wanping-city",
    routeId: "war",
    order: 3,
    name: {
      value: "宛平城",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID, directorySource],
    },
    officialAddress: {
      value: "北京市丰台区卢沟桥东侧宛平城内街",
      sourceIds: ["source-beijing-red-tourism-directory"],
    },
    coordinateTarget: "site-center",
    coordinate: verifiedCoordinate(
      116.226098,
      39.851436,
      "site-center",
    ),
    historySummary: [],
    practiceSummary: [],
    assetIds: [],
    reviewStatus: "draft",
    publicationStatus: "planned",
    detailContent: [
      {
        id: "wanping-city-detail",
        text: "宛平城，又称宛平县城，位于北京市丰台区境内，在卢沟桥东，与桥相距百余米，是一座桥头堡，始建于明崇祯十三年（1640年）称“拱北城”，清朝时期改称“拱极城”，民国十七年（1928年）改称“宛平城”，是明、清时期军事专用的卫城。宛平城平面呈长方形，东西长640米，南北宽320米，城池总面积约20公顷。城墙高7.18米。城墙四周外侧有垛口、膝望孔、射眼。城有东、西两座城门，东为“顺治门”，西为“威严门”。宛平城是中国华北地区唯一保存完整的两开门卫城，同时也是七七事变的历史见证。",
        sourceIds: [PROJECT_SCOPE_SOURCE_ID, DESIGN_SPEC_SOURCE_ID],
      },
    ],
    galleryAssetIds: [
      "wanping-city-01", "wanping-city-02", "wanping-city-03", "wanping-city-04",
    ],
  },
  {
    id: "war-museum",
    slug: "war-museum",
    routeId: "war",
    order: 4,
    name: {
      value: "中国人民抗日战争纪念馆",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID, directorySource],
    },
    officialAddress: {
      value: "北京市丰台区宛平城内街101号",
      sourceIds: ["source-beijing-red-tourism-directory"],
    },
    coordinateTarget: "main-entrance",
    coordinate: verifiedCoordinate(
      116.226007,
      39.851669,
      "main-entrance",
    ),
    historySummary: [],
    practiceSummary: [],
    assetIds: [],
    reviewStatus: "draft",
    publicationStatus: "planned",
    detailContent: [
      {
        id: "war-museum-detail",
        text: "中国人民抗日战争纪念馆位于北京市丰台区卢沟桥畔宛平城内街101号， 是全国唯一一座全面反映中国人民抗日战争历史的大型综合性专题纪念馆，是国家一级博物馆、全国首批国家级抗战纪念设施、全国首批红色旅游景点景区、全国爱国主义教育示范基地。中国人民抗日战争纪念馆 1987年7月落成并对外开放，由邓小平同志亲笔题写馆名 。中国人民抗日战争纪念馆馆藏文物共 32831 件 / 套（截至 2025年10月），其中一级藏品达 150 余件 / 套。文物藏品以 1931 年至 1945 年抗日战争时期的各种历史文献和相关实物为主，同时也收藏日本自清同治十三年（1874 年）以来侵略和占领台湾的各类文物，内容涉及军事、政治、经济、文化、社会等诸多历史侧面 ，逐步形成了以“七七事变文物组群、重要抗战人士相关文物、抗战时期纸质文物、侵华日军武器装备”为特点的文物收藏特色。",
        sourceIds: [PROJECT_SCOPE_SOURCE_ID, DESIGN_SPEC_SOURCE_ID],
      },
    ],
    galleryAssetIds: [
      "war-museum-01", "war-museum-02", "war-museum-03", "war-museum-04", "war-museum-05", "war-museum-06", "war-museum-07", "war-museum-08", "war-museum-09", "war-museum-10", "war-museum-11", "war-museum-12", "war-museum-13", "war-museum-14", "war-museum-15", "war-museum-16", "war-museum-17",
    ],
  },
  {
    id: "black-mountain-memorial",
    slug: "black-mountain-memorial",
    routeId: "war",
    order: 5,
    name: {
      value: "百望山黑山扈战斗纪念园",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID, directorySource],
    },
    officialAddress: {
      value: "北京市海淀区黑山扈路17号",
      sourceIds: ["source-beijing-red-tourism-directory"],
    },
    coordinateTarget: "site-center",
    coordinate: verifiedCoordinate(
      116.256684,
      40.029841,
      "site-center",
    ),
    historySummary: [],
    practiceSummary: [],
    assetIds: [],
    reviewStatus: "draft",
    publicationStatus: "planned",
    detailContent: [
      {
        id: "black-mountain-memorial-detail",
        text: "黑山扈战斗纪念园位于北京市海淀区百望山森林公园内，是为纪念1937年9月发生在黑山扈地区的抗日战斗而建立的纪念设施。1937年9月8日，国民抗日军在此与日军激战，击落敌机一架，极大地鼓舞了北平军民的抗战信心。这是抗日战争中中国军队在北京地区首次击落日军飞机。纪念园内建有战斗纪念碑和浮雕墙，生动再现了当时的战斗场景。百望山地处北京西郊，是俯瞰北京城区的制高点之一。实践队员在纪念园采集了纪念碑铭文和浮雕墙的影像资料，并沿登山步道记录了周边的抗战遗址分布情况。",
        sourceIds: [PROJECT_SCOPE_SOURCE_ID, DESIGN_SPEC_SOURCE_ID],
      },
    ],
    galleryAssetIds: ["field-02", "field-03"],
  },
  {
    id: "xiangshan-revolutionary-site",
    slug: "xiangshan-revolutionary-site",
    routeId: "capital",
    order: 1,
    name: {
      value: "香山革命纪念地",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID, directorySource],
    },
    officialAddress: {
      value: "北京市海淀区买卖街40号",
      sourceIds: ["source-beijing-red-tourism-directory"],
    },
    coordinateTarget: "site-center",
    coordinate: verifiedCoordinate(
      116.194052,
      39.989342,
      "site-center",
      "manual-pin",
    ),
    historySummary: [],
    practiceSummary: [],
    assetIds: ["field-04"],
    reviewStatus: "draft",
    publicationStatus: "planned",
    detailContent: [
      {
        id: "xiangshan-detail",
        text: "香山革命纪念地位于北京市海淀区香山公园内，包括香山革命纪念馆和香山革命旧址两部分。1949年3月，中共中央由西柏坡迁至北平后，暂驻香山，这里成为中国共产党领导全国解放战争和筹建新中国的指挥中心。毛泽东同志在香山的双清别墅居住和工作了181天，在此发表了《论人民民主专政》等重要著作，指挥了渡江战役。纪念馆基本陈列“为新中国奠基”通过800余张历史照片和1200余件文物，系统展示了香山时期的革命历史。实践队员重点拍摄了双清别墅、来青轩等旧址的保存现状。",
        sourceIds: [PROJECT_SCOPE_SOURCE_ID, DESIGN_SPEC_SOURCE_ID],
      },
    ],
    galleryAssetIds: ["field-04", "field-05"],
  },
  {
    id: "cpc-history-exhibition",
    slug: "cpc-history-exhibition",
    routeId: "capital",
    order: 2,
    name: {
      value: "中国共产党历史展览馆",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID],
    },
    officialAddress: {
      value: "北京市朝阳区北辰东路9号",
      sourceIds: ["source-beijing-red-tourism-directory"],
    },
    coordinateTarget: "main-entrance",
    coordinate: verifiedCoordinate(
      116.398266,
      40.003639,
      "main-entrance",
    ),
    historySummary: [],
    practiceSummary: [],
    assetIds: [],
    reviewStatus: "draft",
    publicationStatus: "planned",
    detailContent: [
      {
        id: "cpc-history-exhibition-detail",
        text: "中国共产党历史展览馆位于北京市朝阳区北辰东路9号，是一座以党史为主题的国家级展览馆。展馆建筑以“不忘初心、牢记使命”为主题，外观采用传统与现代相结合的设计风格。馆内基本陈列分为四个部分，通过3500余件文物、4500余张图片和大量多媒体展项，全景式展示了中国共产党百年奋斗历程。重点展品包括李大钊就义的绞刑架、共和国一号国印、嫦娥五号月壤样本等。实践队员在馆内系统记录了与北京革命史迹相关的展陈内容，为地点档案的史料核对提供了重要参考。",
        sourceIds: [PROJECT_SCOPE_SOURCE_ID, DESIGN_SPEC_SOURCE_ID],
      },
    ],
    galleryAssetIds: ["field-05", "field-01"],
  },
  {
    id: "qinghuayuan-station",
    slug: "qinghuayuan-station",
    routeId: "capital",
    order: 3,
    name: {
      value: "清华园车站旧址",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID, directorySource],
    },
    officialAddress: {
      value: "北京市海淀区清华西路",
      sourceIds: ["source-beijing-red-tourism-directory"],
    },
    coordinateTarget: "main-entrance",
    coordinate: verifiedCoordinate(
      116.33176,
      39.99151,
      "main-entrance",
    ),
    historySummary: [],
    practiceSummary: [],
    assetIds: [],
    reviewStatus: "draft",
    publicationStatus: "planned",
    detailContent: [
      {
        id: "qinghuayuan-station-detail",
        text: "清华园车站旧址位于北京市海淀区成府路与清华西路交叉口附近，是京张铁路沿线的一座历史车站。车站由詹天佑主持设计，建于1910年，是京张铁路出京后的第一站。1949年3月25日，中共中央领导机关由西柏坡迁至北平时，毛泽东等领导人在清华园车站下车，标志着中国共产党工作重心从乡村转移到城市的重要历史转折。车站建筑为中西合璧风格，青砖墙体、绿色门窗套和站名牌保存基本完好。现旧址内设有专题展览，介绍京张铁路历史和“进京赶考”的历史事件。",
        sourceIds: [PROJECT_SCOPE_SOURCE_ID, DESIGN_SPEC_SOURCE_ID],
      },
    ],
    galleryAssetIds: ["field-01", "field-02"],
  },
];
