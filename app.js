const STORAGE_KEY = "lera-methodology-prototype-v4";
const UI_LANGUAGE_KEY = "lera-ui-language";
const LEGACY_UI_LANGUAGE_KEY = "restaurant-database-language";

const stageIds = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const skipEnabledStages = new Set(["A", "B"]);
const elementKeys = ["protagonista", "secundario", "liquido", "solido", "aromatico", "crujiente", "graso", "decorativo", "otro"];

const defaultState = {
  meta: {
    projectOrigin: "new_dish",
    dishName: "陈皮炭烤鹧鸪",
    projectCode: "2026-001",
    sourceDishCode: "",
    sourceMethodologyCode: "",
    currentStage: "J",
    currentStatus: "archived",
    activeCreativeBasis: "FT3-FA2",
    activeProductBasis: "PA1",
    nextAction: "方法论记录已完成，可进入菜品归档与菜谱录入。",
    currentVersion: "2026-001-a",
    language: "es"
  },
  stages: {
    A: {
      selected: ["cambio_de_estacion", "relectura_producto_habitual", "nueva_narrativa"],
      skipped: false
    },
    B: {
      selected: ["influencia_otra_cultura", "nuevas_formas_presentar", "mejor_textura_cada_pieza"],
      skipped: false
    },
    C: {
      selectedElements: ["protagonista", "liquido", "crujiente", "aromatico"],
      dishIdeaSummary: "以秋季野味为起点，保留鹧鸪的辨识度，用陈皮和野菌建立更成熟、更带林地气息的风味骨架。整体结构希望呈现：炭烤禽类主体、带酸苦香的深色汁、轻脆坚果元素与最后释放的香气点。",
      protagonista_product: "鹧鸪",
      protagonista_flavor: "禽类鲜味、轻微苦韵、炭香",
      protagonista_texture: "外皮紧实微脆、胸肉多汁、腿肉更有弹性",
      protagonista_aroma: "炭烤、禽香、熟陈皮油香",
      protagonista_temperature: "热",
      protagonista_function: "主角与主体蛋白",
      protagonista_tasteIntensity: "高",
      protagonista_textureIntensity: "高",
      protagonista_aromaIntensity: "高",
      liquido_product: "陈皮野菌汁",
      liquido_flavor: "深色汁感、菌香、轻苦回甘、微酸提亮",
      liquido_texture: "浓稠但不糊口，能包裹禽肉",
      liquido_aroma: "野菌、陈皮、烤骨汁",
      liquido_temperature: "热",
      liquido_function: "连接主体并放大风味",
      liquido_tasteIntensity: "高",
      liquido_textureIntensity: "中",
      liquido_aromaIntensity: "高",
      crujiente_product: "荞麦榛子脆片",
      crujiente_flavor: "坚果香、谷物香、轻微焦香",
      crujiente_texture: "薄脆、干爽、易碎",
      crujiente_aroma: "烘烤坚果香",
      crujiente_temperature: "常温",
      crujiente_function: "提供对比质地和收尾香气",
      crujiente_tasteIntensity: "中",
      crujiente_textureIntensity: "高",
      crujiente_aromaIntensity: "中",
      aromatico_product: "陈皮油与百里香",
      aromatico_flavor: "微苦柑橘油香、草本清感",
      aromatico_texture: "轻盈",
      aromatico_aroma: "陈皮、百里香、热油带出的挥发香",
      aromatico_temperature: "热油点缀",
      aromatico_function: "完成最后一层香气识别",
      aromatico_tasteIntensity: "低",
      aromatico_textureIntensity: "低",
      aromatico_aromaIntensity: "高",
      attributeBranchSelections: {
        crujiente: [
          {
            changeId: "CHG-CRUJIENTE-01",
            displayRef: "Herr-2026-001-01",
            experimentRef: "2026-001",
            date: "2026-03-18T10:10:00.000Z",
            outputCode: "b",
            outputText: "荞麦榛子脆片",
            alternatives: ["a"],
            possibilities: [
              { code: "a", label: "米通与禽皮脆片", text: "米通与禽皮脆片" },
              { code: "b", label: "荞麦榛子脆片", text: "荞麦榛子脆片" },
              { code: "c", label: "烤面包屑与可可碎", text: "烤面包屑与可可碎" }
            ]
          }
        ],
        aromatico: [
          {
            changeId: "CHG-AROMA-01",
            displayRef: "Herr-2026-001-02",
            experimentRef: "2026-001",
            date: "2026-03-18T11:00:00.000Z",
            outputCode: "c",
            outputText: "陈皮油与百里香",
            alternatives: ["a", "b"],
            possibilities: [
              { code: "a", label: "黑蒜热油", text: "黑蒜热油" },
              { code: "b", label: "发酵蘑菇油", text: "发酵蘑菇油" },
              { code: "c", label: "陈皮油与百里香", text: "陈皮油与百里香" }
            ]
          }
        ]
      }
    },
    D: {
      presentation_protagonista: "整只鹧鸪拆解后重组装盘：胸肉切片露出火候，腿肉去骨卷起，保留一小段可识别骨位，体现野味身份但减少食用阻碍。",
      presentation_liquido: "深色热汁于出菜前从侧面围绕主体点入，不覆盖表皮，保持烤制视觉。",
      presentation_crujiente: "脆片分两段放置，一片垫高主体，一片临出菜时折断撒落，制造自然断裂感。",
      presentation_aromatico: "陈皮油最后滴在汁面与禽肉交界，百里香在上桌瞬间释放香气。"
    },
    E: {
      technique_protagonista: "鹧鸪先风干，再以黄油不断刷烤，胸肉保留嫩度，腿肉单独低温处理后回烤上色。",
      technique_liquido: "用烤骨汁与野菌浓缩，再以陈皮浸提做后段修饰，避免苦味过重。",
      technique_crujiente: "荞麦与榛子先烘烤，再压成薄片烘干，保持轻薄和断裂感。",
      technique_aromatico: "陈皮油低温浸泡获取香气，百里香不长时间加热，只作最后热油带香。"
    },
    F: {
      sketchMode: "draw",
      generalFlavor: "主味为烤禽鲜香与深色汁感，陈皮带来提亮的微苦与轻酸，整体成熟但不厚重。",
      generalTexture: "主体多汁、表皮微脆，汁体包裹，脆片提供干爽断裂感。",
      generalAroma: "第一层是炭烤禽香，第二层是野菌与汁感，最后由陈皮油和百里香完成上桌香气。",
      visualVolumeRelation: "yes",
      visualFocalPoint: "yes",
      visualDistribution: "yes",
      visualEmptyZones: "yes",
      visualDirection: "yes",
      visualRepetition: "no",
      visualReconfigure: "no",
      balanceDominantAttribute: "yes",
      balanceHighIntensityOverlap: "no",
      balanceSaturationRisk: "no",
      balanceTextureMonotony: "no",
      balanceThermalRelation: "yes",
      balanceExcessFatRisk: "no",
      balanceAcidityIssue: "no",
      balanceAcidityIssueType: [],
      balanceReajust: "no"
    },
    G: {
      tests: [
        {
          testScope: "whole_dish",
          testDate: "2026-03-19",
          testCode: "G-01",
          testNumber: "1",
          behaviorMatch: "partial",
          mainDeviation: "第一轮中陈皮香气存在，但汁体略厚，压住了鹧鸪本身的细节。",
          technicalComparison: "比较了更浓缩的野菌汁和稍微拉开浓度的版本，后者更能让禽肉保留辨识度。",
          chosenFinalTechnology: "降低收汁终点浓度，保留更轻的流动性",
          choiceReason: "让液体承担连接作用，而不是成为唯一主角",
          passStabilityInPrototype: "yes",
          proportionEvaluation: "禽肉与汁比例更平衡，但脆片仍偏弱。",
          structuralCoherenceEvaluation: "主结构已成立，缺少更明确的脆感终点。",
          kitchenDecision: "rollback_to_d"
        },
        {
          testScope: "element",
          testElementType: "crujiente",
          testDate: "2026-03-20",
          testCode: "G-02",
          testNumber: "2",
          behaviorMatch: "yes",
          mainDeviation: "脆片厚度稍大时会影响整体轻盈感。",
          technicalComparison: "比较了米通结构、面包屑结构和荞麦榛子薄片，荞麦榛子版本更符合秋季野味语境。",
          chosenFinalTechnology: "荞麦榛子薄片",
          choiceReason: "既有谷物脆感，又不抢走主角风味。",
          passStabilityInPrototype: "yes",
          proportionEvaluation: "一大片一小片的比例更好。",
          structuralCoherenceEvaluation: "最终结构完成。", 
          kitchenDecision: "advance"
        }
      ]
    },
    H: {
      creativeFoundationResponse: "yes",
      functionIdentifiable: "yes",
      redundantElement: "",
      serviceStructureMaintained: "yes",
      intensityAdequacy: "balanced",
      internalTastingResults: "内部试吃认为野味辨识度清晰，陈皮成为识别点而非干扰点。",
      externalTastingResults: "外部反馈认为脆片让整体更完整，并强化了秋季感。",
      finalAdjustments: "确认汁体终点、脆片厚度和陈皮油出餐时机。",
      adjustmentType: "micro_adjustment",
      verificationDecision: "advance",
      adjustmentDescription: "不再回退，进入最终归档。"
    },
    I: {
      menuPosition: "秋季狩猎线主菜前的热前菜 / 过渡主菜",
      incorporationTiming: "10 月下旬开始试行，11 月正式进入菜单",
      finalStatus: "approved_for_menu",
      decisionNotes: "可作为秋季禽类线的核心菜之一，后续若换季可替换汁体和香气点，但保留主体结构。"
    },
    J: {
      technicalSheet: "整只鹧鸪拆解，胸肉风干后炭烤，腿肉低温后回烤；陈皮野菌汁单独浓缩；脆片预制；陈皮油与百里香最后完成。",
      standardizedProcess: "前一日处理鹧鸪与汁底；服务前完成回温、回烤、收汁与脆片检查；出菜前 1 分钟完成装盘与热油点香。",
      criticalControlPoints: "胸肉火候、汁体浓度、脆片湿度、陈皮油使用量、装盘前后热量损失。",
      finalPhotoReference: "出品参考：主体偏左，汁围绕下半部，脆片形成高低层次，陈皮油集中在交界位置。",
      documentationNotes: "本菜完整经历属性工具选择与一次正式回退，可作为野味主线方法论样例。"
    }
  },
  changeLog: [
    {
      type: "formal_adjustment",
      changeId: "CHG-ROLLBACK-01",
      displayRef: "Cam-2026-001-01",
      experimentRef: "2026-001",
      date: "2026-03-19T16:20:00.000Z",
      versionBefore: "2026-001",
      versionAfter: "2026-001-a",
      rollbackFromStage: "G",
      rollbackToStage: "D",
      reasonForChange: "第一轮整体验证后，脆感层和液体层的主次关系还不清楚，需要回到呈现与技术层重新校正。",
      affectedElements: "液体元素、脆感元素",
      affectedTechniques: "收汁终点、脆片厚度"
    },
    {
      type: "attribute_tool",
      changeId: "CHG-AROMA-01",
      displayRef: "Herr-2026-001-02",
      experimentRef: "2026-001",
      date: "2026-03-18T11:00:00.000Z",
      targetElement: "aromatico",
      targetElementLabel: "香气元素",
      outputCode: "c",
      outputText: "陈皮油与百里香",
      alternativeCodes: ["a", "b"],
      alternativeLabels: ["黑蒜热油", "发酵蘑菇油"]
    },
    {
      type: "attribute_tool",
      changeId: "CHG-CRUJIENTE-01",
      displayRef: "Herr-2026-001-01",
      experimentRef: "2026-001",
      date: "2026-03-18T10:10:00.000Z",
      targetElement: "crujiente",
      targetElementLabel: "脆感元素",
      outputCode: "b",
      outputText: "荞麦榛子脆片",
      alternativeCodes: ["a"],
      alternativeLabels: ["米通与禽皮脆片"]
    }
  ]
};

function stripTemplateValue(value) {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, stripTemplateValue(nested)]));
  }
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  return "";
}

function createFreshState(language = "es") {
  const emptyStages = stripTemplateValue(defaultState.stages);
  return {
    meta: {
      projectOrigin: "new_dish",
      dishName: "",
      projectCode: "",
      sourceDishCode: "",
      sourceMethodologyCode: "",
      currentStage: "A",
      currentStatus: "draft",
      activeCreativeBasis: "",
      activeProductBasis: "",
      nextAction: "",
      currentVersion: "",
      editingProjectCode: "",
      editingVersionCode: "",
      language
    },
    stages: emptyStages,
    changeLog: []
  };
}

function getPersistedUiLanguage() {
  return "es";
}

function persistUiLanguage() {}

const i18n = {
  zh: {
    htmlLang: "zh-CN",
    title: "Lera 方法论工具原型",
    brandEyebrow: "Lera 方法论",
    brandTitle: "菜品流程原型",
    brandCopy: "Herramienta estructurada por etapas para el proceso creativo completo, con rollback, trazabilidad del proceso y gestión de versiones formales.",
    mainFlow: "主流程",
    version: "方法论记录",
    reset: "重置原型数据",
    dashboardEyebrow: "项目总览",
    untitledDish: "未命名菜品",
    homeLink: "主页",
    save: "保存",
    savePdf: "保存 PDF",
    savePdfDone: "PDF 面板已打开",
    savePdfFailed: "PDF 导出失败",
    exportResults: "下载所有结果",
    exportResultsDone: "结果已导出",
    exportResultsFailed: "导出失败",
    openProject: "打开",
    saved: "已保存",
    opened: "已读取",
    saveFailed: "数据库保存失败",
    autoSavedAt: "自动保存于 {time}",
    unsaved: "未保存",
    autoSaving: "自动保存中…",
    openFailed: "读取失败",
    savedRecordsEyebrow: "已保存记录",
    savedRecordsTitle: "记录",
    savedRecordsLoading: "正在读取本地记录…",
    savedRecordsEmpty: "暂无记录",
    savedRecordsLoadAction: "打开",
    savedRecordsUpdatedAt: "最近更新",
    savedRecordsStage: "当前阶段",
    savedRecordsStatus: "当前状态",
    restart: "重新开始",
    rollback: "回退",
    formalRollback: "正式回退",
    review: "回顾",
    skip: "暂时跳过",
    snapshot: "项目快照",
    latestChange: "修改记录",
    noLatestChange: "",
    stageWorkspace: "阶段工作台",
    previous: "上一页",
    next: "下一阶段",
    attributeButton: "进入属性生成分支",
    attributeNote: "",
    attributeDialogTitle: "属性分支",
    attributeDialogCopy: "",
    attributeEyebrow: "属性原料分支",
    attributeStage1Title: "I. 目标属性定义",
    attributeStage2Title: "II. 精准描述属性",
    attributeStage3Title: "III. 实现机制识别",
    attributeStage4Title: "IV. 翻译为可能原料",
    attributeStage5Title: "V. 自由组合",
    attributeOutputTitle: "输出结果",
    attributeTargetTypeLabel: "目标结果类型",
    attributeCombinationsLabel: "可能组合",
    attributeCodeLabel: "编码",
    attributeOutputLabel: "准备输出回 C 阶段的结果",
    attributeOutputTargetLabel: "输出到的 C 阶段元素",
    addAttribute: "添加属性",
    addMechanism: "添加方式",
    addCombination: "添加组合",
    closeAttribute: "关闭",
    applyAttributeOutput: "输出结果",
    attributeApplied: "结果已输出",
    attributeAlternativesLabel: "备选选项",
    possibilitiesTitle: "可能性列表",
    attributeTypes: {
      structural: "结构型（质地 / 形态 / 稳定性）",
      gustative: "味觉型",
      aromatic: "香气型",
      thermal: "温度型",
      functional: "功能型"
    },
    attributeLabels: {
      attribute: "属性",
      intensity: "期望强度",
      condition: "条件",
      mechanism: "实现机制",
      ingredientList: "可能原料列表"
    },
    changeLog: "修改记录",
    noChanges: "",
    rollbackEvent: "回退事件",
    rollbackDialogTitle: "正式回退",
    rollbackDialogCopy: "",
    stageGuidance: "",
    reviewEyebrow: "阶段回顾",
    reviewDialogTitle: "阶段回顾",
    reviewDialogCopy: "",
    closeReview: "关闭",
    registerSupplement: "补充",
    noReviewContent: "",
    sketchSummary: "草图",
    rollbackTarget: "回退目标阶段",
    rollbackReason: "修改原因",
    rollbackDescription: "修改说明",
    affectedElements: "受影响元素",
    affectedTechniques: "受影响技法",
    cancel: "取消",
    createRollback: "创建回退",
    currentStage: "当前阶段",
    projectOrigin: "项目类型",
    projectOriginPlaceholder: "",
    currentStatus: "当前状态",
    activeCreativeBasis: "当前激活的创意基础",
    activeProductBasis: "当前激活的原料类别 P",
    nextRequiredAction: "下一阶段",
    dishName: "菜品名称",
    sourceDishCode: "原菜肴编码",
    sourceMethodologyCode: "原方法论主编码",
    projectOriginOptions: {
      new_dish: "新菜肴",
      existing_dish_update: "旧菜调整 / 替换"
    },
    projectCode: "项目编码",
    dishNamePlaceholder: "菜品暂定名",
    sourceDishCodePlaceholder: "原始成品菜编码",
    sourceMethodologyCodePlaceholder: "对应旧方法论主编码",
    creativeBasisPlaceholder: "FT3 / FP2 / FA3...",
    productBasisPlaceholder: "PA1 / PB2",
    nextActionPlaceholder: "",
    methodologyPanelTitle: "方法论参考",
    sketchModule: "草图",
    sketchMode: "草图方式",
    sketchModeDraw: "绘画",
    sketchModeUpload: "插入图片",
    sketchDescriptionPrompt: "",
    sketchHint: "",
    sketchCanvasHint: "",
    sketchUploadHint: "",
    sketchCanvasEmpty: "",
    sketchUploadEmpty: "",
    saveSketch: "保存草图",
    clearSketch: "清空画布",
    brushColor: "画笔颜色",
    customColor: "自定义颜色",
    undo: "撤销",
    redo: "取消撤销",
    removeImage: "移除图片",
    replaceImage: "替换图片",
    sketchSaved: "草图已保存",
    chooseImage: "选择图片",
    genericSelect: "-",
    yes: "是",
    no: "否",
    partial: "部分",
    low: "低",
    adequate: "适中",
    high: "高",
    draft: "草稿",
    in_progress: "进行中",
    needs_review: "待复核",
    validated: "已验证",
    archived: "已归档",
    wholeDish: "整道菜",
    singleElement: "单个元素",
    addKitchenTest: "新增厨房测试",
    remove: "删除",
    archiveAction: "菜品归档",
    archivedSuccess: "项目已归档。",
    stageJArchiveHint: "",
    skippedStageSupplementTitle: "补足信息",
    skippedARecovery: "A 阶段补足说明",
    skippedBRecovery: "B 阶段补足说明",
    noKitchenTests: "暂无",
    kitchenTestSeries: "厨房测试记录组",
    kitchenTestSeriesCopy: "",
    kitchenTest: "厨房测试",
    stageSkipped: "已跳过",
    finalABReminder: "",
    rollbackOnlyFrom: "未选",
    rollbackBanner: "{from} -> {to} · {reason}",
    latestChangeTemplate: "{recordLabel} {ref}\n{date}\n回退：{from} -> {to}\n原因：{reason}",
    changeItemTemplate: "{recordLabel} {ref}\n{date}\n阶段：{from} -> {to}\n原因：{reason}\n元素：{elements}\n技法：{techniques}",
    toolUseTemplate: "{recordLabel} {ref}\n{date}\n属性生成分支\n元素：{target}\n主输出：{output}\n备选：{alternatives}",
    rollbackRecordLabel: "回退记录",
    toolUseRecordLabel: "工具使用记录",
    stageSubtitles: {
      A: "创作起因",
      B: "创意基础",
      C: "菜品结构",
      D: "呈现形式",
      E: "技术方案",
      F: "概念验证",
      G: "厨房测试",
      H: "验证与调整",
      I: "决策",
      J: "文档归档"
    },
    stageTitles: {
      A: "菜品创造的需求",
      B: "创意基础",
      C: "元素、属性与功能",
      D: "每个元素的呈现方式",
      E: "适配每个元素的技术",
      F: "概念验证",
      G: "厨房测试",
      H: "验证与调整",
      I: "决策",
      J: "文档归档"
    },
    aOptions: [
      {
        value: "operational_need",
        label: "操作层需求",
        children: [
          { value: "cambio_de_estacion", label: "季节变化" },
          { value: "cambio_disponibilidad_producto", label: "产品供应变化" },
          { value: "sustitucion_del_plato", label: "菜品替换" },
          { value: "aprovechamiento_excedentes", label: "利用剩余" },
          { value: "equilibrio_del_menu", label: "菜单平衡" },
          { value: "optimizacion_rentabilidad", label: "盈利优化" }
        ]
      },
      {
        value: "conceptual_need",
        label: "概念层需求",
        children: [
          { value: "nueva_tendencia_culinaria", label: "新的烹饪趋势" },
          { value: "desarrollo_aprendizaje_reciente", label: "近期学习的发展" },
          { value: "nueva_narrativa", label: "新的叙事" },
          { value: "referencia_historica", label: "历史参照" },
          { value: "exploracion_tecnica", label: "技术探索" }
        ]
      },
      {
        value: "product_need",
        label: "产品层需求",
        children: [
          { value: "entrada_inesperada_producto", label: "产品意外进入" },
          { value: "producto_excepcional", label: "特殊产品" },
          { value: "producto_olvidado", label: "被遗忘的产品" },
          { value: "producto_infrautilizado", label: "未被充分利用的产品" },
          { value: "relectura_producto_habitual", label: "重新解读常用产品" }
        ]
      },
      {
        value: "inspiration_accumulation",
        label: "灵感累积",
        children: []
      }
    ],
    bOptions: [
      {
        value: "emotion",
        label: "情绪",
        children: [
          { value: "divertido", label: "有趣" }
        ]
      },
      {
        value: "memory",
        label: "记忆",
        children: [
          { value: "memoria_casa_infancia", label: "家庭 / 童年记忆" },
          { value: "recuerdos_gustativos", label: "味觉记忆" }
        ]
      },
      {
        value: "learning",
        label: "学习",
        children: [
          { value: "error_previo", label: "之前的错误" },
          { value: "influencia_otra_cultura", label: "其他文化影响" },
          { value: "nuevas_combinaciones_sabores_texturas", label: "新的味道与质地组合" },
          { value: "nuevas_combinaciones_ingredientes", label: "新的食材组合" },
          { value: "interaccion_otros", label: "与他人的互动" }
        ]
      },
      {
        value: "tradition",
        label: "传统",
        children: [
          { value: "tradicion_sin_tocar", label: "保持传统不动" },
          { value: "tecnicas_ancestrales", label: "祖传技术" },
          { value: "nuevas_formas_presentar", label: "新的呈现方式" },
          { value: "cambiar_elementos_receta_tradicional", label: "改变传统配方元素" }
        ]
      },
      {
        value: "product_logic",
        label: "产品逻辑",
        children: [
          { value: "mejor_textura_cada_pieza", label: "为每个部位寻找最佳质地" },
          { value: "aprovechamiento_total", label: "完整利用" },
          { value: "cambio_protagonista_plato", label: "改变菜的主角" },
          { value: "busqueda_combinacion_atributos_sensoriales", label: "感官属性组合探索" }
        ]
      }
    ],
    elements: {
      protagonista: "主角元素",
      secundario: "次要元素",
      liquido: "液体元素",
      solido: "固体元素",
      aromatico: "香气元素",
      crujiente: "脆感元素",
      graso: "脂肪元素",
      decorativo: "装饰元素",
      otro: "其他元素"
    },
    labels: {
      selectElements: "元素",
      methodologyC: "方法论说明",
      methodologyD: "方法论说明",
      dishIdeaSummary: "菜品整体构想",
      dishIdeaPlaceholder: "",
      concreteProduct: "具体产品",
      flavor: "味道",
      texture: "质地",
      aroma: "香气",
      temperature: "温度",
      function: "功能",
      tasteIntensity: "味道强度",
      textureIntensity: "质地强度",
      aromaIntensity: "香气强度",
      enterIfSelected: "",
      concept: "概念",
      visualization: "视觉",
      balance: "平衡",
      functionBlock: "功能",
      provisionalCombination: "暂时组合方案",
      relationToCreativeFoundation: "与创意基础的关系",
      sketchOrVisualization: "草图或可视化说明",
      visualVolumeRelation: "体量关系是否清晰",
      visualFocalPoint: "是否有明确视觉焦点",
      visualDistribution: "分布是否避免过度堆积",
      visualEmptyZones: "是否存在非预期空白区域",
      visualDirection: "视觉方向是否连贯",
      visualRepetition: "是否存在不必要形式重复",
      visualReconfigure: "是否需要重新配置元素",
      generalFlavor: "整体风味",
      generalTexture: "整体质地",
      generalAroma: "整体香气",
      aromaContributors: "哪些元素提供整体香气",
      aromaNotes: "注意事项",
      aromaNotesPlaceholder: "",
      balanceDominantAttribute: "是否有明确主导风味属性",
      balanceHighIntensityOverlap: "是否有两个以上高强度元素重叠",
      balanceSaturationRisk: "是否存在感官饱和风险",
      balanceTextureMonotony: "整体质地是否单一",
      balanceThermalRelation: "热关系是否明确",
      balanceExcessFatRisk: "是否存在脂肪过量风险",
      balanceAcidityIssue: "是否存在酸度问题",
      balanceAcidityIssueType: "酸度问题是过多还是过少",
      acidityExcess: "过多",
      acidityDeficit: "过少",
      balanceReajust: "是否需要调整比例",
      otherElementName: "其他元素名称",
      otherElementNamePlaceholder: "名称",
      functionNoRoleElements: "是否有无功能元素",
      functionGaps: "是否存在功能缺口",
      functionRedundancy: "是否存在功能冗余",
      functionTooComplex: "功能分配是否过于复杂",
      functionReajust: "是否需要重新调整比例或功能",
      testScope: "设计对象",
      testElementType: "元素类型",
      testDate: "日期",
      testCode: "项目编码",
      testNumber: "测试编号",
      behaviorMatch: "是否符合 F 阶段预期",
      mainDeviation: "主要偏差观察",
      technicalComparison: "技术比较",
      chosenFinalTechnology: "最终选择的技术",
      choiceReason: "选择原因",
      passStabilityInPrototype: "整合原型在出餐中是否稳定",
      proportionEvaluation: "比例评估",
      structuralCoherenceEvaluation: "结构连贯性评估",
      kitchenDecision: "决策",
      creativeFoundationResponse: "是否回应创意基础",
      functionIdentifiable: "每个元素是否功能清晰",
      redundantElement: "冗余元素",
      serviceStructureMaintained: "真实服务中是否保持结构",
      intensityAdequacy: "菜单位置的强度是否合适",
      internalTastingResults: "内部品评结果",
      externalTastingResults: "外部品评结果",
      finalAdjustments: "最终调整",
      adjustmentType: "调整类型",
      verificationDecision: "决策",
      adjustmentDescription: "调整说明",
      menuPosition: "菜单位置",
      incorporationTiming: "进入菜单时机",
      finalStatus: "最终状态",
      decisionNotes: "决策说明",
      technicalSheet: "技术卡",
      standardizedProcess: "标准化流程",
      criticalControlPoints: "关键控制点",
      finalPhotoReference: "最终照片",
      documentationNotes: "文档备注"
    },
    decisions: {
      advance: "前进",
      adjust: "调整",
      rollback_to_d: "回退到 D",
      rollback_to_g: "回退到 G",
      approved_for_menu: "可进入菜单",
      pending_timing: "待时机进入",
      continue_development: "继续开发",
      archived: "归档"
    },
    adjustments: {
      none: "无调整",
      proportion_correction: "比例修正",
      technique_revision: "技术修订",
      simplification: "简化",
      element_removal: "删除元素",
      menu_position_change: "菜单位置调整"
    }
  },
  es: {
    htmlLang: "es",
    title: "Prototipo de la herramienta metodológica de Lera",
    brandEyebrow: "Metodología Lera",
    brandTitle: "Prototipo del flujo del plato",
    brandCopy: "",
    mainFlow: "Flujo principal",
    version: "Registro metodológico",
    reset: "Reiniciar datos del prototipo",
    dashboardEyebrow: "Panel del proyecto",
    untitledDish: "Plato sin nombre",
    homeLink: "Inicio",
    save: "Guardar",
    savePdf: "Guardar PDF",
    savePdfDone: "Panel PDF abierto",
    savePdfFailed: "Error al abrir PDF",
    exportResults: "Descargar todos los resultados",
    exportResultsDone: "Resultados exportados",
    exportResultsFailed: "Error al exportar",
    openProject: "Abrir",
    saved: "Guardado",
    opened: "Cargado",
    saveFailed: "Error al guardar en la base de datos",
    autoSavedAt: "Guardado automático: {time}",
    unsaved: "Sin guardar",
    autoSaving: "Guardado automático…",
    openFailed: "Error al cargar",
    savedRecordsEyebrow: "Registros guardados",
    savedRecordsTitle: "Registros",
    savedRecordsLoading: "Cargando registros guardados…",
    savedRecordsEmpty: "Sin registros",
    savedRecordsLoadAction: "Abrir",
    savedRecordsUpdatedAt: "Última actualización",
    savedRecordsStage: "Etapa actual",
    savedRecordsStatus: "Estado actual",
    restart: "Empezar de nuevo",
    rollback: "Rollback",
    formalRollback: "Rollback formal",
    review: "Revisar",
    skip: "Saltar por ahora",
    snapshot: "Resumen del proyecto",
    latestChange: "Registro de cambios",
    noLatestChange: "",
    stageWorkspace: "Espacio de etapa",
    previous: "Página anterior",
    next: "Siguiente",
    attributeButton: "Entrar en la rama por atributos",
    attributeNote: "Si los atributos están claros, pero la materia prima aún no está definida, se puede abrir la interfaz independiente por atributos.",
    attributeDialogTitle: "Rama por atributos",
    attributeDialogCopy: "Cuando los atributos buscados están claros, pero la materia prima aún no está definida, primero se define el atributo objetivo y después los mecanismos, las posibles materias primas y las combinaciones libres.",
    attributeEyebrow: "Rama por atributos",
    attributeStage1Title: "I. Definición del atributo objetivo",
    attributeStage2Title: "II. Descripción precisa del atributo",
    attributeStage3Title: "III. Identificación de mecanismos de realización",
    attributeStage4Title: "IV. Traducción a posibles materias primas",
    attributeStage5Title: "V. Combinaciones libres",
    attributeOutputTitle: "Resultado de salida",
    attributeTargetTypeLabel: "Tipo de resultado buscado",
    attributeCombinationsLabel: "Combinaciones posibles",
    attributeCodeLabel: "Código",
    attributeOutputLabel: "Resultado preparado para volver a la fase C",
    attributeOutputTargetLabel: "Elemento de la fase C al que se aplica",
    addAttribute: "Añadir atributo",
    addMechanism: "Añadir mecanismo",
    addCombination: "Añadir combinación",
    closeAttribute: "Cerrar",
    applyAttributeOutput: "Aplicar resultado",
    attributeApplied: "Resultado aplicado",
    attributeAlternativesLabel: "Opciones alternativas",
    possibilitiesTitle: "Lista de posibilidades",
    attributeTypes: {
      structural: "Estructural (textura / forma / estabilidad)",
      gustative: "Gustativo",
      aromatic: "Aromático",
      thermal: "Térmico",
      functional: "Funcional"
    },
    attributeLabels: {
      attribute: "Atributo",
      intensity: "Intensidad deseada",
      condition: "Condición",
      mechanism: "Mecanismo de realización",
      ingredientList: "Lista de posibles materias primas"
    },
    changeLog: "Registro de cambios",
    noChanges: "",
    rollbackEvent: "Registro de rollback",
    rollbackDialogTitle: "Crear un registro formal de rollback",
    rollbackDialogCopy: "Las modificaciones y ajustes del diseño del plato deben registrarse como un rollback; si solo se detecta un campo omitido o se quiere revisar el contenido, no hace falta registrarlo.",
    stageGuidance: "",
    reviewEyebrow: "Revisión de etapas",
    reviewDialogTitle: "Revisión",
    reviewDialogCopy: "La revisión solo sirve para consultar y detectar campos omitidos; si hace falta ajustar el diseño, se debe usar el botón de completar y registrar modificación.",
    closeReview: "Cerrar",
    registerSupplement: "Completar y registrar modificación",
    noReviewContent: "",
    sketchSummary: "Boceto",
    rollbackTarget: "Etapa de destino del rollback",
    rollbackReason: "Razón del cambio",
    rollbackDescription: "Descripción del cambio",
    affectedElements: "Elementos afectados",
    affectedTechniques: "Técnicas afectadas",
    cancel: "Cancelar",
    createRollback: "Crear registro formal de rollback",
    currentStage: "Etapa actual",
    projectOrigin: "Tipo de proyecto",
    projectOriginPlaceholder: "Seleccionar el tipo de proyecto",
    currentStatus: "Estado actual",
    activeCreativeBasis: "Fundamento creativo activo",
    activeProductBasis: "Materia prima P activa",
    nextRequiredAction: "Siguiente etapa",
    dishName: "Nombre del plato",
    sourceDishCode: "Código del plato original",
    sourceMethodologyCode: "Código metodológico principal original",
    projectOriginOptions: {
      new_dish: "Plato nuevo",
      existing_dish_update: "Ajuste o sustitución de un plato existente"
    },
    projectCode: "Código de proyecto",
    dishNamePlaceholder: "Nombre temporal del plato",
    sourceDishCodePlaceholder: "Código del plato terminado original",
    sourceMethodologyCodePlaceholder: "Código maestro metodológico original",
    creativeBasisPlaceholder: "FT3 / FP2 / FA3...",
    productBasisPlaceholder: "PA1 / PB2",
    nextActionPlaceholder: "¿Cuál es el siguiente paso?",
    methodologyPanelTitle: "Referencia metodológica",
    sketchModule: "Boceto",
    sketchMode: "Modo de boceto",
    sketchModeDraw: "Dibujar",
    sketchModeUpload: "Insertar imagen",
    sketchDescriptionPrompt: "Describir el perfil sensorial general del plato, incluyendo sabor, textura y aroma.",
    sketchHint: "Se puede hacer un boceto rápido a mano o subir una imagen de referencia.",
    sketchCanvasHint: "Mantener pulsado el ratón o el dedo para dibujar y guardar el boceto.",
    sketchUploadHint: "Selecciona una imagen local y guárdala en esta etapa.",
    sketchCanvasEmpty: "",
    sketchUploadEmpty: "",
    saveSketch: "Guardar boceto",
    clearSketch: "Limpiar lienzo",
    brushColor: "Color del pincel",
    customColor: "Color personalizado",
    undo: "Deshacer",
    redo: "Rehacer",
    removeImage: "Eliminar imagen",
    replaceImage: "Sustituir imagen",
    sketchSaved: "Boceto guardado",
    chooseImage: "Elegir imagen",
    genericSelect: "-",
    yes: "Sí",
    no: "No",
    partial: "Parcial",
    low: "Baja",
    adequate: "Adecuada",
    high: "Alta",
    draft: "Borrador",
    in_progress: "En progreso",
    needs_review: "Necesita revisión",
    validated: "Validado",
    archived: "Archivado",
    wholeDish: "Plato completo",
    singleElement: "Elemento",
    addKitchenTest: "Añadir prueba en cocina",
    remove: "Eliminar",
    archiveAction: "Archivo del plato",
    archivedSuccess: "El proyecto ha sido archivado.",
    stageJArchiveHint: "Esta etapa sirve para completar la documentación del plato y pasar al registro del plato final.",
    skippedStageSupplementTitle: "Información complementaria",
    skippedARecovery: "Complemento de la etapa A",
    skippedBRecovery: "Complemento de la etapa B",
    noKitchenTests: "Todavía no hay pruebas en cocina. Añade la primera.",
    kitchenTestSeries: "Serie de pruebas en cocina",
    kitchenTestSeriesCopy: "Cada prueba en cocina debe registrarse como una entrada independiente.",
    kitchenTest: "Prueba en cocina",
    stageSkipped: "Omitida",
    finalABReminder: "",
    rollbackOnlyFrom: "Selecciona la etapa a la que se quiere volver.",
    rollbackBanner: "La etapa actual contiene un registro formal de rollback de {from} a {to}. Motivo: {reason}.",
    latestChangeTemplate: "{recordLabel} {ref}\n{date}\nRollback: {from} -> {to}\nMotivo: {reason}",
    changeItemTemplate: "{recordLabel} {ref}\n{date}\nEtapa: {from} -> {to}\nMotivo: {reason}\nElementos: {elements}\nTécnicas: {techniques}",
    toolUseTemplate: "{recordLabel} {ref}\n{date}\nGeneración por atributos\nElemento: {target}\nSalida principal: {output}\nAlternativas: {alternatives}",
    rollbackRecordLabel: "Registro de rollback",
    toolUseRecordLabel: "Registro de uso de herramienta",
    stageSubtitles: {
      A: "Necesidad de la creación",
      B: "Fundamentos creativos",
      C: "Elementos, atributos y funciones",
      D: "Forma de presentación",
      E: "Técnicas adaptadas a cada elemento",
      F: "Prueba conceptual",
      G: "Pruebas en cocina",
      H: "Verificación y ajustes",
      I: "Decisión",
      J: "Documentación"
    },
    stageTitles: {
      A: "Necesidad de la creación del plato",
      B: "Fundamentos creativos",
      C: "Elementos, atributos y funciones",
      D: "Forma de presentar cada elemento",
      E: "Técnicas adaptadas a cada elemento",
      F: "Prueba conceptual",
      G: "Pruebas en cocina",
      H: "Verificación y ajustes",
      I: "Decisión",
      J: "Documentación"
    },
    aOptions: [
      {
        value: "operational_need",
        label: "Necesidad operativa",
        children: [
          { value: "cambio_de_estacion", label: "Cambio de estación" },
          { value: "cambio_disponibilidad_producto", label: "Cambio de disponibilidad del producto" },
          { value: "sustitucion_del_plato", label: "Sustitución del plato" },
          { value: "aprovechamiento_excedentes", label: "Aprovechamiento de excedentes" },
          { value: "equilibrio_del_menu", label: "Equilibrio del menú" },
          { value: "optimizacion_rentabilidad", label: "Optimización de rentabilidad" }
        ]
      },
      {
        value: "conceptual_need",
        label: "Necesidad conceptual",
        children: [
          { value: "nueva_tendencia_culinaria", label: "Nueva tendencia culinaria" },
          { value: "desarrollo_aprendizaje_reciente", label: "Desarrollo de aprendizaje reciente" },
          { value: "nueva_narrativa", label: "Nueva narrativa" },
          { value: "referencia_historica", label: "Referencia histórica" },
          { value: "exploracion_tecnica", label: "Exploración técnica" }
        ]
      },
      {
        value: "product_need",
        label: "Necesidad de producto",
        children: [
          { value: "entrada_inesperada_producto", label: "Entrada inesperada del producto" },
          { value: "producto_excepcional", label: "Producto excepcional" },
          { value: "producto_olvidado", label: "Producto olvidado" },
          { value: "producto_infrautilizado", label: "Producto infrautilizado" },
          { value: "relectura_producto_habitual", label: "Relectura de producto habitual" }
        ]
      },
      {
        value: "inspiration_accumulation",
        label: "Acumulación de inspiración",
        children: []
      }
    ],
    bOptions: [
      {
        value: "emotion",
        label: "Emoción",
        children: [
          { value: "divertido", label: "Divertido" }
        ]
      },
      {
        value: "memory",
        label: "Memoria",
        children: [
          { value: "memoria_casa_infancia", label: "Memoria de casa / infancia" },
          { value: "recuerdos_gustativos", label: "Recuerdos gustativos" }
        ]
      },
      {
        value: "learning",
        label: "Aprendizaje",
        children: [
          { value: "error_previo", label: "Error previo" },
          { value: "influencia_otra_cultura", label: "Influencia de otra cultura" },
          { value: "nuevas_combinaciones_sabores_texturas", label: "Nuevas combinaciones de sabores y texturas" },
          { value: "nuevas_combinaciones_ingredientes", label: "Nuevas combinaciones de ingredientes" },
          { value: "interaccion_otras_personas", label: "Interacción con otras personas" }
        ]
      },
      {
        value: "tradition",
        label: "Tradición",
        children: [
          { value: "tradicion_sin_tocar", label: "Tradición sin tocar" },
          { value: "tecnicas_ancestrales", label: "Técnicas ancestrales" },
          { value: "nuevas_formas_presentar", label: "Nuevas formas de presentar la tradición" },
          { value: "cambiar_elementos_receta_tradicional", label: "Cambio de elementos de una receta tradicional" }
        ]
      },
      {
        value: "product_logic",
        label: "Producto",
        children: [
          { value: "mejor_textura_cada_pieza", label: "Búsqueda de la mejor textura para cada pieza" },
          { value: "aprovechamiento_total", label: "Aprovechamiento total" },
          { value: "cambio_protagonista_plato", label: "Cambio de protagonista del plato" },
          { value: "busqueda_combinacion_atributos_sensoriales", label: "Búsqueda de la combinación de atributos sensoriales" }
        ]
      }
    ],
    elements: {
      protagonista: "Protagonista",
      secundario: "Secundario",
      liquido: "Elemento líquido",
      solido: "Elemento sólido",
      aromatico: "Elemento aromático",
      crujiente: "Elemento crujiente",
      graso: "Elemento graso",
      decorativo: "Elemento decorativo",
      otro: "Otro elemento"
    },
    labels: {
      selectElements: "Elementos",
      methodologyC: "Contenido metodológico",
      methodologyD: "Contenido metodológico",
      dishIdeaSummary: "Idea general del plato",
      dishIdeaPlaceholder: "Describir aquí la idea general del plato con el mayor nivel de detalle posible.",
      concreteProduct: "Producto concreto",
      flavor: "Sabor",
      texture: "Textura",
      aroma: "Aroma",
      temperature: "Temperatura",
      function: "Función",
      tasteIntensity: "Intensidad de sabor",
      textureIntensity: "Intensidad de textura",
      aromaIntensity: "Intensidad de aroma",
      enterIfSelected: "Al seleccionar el elemento, aparecerá el bloque para completar.",
      concept: "Concepto",
      visualization: "Visualización",
      balance: "Equilibrio",
      functionBlock: "Función",
      provisionalCombination: "Combinación provisional",
      relationToCreativeFoundation: "Relación con el fundamento creativo",
      sketchOrVisualization: "Boceto o visualización",
      visualVolumeRelation: "¿La relación de volúmenes entre los elementos está clara?",
      visualFocalPoint: "¿Existe un punto focal visual definido?",
      visualDistribution: "¿La distribución evita acumulaciones excesivas?",
      visualEmptyZones: "¿Existen zonas visuales vacías no intencionadas?",
      visualDirection: "¿La dirección visual del plato es coherente?",
      visualRepetition: "¿Hay repetición formal innecesaria?",
      visualReconfigure: "¿Es necesario reconfigurar los elementos?",
      generalFlavor: "Sabor",
      generalTexture: "Textura",
      generalAroma: "Aroma",
      aromaContributors: "Qué elementos aportan el aroma global",
      aromaNotes: "Observaciones",
      aromaNotesPlaceholder: "",
      balanceDominantAttribute: "¿Existe un atributo gustativo dominante claramente definido?",
      balanceHighIntensityOverlap: "¿Coinciden dos o más elementos de alta intensidad?",
      balanceSaturationRisk: "¿Se percibe riesgo de saturación sensorial?",
      balanceTextureMonotony: "¿La textura global presenta monotonía?",
      balanceThermalRelation: "¿La relación térmica está claramente definida?",
      balanceExcessFatRisk: "¿Existe riesgo de exceso graso?",
      balanceAcidityIssue: "¿Existe un problema de acidez?",
      balanceAcidityIssueType: "Si existe, ¿es por exceso o por defecto?",
      acidityExcess: "Exceso",
      acidityDeficit: "Defecto",
      balanceReajust: "¿Es necesario reajustar proporciones?",
      otherElementName: "Nombre del otro elemento",
      otherElementNamePlaceholder: "Nombre",
      functionNoRoleElements: "¿Hay elementos que no tienen función?",
      functionGaps: "¿Existen lagunas funcionales?",
      functionRedundancy: "¿Existe redundancia de funciones?",
      functionTooComplex: "¿La asignación de funciones es demasiado compleja?",
      functionReajust: "¿Es necesario reajustar proporciones o funciones?",
      testScope: "Objeto de diseño",
      testElementType: "Tipo de elemento",
      testDate: "Fecha",
      testCode: "Código de proyecto",
      testNumber: "NO. de prueba",
      behaviorMatch: "¿El comportamiento coincide con lo previsto en F?",
      mainDeviation: "Desviación principal observada",
      technicalComparison: "Comparación técnica",
      chosenFinalTechnology: "Técnica elegida",
      choiceReason: "Razón de elección",
      passStabilityInPrototype: "¿La estructura global se mantiene estable en pase?",
      proportionEvaluation: "Evaluación de proporciones",
      structuralCoherenceEvaluation: "Evaluación de coherencia estructural",
      kitchenDecision: "Decisión",
      creativeFoundationResponse: "¿El plato responde claramente al fundamento creativo?",
      functionIdentifiable: "¿Cada elemento cumple una función identificable?",
      redundantElement: "¿Existe elemento redundante? ¿Cuál?",
      serviceStructureMaintained: "¿El plato mantiene estructura durante servicio real?",
      intensityAdequacy: "¿La intensidad es adecuada para su posición prevista?",
      internalTastingResults: "Resultados de cata interna",
      externalTastingResults: "Resultados de cata externa",
      finalAdjustments: "Ajustes finales",
      adjustmentType: "Tipo de ajuste realizado",
      verificationDecision: "Decisión",
      adjustmentDescription: "Descripción breve del ajuste",
      menuPosition: "Posición en menú",
      incorporationTiming: "Momento de incorporación",
      finalStatus: "Estado final",
      decisionNotes: "Notas de decisión",
      technicalSheet: "Ficha técnica",
      standardizedProcess: "Proceso estandarizado",
      criticalControlPoints: "Puntos críticos de control",
      finalPhotoReference: "Foto final",
      documentationNotes: "Notas de documentación"
    },
    decisions: {
      advance: "Avanzar",
      adjust: "Ajustar",
      rollback_to_d: "Volver a D",
      rollback_to_g: "Volver a G",
      approved_for_menu: "Aprobado para menú",
      pending_timing: "Pendiente de momento",
      continue_development: "Continuar desarrollo",
      archived: "Archivar"
    },
    adjustments: {
      none: "Sin ajuste",
      proportion_correction: "Corrección de proporciones",
      technique_revision: "Revisión técnica",
      simplification: "Simplificación",
      element_removal: "Eliminación de elemento",
      menu_position_change: "Cambio de posición en menú"
    }
  }
};

let state = loadState();
let currentStageId = state.meta.currentStage || "A";
let currentLang = "es";
let saveFileHandle = null;
let autoSaveTimer = null;
let autoSaveInFlight = false;
let lastAutoSavedAt = "";
let saveStatusState = "idle";
let activeSketchCanvasContext = null;

const stageListEl = document.getElementById("stage-list");
const stageTitleEl = document.getElementById("stage-title");
const stageFormEl = document.getElementById("stage-form");
const rollbackDialogEl = document.getElementById("rollback-dialog");
const rollbackTargetEl = document.getElementById("rollback-target");
const rollbackBannerEl = document.getElementById("rollback-banner");
const reviewDialogEl = document.getElementById("review-dialog");
const reviewContentEl = document.getElementById("review-content");
const attributeDialogEl = document.getElementById("attribute-dialog");
const attributeFormEl = document.getElementById("attribute-form");
const latestChangeEl = document.getElementById("latest-change");
const versionIndicatorEl = document.getElementById("version-indicator");
const dashboardTitleEl = document.getElementById("dashboard-title");
const savedRecordsDialogEl = document.getElementById("saved-records-dialog");
const savedRecordsListEl = document.getElementById("saved-records-list");
const skipStageButtonEl = document.getElementById("skip-stage-button");
const previousStageButtonEl = document.getElementById("previous-stage-button");
const methodologyPanelEl = document.getElementById("methodology-panel");
const methodologyPanelContentEl = document.getElementById("methodology-panel-content");

setupMetaBindings();
setupActions();
render();
initializeMethodologyEditorFromUrl().catch((error) => {
  console.error(error);
  pulseSavedState("openFailed");
});

function setupMetaBindings() {
  bindMetaField("project-origin", "projectOrigin");
  bindMetaField("dish-name", "dishName");
  bindMetaField("project-code", "projectCode");
  bindMetaField("source-dish-code", "sourceDishCode");
  bindMetaField("source-methodology-code", "sourceMethodologyCode");
  bindMetaField("current-status", "currentStatus");
}

function bindMetaField(id, key) {
  document.getElementById(id).addEventListener("input", (event) => {
    const previousProjectCode = state.meta.projectCode;
    state.meta[key] = event.target.value;
    if (key === "projectCode") {
      const currentRecordCode = String(state.meta.currentVersion || "").trim();
      const previousRecordCode = String(previousProjectCode || "").trim();
      if (!currentRecordCode || currentRecordCode === previousRecordCode || currentRecordCode.startsWith(`${previousRecordCode}-`)) {
        state.meta.currentVersion = state.meta.projectCode;
      }
    }
    renderDashboard();
    saveState();
  });
}

function setupActions() {
  document.getElementById("open-button").addEventListener("click", handleOpenClick);
  document.getElementById("save-button").addEventListener("click", handleSaveClick);
  document.getElementById("save-pdf-button").addEventListener("click", handleSavePdfClick);
  document.getElementById("export-results-button").addEventListener("click", handleExportResultsClick);
  document.getElementById("restart-button").addEventListener("click", resetPrototype);

  previousStageButtonEl.addEventListener("click", () => moveStage(-1));
  document.getElementById("next-stage-button").addEventListener("click", () => moveStage(1));
  document.getElementById("stage-rollback-button").addEventListener("click", () => openRollbackDialog());
  document.getElementById("review-button").addEventListener("click", openReviewDialog);
  document.getElementById("cancel-rollback").addEventListener("click", () => rollbackDialogEl.close());
  document.getElementById("rollback-form").addEventListener("submit", handleRollbackSubmit);
  document.getElementById("close-review").addEventListener("click", () => reviewDialogEl.close());
  document.getElementById("close-attribute").addEventListener("click", () => attributeDialogEl.close());
  document.getElementById("apply-attribute-output").addEventListener("click", applyAttributeOutputToStageC);
  document.getElementById("attribute-add-row").addEventListener("click", addAttributeRow);
  document.getElementById("attribute-add-combination").addEventListener("click", addCombinationRow);
  document.getElementById("close-saved-records").addEventListener("click", () => savedRecordsDialogEl.close());
  skipStageButtonEl.addEventListener("click", skipCurrentStage);

  stageFormEl.addEventListener("change", handleStageChange);
  stageFormEl.addEventListener("input", handleStageInput);
  attributeFormEl.addEventListener("input", handleAttributeFormInput);
  attributeFormEl.addEventListener("change", handleAttributeFormChange);
}

async function handleOpenClick() {
  persistCurrentForm();
  await openSavedRecordsDialog();
}

async function initializeMethodologyEditorFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const projectCode = params.get("projectCode") || params.get("project_code") || "";
  const versionCode = params.get("versionCode") || params.get("version_code") || "";
  if (!projectCode) return;
  await loadSavedMethodologyRecord(projectCode, versionCode || projectCode);
}

async function handleSaveClick() {
  persistCurrentForm();
  try {
    setSaveStatus("saving");
    await persistMethodologyToDatabase();
    setSaveStatus("saved");
    pulseSavedState();
  } catch (error) {
    console.error(error);
    setSaveStatus("error");
    pulseSavedState("saveFailed");
  }
}

async function handleSavePdfClick() {
  persistCurrentForm();
  saveState();
  document.title = getPdfDocumentTitle();

  try {
    if (window.leraDesktop?.printCurrentWindow) {
      const result = await window.leraDesktop.printCurrentWindow();
      if (result?.status === "printed") {
        pulseButtonState("save-pdf-button", "savePdfDone", "savePdf");
        return;
      }
    }

    window.print();
    pulseButtonState("save-pdf-button", "savePdfDone", "savePdf");
  } catch (error) {
    console.error(error);
    pulseButtonState("save-pdf-button", "savePdfFailed", "savePdf");
  }
}

async function persistMethodologyToDatabase() {
  await ensureProjectIdentity();
  saveState();
  await syncMethodologyToDatabase();
  lastAutoSavedAt = new Date().toISOString();
}

async function openSavedRecordsDialog() {
  if (!savedRecordsDialogEl || !savedRecordsListEl) return;
  savedRecordsListEl.className = "saved-records-list empty-state";
  savedRecordsListEl.textContent = t("savedRecordsLoading");
  savedRecordsDialogEl.showModal();

  try {
    const response = await fetch("/api/methodology");
    if (!response.ok) throw new Error("Failed to load methodology list");
    const items = await response.json();
    renderSavedRecordsList(Array.isArray(items) ? items : []);
  } catch (error) {
    console.error(error);
    savedRecordsListEl.className = "saved-records-list empty-state";
    savedRecordsListEl.textContent = t("openFailed");
  }
}

function renderSavedRecordsList(items) {
  if (!savedRecordsListEl) return;
  savedRecordsListEl.innerHTML = "";

  if (!items.length) {
    savedRecordsListEl.className = "saved-records-list empty-state";
    savedRecordsListEl.textContent = t("savedRecordsEmpty");
    return;
  }

  savedRecordsListEl.className = "saved-records-list";
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "saved-record-card";
    card.innerHTML = `
      <div class="saved-record-head">
        <div>
          <strong>${escapeHtml(item.project_code || "-")}</strong>
          <h4>${escapeHtml(item.dish_name || t("untitledDish"))}</h4>
        </div>
        <button class="secondary-button" type="button">${escapeHtml(t("savedRecordsLoadAction"))}</button>
      </div>
      <div class="review-meta">
        <p>${escapeHtml(t("savedRecordsUpdatedAt"))}：${escapeHtml(formatDate(item.updated_at || item.created_at || ""))}</p>
        <p>Version：${escapeHtml(item.version_code || item.project_code || "-")}</p>
        <p>${escapeHtml(t("savedRecordsStage"))}：${escapeHtml(item.current_stage || "-")}</p>
        <p>${escapeHtml(t("savedRecordsStatus"))}：${escapeHtml(item.current_status || "-")}</p>
      </div>
    `;

    card.querySelector("button").addEventListener("click", async () => {
      await loadSavedMethodologyRecord(item.project_code, item.version_code || item.project_code);
    });

    savedRecordsListEl.appendChild(card);
  });
}

async function loadSavedMethodologyRecord(projectCode, versionCode) {
  try {
    const params = new URLSearchParams({ project_code: projectCode, version_code: versionCode });
    const response = await fetch(`/api/methodology?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to load methodology record");
    const payload = await response.json();
    if (!payload?.payload_json) throw new Error("Empty methodology payload");
    loadImportedState(payload.payload_json, {
      editingProjectCode: payload.project_code || projectCode,
      editingVersionCode: payload.version_code || versionCode
    });
    savedRecordsDialogEl?.close();
    pulseSavedState("opened");
  } catch (error) {
    console.error(error);
    pulseSavedState("openFailed");
  }
}

function handleExportResultsClick() {
  persistCurrentForm();
  saveState();

  try {
    exportResultsToExcel();
    pulseButtonState("export-results-button", "exportResultsDone", "exportResults");
  } catch (error) {
    console.error(error);
    pulseButtonState("export-results-button", "exportResultsFailed", "exportResults");
  }
}

function exportResultsToExcel() {
  const blob = buildXlsxBlob(getAnalysisWorkbookSheets());
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = getAnalysisFilename();
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function render() {
  state.meta.currentStage = currentStageId;
  state.meta.language = currentLang;
  persistUiLanguage(currentLang);
  applyDerivedMeta();
  applyStaticTranslations();
  renderStageList();
  renderDashboard();
  renderStageForm();
  renderMethodologyPanel();
  renderLatestChange();
  renderRollbackBanner();
  saveState();
  document.body.style.visibility = "visible";
}

function applyStaticTranslations() {
  document.documentElement.lang = t("htmlLang");
  document.title = getMethodologyWindowTitle();
  setText("brand-eyebrow", t("brandEyebrow"));
  setText("brand-title", t("brandTitle"));
  setText("home-link", t("homeLink"));
  setText("brand-copy", t("brandCopy"));
  setText("main-flow-title", t("mainFlow"));
  setText("version-title", t("version"));
  setText("dashboard-eyebrow", t("dashboardEyebrow"));
  setText("snapshot-title", t("snapshot"));
  setText("latest-change-title", t("latestChange"));
  setText("stage-workspace-eyebrow", t("stageWorkspace"));
  setText("review-button", t("review"));
  setText("stage-rollback-button", t("formalRollback"));
  setText("previous-stage-button", t("previous"));
  setText("next-stage-button", t("next"));
  setText("methodology-panel-title", t("methodologyPanelTitle"));
  setText("rollback-event-eyebrow", t("rollbackEvent"));
  setText("rollback-dialog-title", t("rollbackDialogTitle"));
  setText("rollback-dialog-copy", t("rollbackDialogCopy"));
  setText("review-eyebrow", t("reviewEyebrow"));
  setText("review-dialog-title", t("reviewDialogTitle"));
  setText("review-dialog-copy", t("reviewDialogCopy"));
  setText("attribute-eyebrow", t("attributeEyebrow"));
  setText("attribute-dialog-title", t("attributeDialogTitle"));
  setText("attribute-dialog-copy", t("attributeDialogCopy"));
  setText("attribute-stage-1-title", t("attributeStage1Title"));
  setText("attribute-stage-2-title", t("attributeStage2Title"));
  setText("attribute-stage-3-title", t("attributeStage3Title"));
  setText("attribute-stage-4-title", t("attributeStage4Title"));
  setText("attribute-stage-5-title", t("attributeStage5Title"));
  setText("attribute-output-title", t("attributeOutputTitle"));
  setText("attribute-target-type-label", t("attributeTargetTypeLabel"));
  setText("attribute-output-label", t("attributeOutputLabel"));
  setText("attribute-output-target-label", t("attributeOutputTargetLabel"));
  setText("attribute-add-row", t("addAttribute"));
  setText("attribute-add-combination", t("addCombination"));
  setText("attribute-alternatives-label", t("attributeAlternativesLabel"));
  setText("open-button", t("openProject"));
  setText("save-button", t("save"));
  setText("save-pdf-button", t("savePdf"));
  updateSaveStatusText();
  setText("saved-records-eyebrow", t("savedRecordsEyebrow"));
  setText("saved-records-title", t("savedRecordsTitle"));
  setText("close-saved-records", t("closeReview"));
  setText("export-results-button", t("exportResults"));
  setText("restart-button", t("restart"));
  setText("cancel-rollback", t("cancel"));
  setText("confirm-rollback", t("createRollback"));
  setText("close-review", t("closeReview"));
  setText("close-attribute", t("closeAttribute"));
  setText("apply-attribute-output", t("applyAttributeOutput"));
  setText("stage-guidance", t("stageGuidance"));
  setText("skip-stage-button", t("skip"));
  setLabelAndPlaceholder("project-origin", t("projectOrigin"), "");
  setLabelAndPlaceholder("dish-name", t("dishName"), t("dishNamePlaceholder"));
  setLabelAndPlaceholder("project-code", t("projectCode"), "2026-001");
  setLabelAndPlaceholder("source-dish-code", t("sourceDishCode"), t("sourceDishCodePlaceholder"));
  setLabelAndPlaceholder("source-methodology-code", t("sourceMethodologyCode"), t("sourceMethodologyCodePlaceholder"));
  setLabelAndPlaceholder("current-stage-display", t("currentStage"), "");
  setLabelAndPlaceholder("current-status", t("currentStatus"), "");
  setLabelAndPlaceholder("active-creative-basis", t("activeCreativeBasis"), t("creativeBasisPlaceholder"));
  setLabelAndPlaceholder("next-action", t("nextRequiredAction"), t("nextActionPlaceholder"));
  setLabelAndPlaceholder("rollback-target", t("rollbackTarget"), "");
  setLabelAndPlaceholder("rollback-reason", t("rollbackReason"), "");
  setLabelAndPlaceholder("rollback-description", t("rollbackDescription"), "");
  setLabelAndPlaceholder("rollback-elements", t("affectedElements"), "");
  setLabelAndPlaceholder("rollback-techniques", t("affectedTechniques"), "");
  fillStatusOptions();
  fillProjectOriginOptions();
  renderAttributeDialog();
}

function getMethodologyWindowTitle() {
  const dishName = sanitizeFilename(state.meta.dishName || "").replaceAll("-", " ");
  return dishName ? `${dishName} · ${t("brandTitle")}` : t("title");
}

function fillStatusOptions() {
  const select = document.getElementById("current-status");
  const currentValue = state.meta.currentStatus;
  select.innerHTML = "";
  ["draft", "in_progress", "needs_review", "validated", "archived"].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = t(value);
    select.appendChild(option);
  });
  select.value = currentValue;
}

function fillProjectOriginOptions() {
  const select = document.getElementById("project-origin");
  const currentValue = state.meta.projectOrigin || "new_dish";
  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = t("projectOriginPlaceholder");
  select.appendChild(placeholder);

  ["new_dish", "existing_dish_update"].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = t(`projectOriginOptions.${value}`);
    select.appendChild(option);
  });

  select.value = currentValue;
}

function renderStageList() {
  stageListEl.innerHTML = "";
  stageIds.forEach((stageId) => {
    const chip = document.createElement("div");
    chip.className = `stage-chip${stageId === currentStageId ? " active" : ""}`;
    chip.innerHTML = `<strong>${stageId}. ${t(`stageSubtitles.${stageId}`)}</strong><small>${t(`stageTitles.${stageId}`)}</small>`;
    if (stageId === currentStageId) chip.setAttribute("aria-current", "step");
    stageListEl.appendChild(chip);
  });
}

function renderDashboard() {
  dashboardTitleEl.textContent = state.meta.dishName || t("untitledDish");
  versionIndicatorEl.textContent = state.meta.currentVersion;
  document.getElementById("project-origin").value = state.meta.projectOrigin || "new_dish";
  document.getElementById("dish-name").value = state.meta.dishName;
  document.getElementById("project-code").value = state.meta.projectCode;
  document.getElementById("source-dish-code").value = state.meta.sourceDishCode || "";
  document.getElementById("source-methodology-code").value = state.meta.sourceMethodologyCode || "";
  document.getElementById("current-stage-display").value = `${currentStageId}. ${t(`stageTitles.${currentStageId}`)}`;
  document.getElementById("current-status").value = state.meta.currentStatus;
  document.getElementById("active-creative-basis").value = state.meta.activeCreativeBasis;
  document.getElementById("next-action").value = state.meta.nextAction;
  syncExistingDishFieldsVisibility();
}

function syncExistingDishFieldsVisibility() {
  const isExistingDishUpdate = state.meta.projectOrigin === "existing_dish_update";
  document.getElementById("source-dish-code-wrapper").classList.toggle("hidden", !isExistingDishUpdate);
  document.getElementById("source-methodology-code-wrapper").classList.toggle("hidden", !isExistingDishUpdate);
}

function renderStageForm() {
  stageTitleEl.textContent = `${currentStageId}. ${t(`stageTitles.${currentStageId}`)}`;
  stageFormEl.innerHTML = "";
  skipStageButtonEl.hidden = !skipEnabledStages.has(currentStageId);
  previousStageButtonEl.hidden = !["B", "C"].includes(currentStageId);
  document.getElementById("review-button").hidden = !["C", "D", "E", "F", "G", "H", "I", "J"].includes(currentStageId);
  document.getElementById("stage-rollback-button").hidden = ["A", "B"].includes(currentStageId);
  document.getElementById("next-stage-button").hidden = ["A", "B"].includes(currentStageId);
  updateABAdvanceButton();

  if (currentStageId === "A") {
    renderMultiSelectStage("A", t("aOptions"));
    return;
  }
  if (currentStageId === "B") {
    renderMultiSelectStage("B", t("bOptions"));
    return;
  }
  if (currentStageId === "C") {
    renderStageC();
    return;
  }
  if (currentStageId === "D") {
    renderElementDrivenStage("D", "presentation");
    return;
  }
  if (currentStageId === "E") {
    renderElementDrivenStage("E", "technique");
    return;
  }
  if (currentStageId === "F") {
    renderStageF();
    return;
  }
  if (currentStageId === "G") {
    renderStageG();
    return;
  }
  if (currentStageId === "H") {
    renderStageH();
    return;
  }
  if (currentStageId === "I") {
    renderSimpleStage(getStageIFields(), "");
    return;
  }
  renderStageJ();
}

function renderMultiSelectStage(stageId, options) {
  const fieldset = createFieldset("");
  const stageState = getStageState(stageId);
  const selected = stageState.selected || [];
  options.forEach((group) => {
    const groupFieldset = createFieldset(group.code ? `${group.label} (${group.code})` : group.label);
    groupFieldset.appendChild(createChoiceGroup("", group.children || [], selected, `${stageId}-selection`, true));
    const otherRow = document.createElement("div");
    otherRow.className = "field-grid two inline-toggle-row";
    otherRow.appendChild(createField({
      type: "checkbox-group",
      name: `${stageId}_other_toggle_${group.value}`,
      label: currentLang === "zh" ? "其他" : "Otro",
      options: [{ value: `${group.value}_other`, label: currentLang === "zh" ? "其他" : "Otro" }]
    }, stageState[`${stageId}_other_toggle_${group.value}`] || []));
    const otherInput = createField({
      type: "text",
      name: `${group.value}_other_text`,
      label: currentLang === "zh" ? "其他内容" : "Otro contenido"
    }, stageState[`${group.value}_other_text`] || "");
    otherInput.classList.toggle("hidden", !hasOtherSelection(stageId, group.value));
    otherRow.appendChild(otherInput);
    groupFieldset.appendChild(otherRow);
    fieldset.appendChild(groupFieldset);
  });
  if (getStageState(stageId).skipped) {
    fieldset.appendChild(createHint(t("stageSkipped")));
  }
  stageFormEl.appendChild(fieldset);
}

function renderStageC() {
  const selectionFieldset = createFieldset(t("labels.selectElements"));
  selectionFieldset.appendChild(createHint(t("labels.enterIfSelected")));
  selectionFieldset.appendChild(createChoiceGroup("", elementOptions(), getSelectedElements(), "c-elements", true));
  const branchButton = document.createElement("button");
  branchButton.type = "button";
  branchButton.textContent = t("attributeButton");
  branchButton.addEventListener("click", openAttributeDialog);
  selectionFieldset.appendChild(branchButton);
  selectionFieldset.appendChild(createHint(t("attributeNote")));
  stageFormEl.appendChild(selectionFieldset);

  const summaryLabel = document.createElement("label");
  summaryLabel.textContent = t("labels.dishIdeaSummary");
  const summary = document.createElement("textarea");
  summary.name = "dishIdeaSummary";
  summary.rows = 4;
  summary.placeholder = t("labels.dishIdeaPlaceholder");
  summary.value = getStageValue("C", "dishIdeaSummary");
  summaryLabel.appendChild(summary);
  stageFormEl.appendChild(summaryLabel);

  getSelectedElements().forEach((key) => {
    const fieldsetTitle = key === "otro"
      ? getStageValue("C", "otro_customName") || t(`elements.${key}`)
      : t(`elements.${key}`);
    const fieldset = createFieldset(fieldsetTitle);
    if (key === "otro") {
      fieldset.appendChild(createField({
        type: "text",
        name: "otro_customName",
        label: t("labels.otherElementName"),
        placeholder: t("labels.otherElementNamePlaceholder")
      }, getStageValue("C", "otro_customName")));
    }
    const grid = document.createElement("div");
    grid.className = "field-grid two";
    elementFields(key).forEach((field) => grid.appendChild(createField(field, getStageValue("C", field.name))));
    fieldset.appendChild(grid);
    const possibilities = getAttributePossibilitiesForTarget(key);
    if (possibilities.length) {
      const listLabel = document.createElement("label");
      listLabel.textContent = t("possibilitiesTitle");
      const area = document.createElement("textarea");
      area.rows = Math.max(4, possibilities.length + 2);
      area.value = possibilities.join("\n");
      area.readOnly = true;
      listLabel.appendChild(area);
      fieldset.appendChild(listLabel);
    }
    stageFormEl.appendChild(fieldset);
  });
}

function renderAttributeDialog() {
  renderAttributeTargetTypes();
  renderAttributeOutputTarget();
  renderAttributeDescriptionGrid();
  renderAttributeMechanismGrid();
  renderAttributeIngredientGrid();
  renderAttributeCombinations();
  renderAttributeBranchOutput();
}

function renderAttributeTargetTypes() {
  const container = document.getElementById("attribute-target-types");
  container.className = "attribute-target-group";
  container.innerHTML = "";
  const stageState = getAttributeBranchState();
  ["structural", "gustative", "aromatic", "thermal", "functional"].forEach((value) => {
    const option = document.createElement("label");
    option.className = "choice-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "targetTypes";
    input.value = value;
    input.checked = (stageState.targetTypes || []).includes(value);
    option.appendChild(input);
    option.append(t(`attributeTypes.${value}`));
    container.appendChild(option);
  });
}

function renderAttributeDescriptionGrid() {
  const container = document.getElementById("attribute-description-grid");
  container.innerHTML = "";
  getAttributeRows().forEach((index) => {
    const row = document.createElement("div");
    row.className = "attribute-row";
    row.appendChild(createAttributeRowTitle(index));
    const grid = document.createElement("div");
    grid.className = "attribute-row-grid";
    grid.appendChild(createAttributeField(`attr_${index}_name`, t("attributeLabels.attribute")));
    grid.appendChild(createAttributeField(`attr_${index}_intensity`, t("attributeLabels.intensity")));
    grid.appendChild(createAttributeField(`attr_${index}_condition`, t("attributeLabels.condition")));
    row.appendChild(grid);
    container.appendChild(row);
  });
}

function renderAttributeMechanismGrid() {
  const container = document.getElementById("attribute-mechanism-grid");
  container.innerHTML = "";
  getAttributeRows().forEach((index) => {
    const row = document.createElement("div");
    row.className = "attribute-row";
    row.appendChild(createAttributeRowHead(index, getAttributeBranchValue(`attr_${index}_name`), true));
    const stack = document.createElement("div");
    stack.className = "attribute-substack";
    getMechanismRows(index).forEach((slot) => {
      stack.appendChild(createAttributeField(`attr_${index}_mechanism_${slot}`, `${t("attributeLabels.mechanism")} ${slot}`));
    });
    row.appendChild(stack);
    container.appendChild(row);
  });
}

function renderAttributeIngredientGrid() {
  const container = document.getElementById("attribute-ingredient-grid");
  container.innerHTML = "";
  getAttributeRows().forEach((index) => {
    const row = document.createElement("div");
    row.className = "attribute-row";
    row.appendChild(createAttributeRowTitle(index, getAttributeBranchValue(`attr_${index}_name`)));
    const stack = document.createElement("div");
    stack.className = "attribute-substack";
    getMechanismRows(index).forEach((slot) => {
      const mechanismValue = getAttributeBranchValue(`attr_${index}_mechanism_${slot}`);
      stack.appendChild(
        createAttributeAreaField(
          `attr_${index}_ingredient_list_${slot}`,
          `${t("attributeLabels.ingredientList")} ${slot}`,
          mechanismValue
            ? `${t("attributeLabels.mechanism")} ${slot}: ${mechanismValue}`
            : `${t("attributeLabels.mechanism")} ${slot}`
        )
      );
    });
    row.appendChild(stack);
    container.appendChild(row);
  });
}

function renderAttributeBranchOutput() {
  renderAttributeOutputOptions();
}

function renderAttributeCombinations() {
  const container = document.getElementById("attribute-combinations-list");
  container.innerHTML = "";
  getCombinationRows().forEach((index) => {
    const row = document.createElement("div");
    row.className = "attribute-combination-row";
    row.appendChild(createReadonlyAttributeField(`combo_${index}_code`, t("attributeCodeLabel"), getCombinationCode(index)));
    row.appendChild(createAttributeAreaField(`combo_${index}_value`, t("attributeCombinationsLabel"), ""));
    container.appendChild(row);
  });
}

function renderAttributeOutputOptions() {
  const options = getCombinationOptions();
  const select = document.getElementById("attribute-output");
  const currentValue = getAttributeBranchValue("outputSummary");
  select.innerHTML = "";
  yesSelectBase(select);
  options.forEach((option) => {
    const optionEl = document.createElement("option");
    optionEl.value = option.code;
    optionEl.textContent = option.label;
    select.appendChild(optionEl);
  });
  select.value = currentValue;

  const alternatives = document.getElementById("attribute-alternatives");
  alternatives.className = "attribute-target-group";
  alternatives.innerHTML = "";
  const selectedAlternatives = getAttributeBranchState().alternativeOutputs || [];
  options
    .filter((option) => option.code !== currentValue)
    .forEach((option) => {
    const label = document.createElement("label");
    label.className = "choice-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "alternativeOutputs";
    input.value = option.code;
    input.checked = selectedAlternatives.includes(option.code);
    label.appendChild(input);
    label.append(option.label);
    alternatives.appendChild(label);
    });
}

function createAttributeRowTitle(index, value = "") {
  const title = document.createElement("h5");
  title.dataset.attributeIndex = String(index);
  title.dataset.role = "attribute-row-title";
  title.textContent = formatAttributeRowTitle(index, value);
  return title;
}

function createAttributeRowHead(index, value = "", withButton = false) {
  const head = document.createElement("div");
  head.className = "attribute-row-head";
  head.appendChild(createAttributeRowTitle(index, value));
  if (withButton) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary-button";
    button.textContent = t("addMechanism");
    button.addEventListener("click", () => addMechanismRow(index));
    head.appendChild(button);
  }
  return head;
}

function createAttributeField(name, labelText) {
  const label = document.createElement("label");
  label.textContent = labelText;
  const input = document.createElement("input");
  input.type = "text";
  input.name = name;
  input.value = getAttributeBranchValue(name);
  label.appendChild(input);
  return label;
}

function createReadonlyAttributeField(name, labelText, value) {
  const label = document.createElement("label");
  label.textContent = labelText;
  const input = document.createElement("input");
  input.type = "text";
  input.name = name;
  input.value = value;
  input.readOnly = true;
  label.appendChild(input);
  return label;
}

function createAttributeAreaField(name, labelText, captureText) {
  const label = document.createElement("label");
  label.textContent = labelText;
  const capture = createHint(captureText || "");
  capture.dataset.role = "attribute-capture";
  capture.dataset.fieldName = name;
  label.appendChild(capture);
  const area = document.createElement("textarea");
  area.name = name;
  area.rows = 3;
  area.value = getAttributeBranchValue(name);
  label.appendChild(area);
  return label;
}

function renderAttributeOutputTarget() {
  const select = document.getElementById("attribute-output-target");
  const currentValue = getAttributeBranchValue("outputTarget");
  select.innerHTML = "";
  yesSelectBase(select);
  getSelectedElements().forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = t(`elements.${key}`);
    select.appendChild(option);
  });
  select.value = currentValue;
}

function renderElementDrivenStage(stageId, mode) {
  const selected = getSelectedElements();
  if (!selected.length) {
    stageFormEl.appendChild(createHint(currentLang === "zh" ? "未选元素" : "Sin elementos"));
    return;
  }

  selected.forEach((key) => {
    const product = getStageValue("C", `${key}_product`) || "-";
    const title = `${t(`elements.${key}`)} - ${product}`;
    const fieldset = createFieldset(title);
    const label = document.createElement("label");
    label.textContent = stageId === "D"
      ? (currentLang === "zh" ? "呈现方式" : "Forma de presentación")
      : (currentLang === "zh" ? "技术方案" : "Técnicas");
    const textarea = document.createElement("textarea");
    textarea.name = `${mode}_${key}`;
    textarea.rows = 4;
    textarea.value = getStageValue(stageId, `${mode}_${key}`);
    label.appendChild(textarea);
    fieldset.appendChild(label);
    stageFormEl.appendChild(fieldset);
  });
}

function renderStageF() {
  renderSketchModule();

  renderBinaryQuestionGroup(t("labels.visualization"), [
    binaryField("visualVolumeRelation"),
    binaryField("visualFocalPoint"),
    binaryField("visualDistribution"),
    binaryField("visualEmptyZones"),
    binaryField("visualDirection"),
    binaryField("visualRepetition"),
    binaryField("visualReconfigure", "C")
  ]);

  renderStageFBalanceSection();

  renderBinaryQuestionGroup(t("labels.functionBlock"), [
    binaryField("functionNoRoleElements"),
    binaryField("functionGaps"),
    binaryField("functionRedundancy"),
    binaryField("functionTooComplex"),
    binaryField("functionReajust", "C")
  ]);
}

function renderStageFBalanceSection() {
  const fieldset = createFieldset(t("labels.balance"));
  fieldset.appendChild(createHint(t("sketchDescriptionPrompt")));

  const grid = document.createElement("div");
  grid.className = "field-grid two";
  [
    { type: "textarea", name: "generalFlavor", label: t("labels.generalFlavor"), rows: 3 },
    { type: "textarea", name: "generalTexture", label: t("labels.generalTexture"), rows: 3 },
    { type: "textarea", name: "generalAroma", label: t("labels.generalAroma"), rows: 3 }
  ].forEach((field) => grid.appendChild(createField(field, getStageValue("F", field.name))));

  fieldset.appendChild(grid);
  fieldset.appendChild(createField({
    type: "checkbox-group",
    name: "aromaContributors",
    label: t("labels.aromaContributors"),
    options: getAromaContributorOptions()
  }, getStageValue("F", "aromaContributors")));
  fieldset.appendChild(createField({
    type: "textarea",
    name: "aromaNotes",
    label: t("labels.aromaNotes"),
    placeholder: t("labels.aromaNotesPlaceholder"),
    rows: 3
  }, getStageValue("F", "aromaNotes")));
  [
    binaryField("balanceDominantAttribute"),
    binaryField("balanceHighIntensityOverlap"),
    binaryField("balanceSaturationRisk"),
    binaryField("balanceTextureMonotony"),
    binaryField("balanceThermalRelation"),
    binaryField("balanceExcessFatRisk"),
    binaryField("balanceReajust", "C")
  ].forEach((field) => {
    fieldset.appendChild(createField({
      type: "radio-group",
      name: field.name,
      label: field.label,
      options: yesNoOptions(),
      rollbackTarget: field.rollbackTarget
    }, getStageValue("F", field.name)));
  });

  const acidityIssueValue = getStageValue("F", "balanceAcidityIssue");
  fieldset.appendChild(createField({
    type: "radio-group",
    name: "balanceAcidityIssue",
    label: t("labels.balanceAcidityIssue"),
    options: yesNoOptions()
  }, acidityIssueValue));

  if (acidityIssueValue === "yes") {
    fieldset.appendChild(createField({
      type: "checkbox-group",
      name: "balanceAcidityIssueType",
      label: t("labels.balanceAcidityIssueType"),
      options: [
        { value: "excess", label: t("labels.acidityExcess") },
        { value: "deficit", label: t("labels.acidityDeficit") }
      ]
    }, getStageValue("F", "balanceAcidityIssueType")));
  }

  stageFormEl.appendChild(fieldset);
}

function getAromaContributorOptions() {
  return getSelectedElements().map((key) => {
    const product = getStageValue("C", `${key}_product`) || t(`elements.${key}`);
    const customTitle = key === "otro" ? getStageValue("C", "otro_customName") || t(`elements.${key}`) : t(`elements.${key}`);
    return {
      value: key,
      label: `${customTitle} - ${product}`
    };
  });
}

function renderSketchModule() {
  const fieldset = createFieldset(t("sketchModule"));
  fieldset.classList.add("sketch-module");
  fieldset.appendChild(createHint(t("sketchHint")));

  const mode = getStageValue("F", "sketchMode") || "draw";
  fieldset.appendChild(createField({
    type: "radio-group",
    name: "sketchMode",
    label: t("sketchMode"),
    options: [
      { value: "draw", label: t("sketchModeDraw") },
      { value: "upload", label: t("sketchModeUpload") }
    ]
  }, mode));

  if (mode === "upload") {
    fieldset.appendChild(createSketchUploadPanel());
  } else {
    fieldset.appendChild(createSketchCanvasPanel());
  }

  stageFormEl.appendChild(fieldset);
}

function createSketchCanvasPanel() {
  const wrapper = document.createElement("div");
  wrapper.className = "sketch-canvas-wrap";
  wrapper.appendChild(createHint(t("sketchCanvasHint")));

  const selectedColor = getStageValue("F", "sketchBrushColor") || "#6f2c19";
  wrapper.appendChild(createSketchColorControls(selectedColor));

  const canvas = document.createElement("canvas");
  canvas.className = "sketch-canvas";
  canvas.width = 1280;
  canvas.height = 720;
  wrapper.appendChild(canvas);

  const toolbar = document.createElement("div");
  toolbar.className = "sketch-toolbar";

  const undoButton = document.createElement("button");
  undoButton.type = "button";
  undoButton.className = "secondary-button icon-button";
  undoButton.textContent = "↶";
  undoButton.title = t("undo");
  undoButton.setAttribute("aria-label", t("undo"));
  toolbar.appendChild(undoButton);

  const redoButton = document.createElement("button");
  redoButton.type = "button";
  redoButton.className = "secondary-button icon-button";
  redoButton.textContent = "↷";
  redoButton.title = t("redo");
  redoButton.setAttribute("aria-label", t("redo"));
  toolbar.appendChild(redoButton);

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = t("saveSketch");
  saveButton.addEventListener("click", () => saveCanvasSketch(canvas));
  toolbar.appendChild(saveButton);

  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "secondary-button";
  clearButton.textContent = t("clearSketch");
  clearButton.addEventListener("click", () => clearCanvasSketch(canvas));
  toolbar.appendChild(clearButton);

  const savedCanvas = getStageValue("F", "sketchCanvasData");
  if (savedCanvas) {
    const status = document.createElement("span");
    status.className = "status-chip";
    status.textContent = t("sketchSaved");
    toolbar.appendChild(status);
  } else {
    toolbar.appendChild(createHint(t("sketchCanvasEmpty")));
  }

  wrapper.appendChild(toolbar);
  setupSketchCanvas(canvas, savedCanvas, selectedColor, undoButton, redoButton);
  return wrapper;
}

function createSketchColorControls(selectedColor) {
  const colors = ["#6f2c19", "#1f1b18", "#9f3d24", "#2e6b4d", "#3a5771", "#8f6b00"];
  const row = document.createElement("div");
  row.className = "sketch-color-row";

  const label = document.createElement("span");
  label.className = "sketch-color-label";
  label.textContent = t("brushColor");
  row.appendChild(label);

  const list = document.createElement("div");
  list.className = "color-swatch-list";

  colors.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `color-swatch${selectedColor.toLowerCase() === color.toLowerCase() ? " active" : ""}`;
    button.style.background = color;
    button.dataset.color = color.toLowerCase();
    button.setAttribute("aria-label", `${t("brushColor")} ${color}`);
    button.addEventListener("click", () => setSketchBrushColor(color));
    list.appendChild(button);
  });

  row.appendChild(list);

  const pickerLabel = document.createElement("span");
  pickerLabel.className = "sketch-color-label";
  pickerLabel.textContent = t("customColor");
  row.appendChild(pickerLabel);

  const picker = document.createElement("input");
  picker.type = "color";
  picker.className = "color-picker";
  picker.id = "sketch-custom-color-picker";
  picker.value = selectedColor;
  picker.setAttribute("aria-label", t("customColor"));
  picker.addEventListener("input", (event) => setSketchBrushColor(event.target.value));
  row.appendChild(picker);

  return row;
}

function createSketchUploadPanel() {
  const wrapper = document.createElement("div");
  wrapper.className = "sketch-preview";
  wrapper.appendChild(createHint(t("sketchUploadHint")));

  const inputRow = document.createElement("div");
  inputRow.className = "file-input-row";

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.id = "sketch-upload-input";
  input.addEventListener("change", (event) => {
    event.stopPropagation();
    handleSketchImageUpload(event);
  });
  inputRow.appendChild(input);

  const trigger = document.createElement("label");
  trigger.className = "secondary-button";
  trigger.htmlFor = "sketch-upload-input";
  trigger.textContent = getStageValue("F", "sketchUploadData") ? t("replaceImage") : t("chooseImage");
  inputRow.appendChild(trigger);

  if (getStageValue("F", "sketchUploadData")) {
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "secondary-button";
    remove.textContent = t("removeImage");
    remove.addEventListener("click", removeSketchImage);
    inputRow.appendChild(remove);
  }

  wrapper.appendChild(inputRow);

  const imageData = getStageValue("F", "sketchUploadData");
  if (imageData) {
    const image = document.createElement("img");
    image.src = imageData;
    image.alt = t("sketchModule");
    wrapper.appendChild(image);
  } else {
    wrapper.appendChild(createHint(t("sketchUploadEmpty")));
  }

  return wrapper;
}

function renderStageG() {
  const intro = createFieldset(t("kitchenTestSeries"));
  intro.appendChild(createHint(t("kitchenTestSeriesCopy")));
  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "ghost-button";
  addButton.textContent = t("addKitchenTest");
  addButton.addEventListener("click", addKitchenTest);
  intro.appendChild(addButton);
  stageFormEl.appendChild(intro);

  const tests = getKitchenTests();
  if (!tests.length) {
    stageFormEl.appendChild(createHint(t("noKitchenTests")));
    return;
  }

  tests.forEach((test, index) => {
    const fieldset = createFieldset(`${t("kitchenTest")} ${index + 1}`);
    const header = document.createElement("div");
    header.className = "repeatable-card-header";
    const meta = document.createElement("p");
    meta.className = "support-copy";
    meta.textContent = `${test.testDate || (currentLang === "zh" ? "未填日期" : "Sin fecha")} | ${scopeLabel(test.testScope)}${test.testElementType ? ` | ${t(`elements.${test.testElementType}`)}` : ""}`;
    header.appendChild(meta);
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "ghost-button";
    removeButton.textContent = t("remove");
    removeButton.addEventListener("click", () => removeKitchenTest(index));
    header.appendChild(removeButton);
    fieldset.appendChild(header);

    fieldset.appendChild(createRepeatableChoiceGroup(index, "testScope", t("labels.testScope"), [
      { value: "whole_dish", label: t("wholeDish") },
      { value: "element", label: t("singleElement") }
    ], test.testScope, false));

    if (test.testScope === "element") {
      const label = document.createElement("label");
      label.textContent = t("labels.testElementType");
      const select = document.createElement("select");
      select.name = "testElementType";
      select.dataset.testIndex = String(index);
      yesSelectBase(select);
      elementOptions().forEach((option) => {
        const optionEl = document.createElement("option");
        optionEl.value = option.value;
        optionEl.textContent = option.label;
        select.appendChild(optionEl);
      });
      select.value = test.testElementType || "";
      label.appendChild(select);
      fieldset.appendChild(label);
    }

    const grid = document.createElement("div");
    grid.className = "field-grid two";
    kitchenFields().forEach((field) => grid.appendChild(createRepeatableField(field, test[field.name] || "", index)));
    fieldset.appendChild(grid);
    fieldset.appendChild(createRepeatableChoiceGroup(index, "kitchenDecision", t("labels.kitchenDecision"), [
      { value: "advance", label: t("decisions.advance") },
      { value: "rollback_to_d", label: t("decisions.rollback_to_d") }
    ], test.kitchenDecision, false, "D"));
    stageFormEl.appendChild(fieldset);
  });
}

function renderStageH() {
  renderSimpleStage([
    { type: "radio-group", name: "creativeFoundationResponse", label: t("labels.creativeFoundationResponse"), options: yesNoOptions(true) },
    { type: "radio-group", name: "functionIdentifiable", label: t("labels.functionIdentifiable"), options: yesNoOptions() },
    { type: "text", name: "redundantElement", label: t("labels.redundantElement") },
    { type: "radio-group", name: "serviceStructureMaintained", label: t("labels.serviceStructureMaintained"), options: yesNoOptions() },
    { type: "radio-group", name: "intensityAdequacy", label: t("labels.intensityAdequacy"), options: intensityOptions() },
    { type: "textarea", name: "internalTastingResults", label: t("labels.internalTastingResults"), rows: 3 },
    { type: "textarea", name: "externalTastingResults", label: t("labels.externalTastingResults"), rows: 3 },
    { type: "textarea", name: "finalAdjustments", label: t("labels.finalAdjustments"), rows: 3 }
  ], t("labels.functionBlock"));

  const fieldset = createFieldset("");
  fieldset.appendChild(createField({
    type: "select",
    name: "adjustmentType",
    label: t("labels.adjustmentType"),
    options: adjustmentOptions()
  }, getStageValue("H", "adjustmentType")));

  fieldset.appendChild(createField({
    type: "radio-group",
    name: "verificationDecision",
    label: t("labels.verificationDecision"),
    options: [
      { value: "advance", label: t("decisions.advance") },
      { value: "adjust", label: t("decisions.adjust") },
      { value: "rollback_to_g", label: t("decisions.rollback_to_g") }
    ],
    rollbackTarget: "G"
  }, getStageValue("H", "verificationDecision")));

  fieldset.appendChild(createField({
    type: "textarea",
    name: "adjustmentDescription",
    label: t("labels.adjustmentDescription"),
    rows: 3
  }, getStageValue("H", "adjustmentDescription")));
  stageFormEl.appendChild(fieldset);
}

function renderStageJ() {
  const fieldset = createFieldset("");
  fieldset.appendChild(createHint(t("stageJArchiveHint")));

  if (getStageState("A").skipped || getStageState("B").skipped) {
    fieldset.appendChild(createHint(t("finalABReminder")));

    const supplementFieldset = createFieldset(t("skippedStageSupplementTitle"));
    const grid = document.createElement("div");
    grid.className = "field-grid two";

    if (getStageState("A").skipped) {
      grid.appendChild(createField({
        type: "textarea",
        name: "skippedARecovery",
        label: t("skippedARecovery"),
        rows: 4
      }, getStageValue("J", "skippedARecovery")));
    }

    if (getStageState("B").skipped) {
      grid.appendChild(createField({
        type: "textarea",
        name: "skippedBRecovery",
        label: t("skippedBRecovery"),
        rows: 4
      }, getStageValue("J", "skippedBRecovery")));
    }

    supplementFieldset.appendChild(grid);
    fieldset.appendChild(supplementFieldset);
  }

  const actions = document.createElement("div");
  actions.className = "archive-actions";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "archive-button";
  button.textContent = t("archiveAction");
  button.addEventListener("click", archiveDishProject);
  actions.appendChild(button);

  fieldset.appendChild(actions);

  if (state.meta.currentStatus === "archived") {
    const status = document.createElement("p");
    status.className = "archive-status";
    status.textContent = t("archivedSuccess");
    fieldset.appendChild(status);
  }

  stageFormEl.appendChild(fieldset);
}

function renderSimpleStage(fields, legend) {
  const fieldset = createFieldset(legend === undefined ? t(`stageTitles.${currentStageId}`) : legend);
  const grid = document.createElement("div");
  grid.className = "field-grid two";
  fields.forEach((field) => grid.appendChild(createField(field, getStageValue(currentStageId, field.name))));
  fieldset.appendChild(grid);
  stageFormEl.appendChild(fieldset);
}

function renderBinaryQuestionGroup(title, fields, appendToLast = false) {
  const fieldset = createFieldset(title);
  if (appendToLast && stageFormEl.lastElementChild?.tagName === "FIELDSET") {
    stageFormEl.lastElementChild.appendChild(fieldset);
    return appendBinaryFields(fieldset, fields);
  }
  appendBinaryFields(fieldset, fields);
  stageFormEl.appendChild(fieldset);
}

function appendBinaryFields(fieldset, fields) {
  fields.forEach((field) => {
    fieldset.appendChild(createField({
      type: "radio-group",
      name: field.name,
      label: field.label,
      options: yesNoOptions(),
      rollbackTarget: field.rollbackTarget
    }, getStageValue("F", field.name)));
  });
}

function createField(field, value = "") {
  if (field.type === "radio-group") {
    return createChoiceField(field.label, field.name, field.options, value, false, field.rollbackTarget);
  }
  if (field.type === "checkbox-group") {
    return createChoiceField(field.label, field.name, field.options, value, true);
  }

  const label = document.createElement("label");
  label.textContent = field.label;

  let input;
  if (field.type === "textarea") {
    input = document.createElement("textarea");
    input.rows = field.rows || 3;
  } else if (field.type === "select") {
    input = document.createElement("select");
    field.options.forEach((option) => {
      const optionEl = document.createElement("option");
      optionEl.value = option.value;
      optionEl.textContent = option.label;
      input.appendChild(optionEl);
    });
  } else {
    input = document.createElement("input");
    input.type = field.type || "text";
    if (field.type === "date") {
      input.lang = currentLang === "zh" ? "zh-CN" : "es-ES";
      input.placeholder = currentLang === "zh" ? "YYYY-MM-DD" : "AAAA-MM-DD";
      input.inputMode = "numeric";
    }
  }

  input.name = field.name;
  if (!(field.type === "date")) {
    input.placeholder = field.placeholder || "";
  }
  input.value = value || "";
  label.appendChild(input);
  return label;
}

function createChoiceField(labelText, name, options, value, multiple, rollbackTarget) {
  const wrapper = document.createElement("div");
  wrapper.className = "choice-field";

  const showRollback = rollbackTarget && shouldShowInlineRollback(name, value);
  const hasTitle = Boolean(String(labelText || "").trim());
  if (hasTitle || showRollback) {
    const header = document.createElement("div");
    header.className = "choice-field-header";
    if (hasTitle) {
      const title = document.createElement("span");
      title.textContent = labelText;
      header.appendChild(title);
    }

    if (showRollback) {
      const rollbackButton = document.createElement("button");
      rollbackButton.type = "button";
      rollbackButton.className = "ghost-button inline-rollback-button";
      rollbackButton.textContent = t("rollback");
      rollbackButton.addEventListener("click", () => openRollbackDialog(rollbackTarget));
      header.appendChild(rollbackButton);
    }

    wrapper.appendChild(header);
  }

  const group = document.createElement("div");
  group.className = "choice-group";
  options.forEach((option) => {
    const optionLabel = document.createElement("label");
    optionLabel.className = "choice-option";
    const input = document.createElement("input");
    input.type = multiple ? "checkbox" : "radio";
    input.name = name;
    input.value = option.value;
    input.checked = multiple
      ? (Array.isArray(value) ? value.includes(option.value) : value === option.value)
      : value === option.value;
    optionLabel.appendChild(input);
    optionLabel.append(option.label);
    group.appendChild(optionLabel);
  });
  wrapper.appendChild(group);
  return wrapper;
}

function createChoiceGroup(title, options, selectedValues, name, multiple) {
  return createChoiceField(title, name, options, selectedValues, multiple);
}

function createRepeatableChoiceGroup(index, name, label, options, value, multiple, rollbackTarget) {
  const field = createChoiceField(label, name, options, value, multiple, rollbackTarget && shouldShowInlineRollback(name, value) ? rollbackTarget : null);
  field.querySelectorAll("input").forEach((input) => {
    input.dataset.testIndex = String(index);
  });
  return field;
}

function createRepeatableField(field, value, index) {
  const wrapper = createField(field, value);
  wrapper.querySelectorAll("input, select, textarea").forEach((input) => {
    input.dataset.testIndex = String(index);
  });
  return wrapper;
}

function createFieldset(title) {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "field-group";
  if (String(title || "").trim()) {
    const legend = document.createElement("legend");
    legend.textContent = title;
    fieldset.appendChild(legend);
  }
  return fieldset;
}

function createHint(text) {
  const hint = document.createElement("p");
  hint.className = "support-copy";
  hint.textContent = text;
  hint.hidden = !String(text || "").trim();
  return hint;
}

function binaryField(name, rollbackTarget = "") {
  return { name, label: t(`labels.${name}`), rollbackTarget };
}

function handleStageChange(event) {
  const target = event.target;
  if (target.dataset.testIndex) {
    handleRepeatableTestChange(target);
    return;
  }

  if (currentStageId === "A" && target.name === "A-selection") {
    state.stages.A.selected = getCheckedValues("A-selection");
    state.stages.A.skipped = false;
    persistSelectionStage("A");
    updateABAdvanceButton();
  } else if (currentStageId === "A" && target.name.startsWith("A_other_toggle_")) {
    persistSelectionStage("A");
    renderStageForm();
  } else if (currentStageId === "B" && target.name === "B-selection") {
    state.stages.B.selected = getCheckedValues("B-selection");
    state.stages.B.skipped = false;
    persistSelectionStage("B");
    updateABAdvanceButton();
  } else if (currentStageId === "B" && target.name.startsWith("B_other_toggle_")) {
    persistSelectionStage("B");
    renderStageForm();
  } else if (currentStageId === "C" && target.name === "c-elements") {
    state.stages.C.selectedElements = getCheckedValues("c-elements");
    renderStageForm();
  } else if (currentStageId === "F" && ["sketchMode", "balanceAcidityIssue", "balanceAcidityIssueType"].includes(target.name)) {
    persistCurrentForm();
    renderStageForm();
  } else {
    persistCurrentForm();
    if (currentStageId === "F" || currentStageId === "H") {
      renderStageForm();
    }
  }
  saveState();
}

function handleStageInput(event) {
  const target = event.target;
  if (target.dataset.testIndex) {
    handleRepeatableTestChange(target);
    return;
  }
  persistCurrentForm();
  saveState();
}

function handleRepeatableTestChange(target) {
  const index = Number(target.dataset.testIndex);
  const tests = getKitchenTests();
  tests[index] = tests[index] || {};

  if (target.type === "radio" && target.name === "testScope") {
    tests[index].testScope = target.value;
    if (target.value !== "element") {
      tests[index].testElementType = "";
    }
    state.stages.G = { ...(state.stages.G || {}), tests };
    renderStageForm();
    saveState();
    return;
  }

  if (target.type === "radio" && target.name === "kitchenDecision") {
    tests[index].kitchenDecision = target.value;
    state.stages.G = { ...(state.stages.G || {}), tests };
    renderStageForm();
    saveState();
    return;
  }

  tests[index][target.name] = target.value;
  state.stages.G = { ...(state.stages.G || {}), tests };
  saveState();
}

function persistCurrentForm() {
  if (currentStageId === "A" || currentStageId === "B") {
    persistSelectionStage(currentStageId);
    state.meta.currentStage = currentStageId;
    return;
  }

  if (currentStageId === "G") {
    state.meta.currentStage = currentStageId;
    return;
  }

  const formData = new FormData(stageFormEl);
  const stageState = state.stages[currentStageId] || {};
  Object.keys(stageState).forEach((key) => {
    if (!["selected", "skipped", "selectedElements", "tests"].includes(key) && !key.startsWith("sketch")) {
      delete stageState[key];
    }
  });
  for (const key of [...formData.keys()]) {
    stageState[key] = formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key);
  }
  state.stages[currentStageId] = stageState;
  state.meta.currentStage = currentStageId;
}

function persistSelectionStage(stageId) {
  const formData = new FormData(stageFormEl);
  const existingState = getStageState(stageId);
  const nextState = {
    selected: getCheckedValues(`${stageId}-selection`),
    skipped: false
  };

  Object.keys(existingState).forEach((key) => {
    if (key !== "selected" && key !== "skipped" && !key.includes("_other_")) {
      nextState[key] = existingState[key];
    }
  });

  t(stageId === "A" ? "aOptions" : "bOptions").forEach((group) => {
    const toggleKey = `${stageId}_other_toggle_${group.value}`;
    const textKey = `${group.value}_other_text`;
    const toggleValues = formData.getAll(toggleKey);

    if (toggleValues.length) {
      nextState[toggleKey] = toggleValues;
      nextState[textKey] = formData.get(textKey) || "";
    }
  });

  state.stages[stageId] = nextState;
}

function renderLatestChange() {
  if (!state.changeLog.length) {
    latestChangeEl.className = "change-log-list empty-state";
    latestChangeEl.textContent = t("noChanges");
    return;
  }
  latestChangeEl.className = "change-log-list";
  latestChangeEl.innerHTML = "";
  state.changeLog.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "change-log-item";
    const displayRef = `<strong>${escapeHtml(getChangeDisplayRef(entry))}</strong>`;
    if (entry.type === "attribute_tool") {
      item.innerHTML = formatBlock(t("toolUseTemplate"), {
        recordLabel: escapeHtml(t("toolUseRecordLabel")),
        ref: displayRef,
        date: formatDate(entry.date),
        target: escapeHtml(entry.targetElementLabel || "-"),
        output: escapeHtml(entry.outputText || "-"),
        alternatives: escapeHtml(entry.alternativeLabels?.join(" / ") || "-")
      });
    } else {
      item.innerHTML = formatBlock(t("changeItemTemplate"), {
        recordLabel: escapeHtml(t("rollbackRecordLabel")),
        ref: displayRef,
        date: formatDate(entry.date),
        before: entry.versionBefore,
        after: entry.versionAfter,
        from: entry.rollbackFromStage,
        to: entry.rollbackToStage,
        reason: escapeHtml(entry.reasonForChange),
        elements: escapeHtml(entry.affectedElements || "-"),
        techniques: escapeHtml(entry.affectedTechniques || "-")
      });
    }
    latestChangeEl.appendChild(item);
  });
}

function getChangeDisplayRef(entry) {
  if (entry.type === "attribute_tool") {
    return getAttributeToolDisplayRef(entry);
  }
  return getRollbackDisplayRef(entry);
}

function getAttributeToolDisplayRef(entry) {
  const toolEntries = state.changeLog.filter((item) => item.type === "attribute_tool");
  const currentIndex = toolEntries.findIndex((item) => item === entry || item.changeId === entry.changeId);
  const sequence = currentIndex === -1 ? toolEntries.length + 1 : toolEntries.length - currentIndex;
  return `Herr-${getExperimentRef(entry.experimentRef)}-${String(sequence).padStart(2, "0")}`;
}

function getRollbackDisplayRef(entry) {
  const rollbackEntries = state.changeLog.filter((item) => item.type !== "attribute_tool");
  const currentIndex = rollbackEntries.findIndex((item) => item === entry || item.changeId === entry.changeId);
  const sequence = currentIndex === -1 ? rollbackEntries.length + 1 : rollbackEntries.length - currentIndex;
  return `Cam-${getExperimentRef(entry.experimentRef)}-${String(sequence).padStart(2, "0")}`;
}

function getExperimentRef(value = state.meta.projectCode || state.meta.currentVersion || "EXP") {
  return String(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^A-Za-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "EXP";
}

function renderRollbackBanner() {
  const latest = state.changeLog[0];
  if (!latest || latest.type === "attribute_tool" || latest.rollbackToStage !== currentStageId) {
    rollbackBannerEl.hidden = true;
    rollbackBannerEl.textContent = "";
    return;
  }
  rollbackBannerEl.hidden = false;
  rollbackBannerEl.textContent = format(t("rollbackBanner"), {
    from: latest.rollbackFromStage,
    to: latest.rollbackToStage,
    reason: latest.reasonForChange
  });
}

function moveStage(direction) {
  persistCurrentForm();
  const index = stageIds.indexOf(currentStageId);
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= stageIds.length) {
    return;
  }
  currentStageId = stageIds[nextIndex];
  render();
}

function skipCurrentStage() {
  if (!skipEnabledStages.has(currentStageId)) {
    return;
  }
  if (getABSelectionCount() > 0) {
    moveStage(1);
    return;
  }
  state.stages[currentStageId] = { ...(state.stages[currentStageId] || {}), skipped: true };
  const index = stageIds.indexOf(currentStageId);
  const nextIndex = index + 1;
  if (nextIndex >= stageIds.length) {
    saveState();
    render();
    return;
  }
  currentStageId = stageIds[nextIndex];
  state.meta.currentStage = currentStageId;
  saveState();
  render();
}

function updateABAdvanceButton() {
  if (!skipEnabledStages.has(currentStageId)) {
    return;
  }
  skipStageButtonEl.textContent = getABSelectionCount() > 0 ? t("next") : t("skip");
}

function getABSelectionCount() {
  if (!["A", "B"].includes(currentStageId)) {
    return 0;
  }
  return getCheckedValues(`${currentStageId}-selection`).length;
}

function addKitchenTest() {
  const tests = getKitchenTests();
  tests.push({
    testScope: "whole_dish",
    testCode: state.meta.projectCode,
    testNumber: `${tests.length + 1}`
  });
  state.stages.G = { ...(state.stages.G || {}), tests };
  renderStageForm();
  saveState();
}

function removeKitchenTest(index) {
  state.stages.G = {
    ...(state.stages.G || {}),
    tests: getKitchenTests().filter((_, currentIndex) => currentIndex !== index)
  };
  renderStageForm();
  saveState();
}

function openRollbackDialog(forcedTarget = "") {
  if (reviewDialogEl.open) {
    reviewDialogEl.close();
  }
  rollbackTargetEl.innerHTML = "";
  const allowedTargets = forcedTarget ? [forcedTarget] : stageIds.filter((stageId) => stageId !== currentStageId);
  allowedTargets.forEach((target) => {
    const option = document.createElement("option");
    option.value = target;
    option.textContent = `${target} - ${t(`stageTitles.${target}`)}`;
    rollbackTargetEl.appendChild(option);
  });
  document.getElementById("rollback-reason").value = "";
  document.getElementById("rollback-description").value = "";
  document.getElementById("rollback-elements").value = "";
  document.getElementById("rollback-techniques").value = "";
  rollbackDialogEl.showModal();
}

function openReviewDialog() {
  persistCurrentForm();
  renderReviewContent();
  reviewDialogEl.showModal();
}

function openAttributeDialog() {
  persistCurrentForm();
  renderAttributeDialog();
  attributeDialogEl.showModal();
}

function renderReviewContent() {
  reviewContentEl.innerHTML = "";
  const cards = [
    createReviewCard("C", t("stageTitles.C"), buildStageCReviewItems()),
    createReviewCard("D", t("stageTitles.D"), buildElementStageReviewItems("D", "presentation")),
    createReviewCard("E", t("stageTitles.E"), buildElementStageReviewItems("E", "technique")),
    createReviewCard("F", t("stageTitles.F"), buildStageFReviewItems())
  ];

  cards.forEach((card) => reviewContentEl.appendChild(card));
}

function createReviewCard(stageId, title, items) {
  const article = document.createElement("article");
  article.className = "review-card";

  const head = document.createElement("div");
  head.className = "review-card-head";
  const heading = document.createElement("h4");
  heading.textContent = `${stageId}. ${title}`;
  head.appendChild(heading);

  const action = document.createElement("button");
  action.type = "button";
  action.className = "warning-button";
  action.textContent = t("registerSupplement");
  action.addEventListener("click", () => openRollbackDialog(stageId));
  head.appendChild(action);
  article.appendChild(head);

  if (!items.length) {
    article.appendChild(createHint(t("noReviewContent")));
    return article;
  }

  items.forEach((item) => {
    if (item.sketchData) {
      article.appendChild(createReviewSketchItem(item.title, item.sketchData));
      return;
    }
    article.appendChild(createReviewItem(item.title, item.lines));
  });
  return article;
}

function createReviewItem(title, lines) {
  const section = document.createElement("section");
  section.className = "review-item";
  const heading = document.createElement("h5");
  heading.textContent = title;
  section.appendChild(heading);

  const meta = document.createElement("div");
  meta.className = "review-meta";
  lines.forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    meta.appendChild(p);
  });
  section.appendChild(meta);
  return section;
}

function createReviewSketchItem(title, imageData) {
  const section = document.createElement("section");
  section.className = "review-item";
  const heading = document.createElement("h5");
  heading.textContent = title;
  section.appendChild(heading);

  const wrapper = document.createElement("div");
  wrapper.className = "sketch-preview";
  const image = document.createElement("img");
  image.src = imageData;
  image.alt = title;
  wrapper.appendChild(image);
  section.appendChild(wrapper);
  return section;
}

function buildStageCReviewItems() {
  const selected = getSelectedElements();
  if (!selected.length) return [];

  return selected.map((key) => {
    const fields = elementFields(key);
    const lines = fields
      .map((field) => {
        const value = getStageValue("C", field.name);
        return value ? `${field.label}: ${value}` : "";
      })
      .filter(Boolean);

    if (!lines.length) {
      lines.push(t("noReviewContent"));
    }

    return {
      title: t(`elements.${key}`),
      lines
    };
  });
}

function buildElementStageReviewItems(stageId, mode) {
  const selected = getSelectedElements();
  if (!selected.length) return [];

  return selected.map((key) => {
    const product = getStageValue("C", `${key}_product`) || "-";
    const value = getStageValue(stageId, `${mode}_${key}`);
    return {
      title: `${t(`elements.${key}`)} - ${product}`,
      lines: [value || t("noReviewContent")]
    };
  });
}

function buildStageFReviewItems() {
  const items = [];
  const sketchData = getStageValue("F", "sketchUploadData") || getStageValue("F", "sketchCanvasData");
  if (sketchData) {
    items.push({
      title: t("sketchSummary"),
      lines: [],
      sketchData
    });
  }

  return items;
}

function handleAttributeFormInput(event) {
  persistAttributeForm();
  refreshAttributeDerivedLabels();
  if (shouldRefreshAttributeOutputOptions(event.target)) {
    renderAttributeOutputOptions();
  }
}

function handleAttributeFormChange(event) {
  persistAttributeForm();
  if (shouldRefreshAttributeOutputOptions(event.target)) {
    renderAttributeOutputOptions();
  }
}

function persistAttributeForm() {
  const formData = new FormData(attributeFormEl);
  const stageState = getStageState("C");
  const previousBranch = stageState.attributeBranch || {};
  const branch = {
    ...previousBranch,
    targetTypes: formData.getAll("targetTypes"),
    rowCount: Number(getAttributeBranchValue("rowCount")) || 1,
    comboCount: Number(getAttributeBranchValue("comboCount")) || 1,
    alternativeOutputs: formData.getAll("alternativeOutputs").filter((value) => value !== formData.get("outputSummary"))
  };

  getAttributeRows().forEach((index) => {
    branch[`attr_${index}_mechanism_count`] = Number(previousBranch[`attr_${index}_mechanism_count`]) || 1;
  });

  for (const [key, value] of formData.entries()) {
    if (key === "targetTypes") continue;
    branch[key] = value;
  }

  stageState.attributeBranch = branch;
  state.stages.C = stageState;
  saveState();
}

function applyAttributeOutputToStageC() {
  persistAttributeForm();
  const outputCode = getAttributeBranchValue("outputSummary");
  const outputTarget = getAttributeBranchValue("outputTarget");
  const stageState = getStageState("C");
  const options = getCombinationOptions();
  const outputOption = options.find((option) => option.code === outputCode);
  const selectedAlternativeCodes = getAttributeBranchState().alternativeOutputs || [];
  const selectedAlternativeOptions = options.filter((option) => selectedAlternativeCodes.includes(option.code));
  if (outputTarget) {
    stageState[`${outputTarget}_product`] = outputOption?.text || "";
    const previousEntries = Array.isArray(stageState.attributeBranchSelections?.[outputTarget])
      ? stageState.attributeBranchSelections[outputTarget]
      : [];
    const changeId = createChangeId();
    const newEntry = {
      changeId,
      displayRef: createDisplayRef("attribute_tool", changeId),
      experimentRef: getExperimentRef(),
      date: new Date().toISOString(),
      outputCode,
      outputText: outputOption?.text || "",
      alternatives: selectedAlternativeOptions.map((option) => option.code),
      possibilities: options
    };
    stageState.attributeBranchSelections = {
      ...(stageState.attributeBranchSelections || {}),
      [outputTarget]: [...previousEntries, newEntry]
    };
    state.changeLog.unshift({
      type: "attribute_tool",
      changeId: newEntry.changeId,
      displayRef: newEntry.displayRef,
      experimentRef: newEntry.experimentRef,
      date: newEntry.date,
      targetElement: outputTarget,
      targetElementLabel: t(`elements.${outputTarget}`),
      outputCode,
      outputText: outputOption?.text || "",
      alternativeCodes: selectedAlternativeOptions.map((option) => option.code),
      alternativeLabels: selectedAlternativeOptions.map((option) => option.label)
    });
  }
  state.stages.C = stageState;
  saveState();
  attributeDialogEl.close();
  render();
  pulseSavedState("attributeApplied");
}

function getAttributeBranchState() {
  return getStageState("C").attributeBranch || {};
}

function getAttributeBranchValue(name) {
  return getAttributeBranchState()[name] || "";
}

function getAttributeRows() {
  const count = Number(getAttributeBranchValue("rowCount")) || 1;
  return Array.from({ length: count }, (_, index) => index + 1);
}

function getMechanismRows(attributeIndex) {
  const count = Number(getAttributeBranchValue(`attr_${attributeIndex}_mechanism_count`)) || 1;
  return Array.from({ length: count }, (_, index) => index + 1);
}

function getCombinationRows() {
  const count = Number(getAttributeBranchValue("comboCount")) || 1;
  return Array.from({ length: count }, (_, index) => index + 1);
}

function addAttributeRow() {
  const stageState = getStageState("C");
  const branch = {
    ...(stageState.attributeBranch || {})
  };
  const currentCount = Number(branch.rowCount) || 1;
  branch.rowCount = currentCount + 1;
  branch[`attr_${currentCount + 1}_mechanism_count`] = 1;
  stageState.attributeBranch = branch;
  state.stages.C = stageState;
  saveState();
  renderAttributeDialog();
}

function addMechanismRow(attributeIndex) {
  const stageState = getStageState("C");
  const branch = {
    ...(stageState.attributeBranch || {})
  };
  const key = `attr_${attributeIndex}_mechanism_count`;
  branch[key] = (Number(branch[key]) || 1) + 1;
  stageState.attributeBranch = branch;
  state.stages.C = stageState;
  saveState();
  renderAttributeDialog();
}

function addCombinationRow() {
  const stageState = getStageState("C");
  const branch = {
    ...(stageState.attributeBranch || {})
  };
  branch.comboCount = (Number(branch.comboCount) || 1) + 1;
  stageState.attributeBranch = branch;
  state.stages.C = stageState;
  saveState();
  renderAttributeDialog();
}

function getCombinationOptions() {
  return getCombinationRows()
    .map((index) => {
      const code = getCombinationCode(index);
      const value = getAttributeBranchValue(`combo_${index}_value`);
      if (!value) return null;
      return {
        code,
        text: value,
        label: `${code} | ${value}`
      };
    })
    .filter(Boolean);
}

function getCombinationCode(index) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let value = index;
  let code = "";
  while (value > 0) {
    value -= 1;
    code = alphabet[value % 26] + code;
    value = Math.floor(value / 26);
  }
  return code;
}

function getAttributePossibilitiesForTarget(target) {
  const selections = getStageState("C").attributeBranchSelections || {};
  const entries = Array.isArray(selections[target]) ? selections[target] : [];
  if (!entries.length) return [];
  return entries.flatMap((entry, index) => {
    const alternatives = Array.isArray(entry.alternatives) ? entry.alternatives : [];
    const labels = (entry.possibilities || [])
      .filter((option) => alternatives.includes(option.code))
      .map((option) => option.label);
    const prefix = currentLang === "zh" ? `第 ${index + 1} 次使用` : `Uso ${index + 1}`;
    const outputLabel = currentLang === "zh"
      ? `主输出：${entry.outputText || "-"}`
      : `Salida principal: ${entry.outputText || "-"}`;
    const alternativesLabel = currentLang === "zh"
      ? `备选：${labels.length ? labels.join(" / ") : "-"}`
      : `Alternativas: ${labels.length ? labels.join(" / ") : "-"}`;
    return [prefix, outputLabel, alternativesLabel];
  });
}

function shouldRefreshAttributeOutputOptions(target) {
  if (!target?.name) return false;
  return target.name.startsWith("combo_") || target.name === "outputSummary";
}

function refreshAttributeDerivedLabels() {
  attributeFormEl.querySelectorAll('[data-role="attribute-row-title"]').forEach((title) => {
    const index = Number(title.dataset.attributeIndex);
    const input = attributeFormEl.querySelector(`input[name="attr_${index}_name"]`);
    title.textContent = formatAttributeRowTitle(index, input?.value || "");
  });

  attributeFormEl.querySelectorAll('[data-role="attribute-capture"]').forEach((hint) => {
    const name = hint.dataset.fieldName || "";
    const match = name.match(/^attr_(\d+)_ingredient_list_(\d+)$/);
    if (!match) return;
    const [, attributeIndex, slot] = match;
    const mechanismInput = attributeFormEl.querySelector(`input[name="attr_${attributeIndex}_mechanism_${slot}"]`);
    const mechanismValue = mechanismInput?.value || "";
    hint.textContent = mechanismValue
      ? `${t("attributeLabels.mechanism")} ${slot}: ${mechanismValue}`
      : `${t("attributeLabels.mechanism")} ${slot}`;
  });
}

function formatAttributeRowTitle(index, value = "") {
  return value ? `${t("attributeLabels.attribute")} ${index}: ${value}` : `${t("attributeLabels.attribute")} ${index}`;
}

function handleRollbackSubmit(event) {
  event.preventDefault();
  persistCurrentForm();

  const formData = new FormData(event.currentTarget);
  const targetStage = formData.get("rollbackTarget");
  const changeId = createChangeId();
  state.changeLog.unshift({
    changeId,
    displayRef: createDisplayRef("rollback", changeId),
    experimentRef: getExperimentRef(),
    date: new Date().toISOString(),
    rollbackFromStage: currentStageId,
    rollbackToStage: targetStage,
    reasonForChange: formData.get("reasonForChange"),
    affectedElements: formData.get("affectedElements"),
    affectedTechniques: formData.get("affectedTechniques"),
    versionBefore: state.meta.currentVersion,
    versionAfter: state.meta.currentVersion
  });
  state.meta.currentStage = targetStage;
  currentStageId = targetStage;
  rollbackDialogEl.close();
  render();
}

async function resetPrototype() {
  localStorage.removeItem(STORAGE_KEY);
  saveFileHandle = null;
  state = createFreshState(currentLang);
  currentStageId = "A";
  state.meta.language = currentLang;
  await ensureProjectIdentity(true);
  render();
  saveState();
}

async function ensureProjectIdentity(forceNew = false) {
  const currentProjectCode = String(state.meta.projectCode || "").trim();
  const currentVersion = String(state.meta.currentVersion || "").trim();

  if (!forceNew && currentProjectCode) {
    if (!currentVersion || currentVersion === currentProjectCode) {
      state.meta.currentVersion = currentProjectCode;
    }
    return;
  }

  const nextProjectCode = await fetchNextProjectCode();
  state.meta.projectCode = nextProjectCode;
  state.meta.currentVersion = nextProjectCode;
  state.meta.editingProjectCode = "";
  state.meta.editingVersionCode = "";
}

async function fetchNextProjectCode() {
  const currentYear = new Date().getFullYear();
  let items = [];

  try {
    const response = await fetch("/api/methodology");
    if (!response.ok) {
      throw new Error("Failed to load methodology list");
    }
    items = await response.json();
  } catch (error) {
    console.warn("Failed to fetch methodology list, falling back to timestamp-based project code.", error);
    const fallback = `${currentYear}-${String(Date.now()).slice(-3)}`;
    return fallback;
  }

  let maxSequence = 0;

  (Array.isArray(items) ? items : []).forEach((item) => {
    const code = String(item?.project_code || "").trim();
    const match = code.match(/^(\d{4})-(\d{3,})$/);
    if (!match) return;
    if (Number(match[1]) !== currentYear) return;
    maxSequence = Math.max(maxSequence, Number(match[2]));
  });

  return `${currentYear}-${String(maxSequence + 1).padStart(3, "0")}`;
}

function getStageState(stageId) {
  return state.stages[stageId] || {};
}

function getSelectedElements() {
  return getStageState("C").selectedElements || [];
}

function getStageValue(stageId, name) {
  const stageState = getStageState(stageId);
  if (stageId === "F" && name === "generalAroma") {
    return stageState.generalAroma || stageState.aromaOverallDescription || "";
  }
  return stageState[name] || "";
}

function getKitchenTests() {
  return Array.isArray(getStageState("G").tests) ? getStageState("G").tests : [];
}

function applyDerivedMeta() {
  state.meta.activeCreativeBasis = deriveCreativeBasis();
  state.meta.nextAction = deriveNextAction();
}

function deriveCreativeBasis() {
  const selected = getStageState("B").selected || [];
  const labels = [];
  const options = t("bOptions");

  options.forEach((group) => {
    (group.children || []).forEach((item) => {
      if (selected.includes(item.value)) {
        labels.push(item.label);
      }
    });
    const otherText = getStageState("B")[`${group.value}_other_text`];
    const otherToggle = getStageState("B")[`B_other_toggle_${group.value}`];
    const hasOther = Array.isArray(otherToggle) ? otherToggle.length > 0 : Boolean(otherToggle);
    if (hasOther && otherText) {
      labels.push(otherText);
    }
  });

  return labels.join(" / ");
}

function deriveNextAction() {
  const currentIndex = stageIds.indexOf(currentStageId);
  const nextStage = stageIds[currentIndex + 1];
  if (nextStage) {
    return `${nextStage} · ${t(`stageTitles.${nextStage}`)}`;
  }
  return currentLang === "zh" ? "完成" : "Completado";
}

function elementOptions() {
  return elementKeys.map((key) => ({ value: key, label: t(`elements.${key}`) }));
}

function renderMethodologyPanel() {
  if (currentStageId !== "C" && currentStageId !== "D") {
    methodologyPanelEl.hidden = true;
    methodologyPanelContentEl.innerHTML = "";
    return;
  }

  methodologyPanelEl.hidden = false;
  methodologyPanelContentEl.innerHTML = "";

  getMethodologySections(currentStageId).forEach((section) => {
    const block = document.createElement("div");
    block.className = "methodology-block";
    const title = document.createElement("strong");
    title.textContent = section.title;
    block.appendChild(title);

    if (section.items?.length) {
      const list = document.createElement("ul");
      list.className = "path-list";
      [...section.items, currentLang === "zh" ? "……" : "..."].forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
      block.appendChild(list);
    }

    methodologyPanelContentEl.appendChild(block);
  });
}

function getMethodologySections(stageId) {
  if (stageId === "C") {
    return currentLang === "zh"
      ? [
          {
            title: "C1 分类",
            items: ["主角元素", "次要元素", "固体元素", "液体元素", "香气元素", "脆感元素", "脂肪元素"]
          },
          {
            title: "C2 属性",
            items: ["咸", "甜", "酸", "苦", "鲜", "辣", "香气", "涩感", "冷 / 热", "柔软", "胶质", "脆", "有嚼劲", "粘"]
          },
          {
            title: "C3 功能",
            items: ["平衡脂肪", "降低 / 提高强度", "制造温度对比", "制造质地对比", "提供汁水", "连接元素"]
          },
          {
            title: "C4 具体产品",
            items: ["分类", "可能性", "资源"]
          }
        ]
      : [
          {
            title: "C1 Clasificación",
            items: ["Protagonista", "Secundario", "Elemento sólido", "Elemento líquido", "Elemento aromático", "Elemento crujiente", "Elemento graso"]
          },
          {
            title: "C2 Atributos",
            items: ["Salado", "Dulce", "Ácido", "Amargo", "Umami", "Picante", "Aromático", "Astringencia", "Frío / caliente", "Blando", "Gelatinoso", "Crujiente", "Masticable", "Pegajoso"]
          },
          {
            title: "C3 Funciones",
            items: ["Equilibrio de grasa", "Reducir / aumentar intensidad", "Generación de contraste térmico", "Generación de contraste de textura", "Aportar jugo", "Conexión entre elementos"]
          },
          {
            title: "C4 Producto concreto",
            items: ["Clasificación", "Posibilidades", "Recursos"]
          }
        ];
  }

  return currentLang === "zh"
    ? [
        {
          title: "D1 固体元素",
          items: ["整块", "薄片", "细丝", "丁块", "切碎", "碎屑", "泥", "填馅", "塑形"]
        },
        {
          title: "D2 液体元素",
          items: ["高汤", "浓稠酱汁", "胶质酱汁", "乳化", "油", "浸泡液", "泡沫", "浓缩", "整合入固体"]
        },
        {
          title: "D3 香气元素",
          items: ["新鲜叶片", "新鲜香草", "粉末化", "浸泡", "蒸馏", "整合入脂肪"]
        },
        {
          title: "D4 脂肪元素",
          items: ["固态", "融化脂肪", "生油", "脂肪乳化", "脂肪泡沫", "打发"]
        },
        {
          title: "D5 脆感元素",
          items: ["油炸", "膨化", "脱水", "酥粒", "薄片", "烘烤谷物", "坚果"]
        },
        {
          title: "D6 温度",
          items: ["冷", "温", "热", "冷冻"]
        }
      ]
    : [
        {
          title: "D1 Elemento sólido",
          items: ["Entero", "Lámina", "Juliana", "Dado", "Picado", "Desmigado", "Puré", "Relleno", "Moldeado"]
        },
        {
          title: "D2 Elemento líquido",
          items: ["Caldo", "Salsa ligada", "Salsa gelatinosa", "Emulsión", "Aceite", "Infusión", "Espuma", "Reducido", "Integrado en sólido"]
        },
        {
          title: "D3 Elemento aromático",
          items: ["En hojas frescas", "En hierbas frescas", "Pulverizado", "Infusión", "Destilado", "Integrado en grasa"]
        },
        {
          title: "D4 Elemento graso",
          items: ["Sólida", "Grasa fundida", "Aceite crudo", "Emulsión grasa", "Espuma grasa", "Montada"]
        },
        {
          title: "D5 Elemento crujiente",
          items: ["Frito", "Suflado", "Deshidratado", "Crumble", "Láminas", "Granos tostados", "Fruto seco"]
        },
        {
          title: "D6 Temperatura",
          items: ["Frío", "Templado", "Caliente", "Congelado"]
        }
      ];
}

function elementFields(key) {
  return [
    { type: "text", name: `${key}_product`, label: t("labels.concreteProduct") },
    { type: "text", name: `${key}_flavor`, label: t("labels.flavor") },
    { type: "text", name: `${key}_texture`, label: t("labels.texture") },
    { type: "text", name: `${key}_aroma`, label: t("labels.aroma") },
    { type: "text", name: `${key}_temperature`, label: t("labels.temperature") },
    { type: "text", name: `${key}_function`, label: t("labels.function") },
    { type: "text", name: `${key}_tasteIntensity`, label: t("labels.tasteIntensity") },
    { type: "text", name: `${key}_textureIntensity`, label: t("labels.textureIntensity") },
    { type: "text", name: `${key}_aromaIntensity`, label: t("labels.aromaIntensity") }
  ];
}

function kitchenFields() {
  return [
    { type: "date", name: "testDate", label: t("labels.testDate") },
    { type: "text", name: "testCode", label: t("labels.testCode") },
    { type: "text", name: "testNumber", label: t("labels.testNumber") },
    { type: "radio-group", name: "behaviorMatch", label: t("labels.behaviorMatch"), options: yesNoOptions(true) },
    { type: "textarea", name: "mainDeviation", label: t("labels.mainDeviation"), rows: 3 },
    { type: "textarea", name: "technicalComparison", label: t("labels.technicalComparison"), rows: 3 },
    { type: "text", name: "chosenFinalTechnology", label: t("labels.chosenFinalTechnology") },
    { type: "text", name: "choiceReason", label: t("labels.choiceReason") },
    { type: "radio-group", name: "passStabilityInPrototype", label: t("labels.passStabilityInPrototype"), options: yesNoOptions() },
    { type: "textarea", name: "proportionEvaluation", label: t("labels.proportionEvaluation"), rows: 3 },
    { type: "textarea", name: "structuralCoherenceEvaluation", label: t("labels.structuralCoherenceEvaluation"), rows: 3 }
  ];
}

function getStageIFields() {
  return [
    { type: "text", name: "menuPosition", label: t("labels.menuPosition") },
    { type: "text", name: "incorporationTiming", label: t("labels.incorporationTiming") },
    { type: "select", name: "finalStatus", label: t("labels.finalStatus"), options: finalStatusOptions() },
    { type: "textarea", name: "decisionNotes", label: t("labels.decisionNotes"), rows: 4 }
  ];
}

function getStageJFields() {
  return [
    { type: "textarea", name: "technicalSheet", label: t("labels.technicalSheet"), rows: 4 },
    { type: "textarea", name: "standardizedProcess", label: t("labels.standardizedProcess"), rows: 4 },
    { type: "textarea", name: "criticalControlPoints", label: t("labels.criticalControlPoints"), rows: 4 },
    { type: "textarea", name: "finalPhotoReference", label: t("labels.finalPhotoReference"), rows: 3 },
    { type: "textarea", name: "documentationNotes", label: t("labels.documentationNotes"), rows: 4 }
  ];
}

function finalStatusOptions() {
  return [
    { value: "", label: t("genericSelect") },
    { value: "approved_for_menu", label: t("decisions.approved_for_menu") },
    { value: "pending_timing", label: t("decisions.pending_timing") },
    { value: "continue_development", label: t("decisions.continue_development") },
    { value: "archived", label: t("decisions.archived") }
  ];
}

function yesNoOptions(includePartial = false) {
  const options = [
    { value: "yes", label: t("yes") },
    { value: "no", label: t("no") }
  ];
  if (includePartial) {
    options.push({ value: "partial", label: t("partial") });
  }
  return options;
}

function intensityOptions() {
  return [
    { value: "low", label: t("low") },
    { value: "adequate", label: t("adequate") },
    { value: "high", label: t("high") }
  ];
}

function adjustmentOptions() {
  return [
    { value: "", label: t("genericSelect") },
    { value: "none", label: t("adjustments.none") },
    { value: "proportion_correction", label: t("adjustments.proportion_correction") },
    { value: "technique_revision", label: t("adjustments.technique_revision") },
    { value: "simplification", label: t("adjustments.simplification") },
    { value: "element_removal", label: t("adjustments.element_removal") },
    { value: "menu_position_change", label: t("adjustments.menu_position_change") }
  ];
}

function shouldShowInlineRollback(name, value) {
  return value === "yes" || value === "rollback_to_d" || value === "rollback_to_g";
}

function hasOtherSelection(stageId, groupValue) {
  const toggle = getStageState(stageId)[`${stageId}_other_toggle_${groupValue}`];
  return Array.isArray(toggle) ? toggle.length > 0 : Boolean(toggle);
}

function getCheckedValues(name) {
  return [...stageFormEl.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}

function scopeLabel(value) {
  if (value === "whole_dish") return t("wholeDish");
  if (value === "element") return t("singleElement");
  return "-";
}

function yesSelectBase(select) {
  const option = document.createElement("option");
  option.value = "";
  option.textContent = t("genericSelect");
  select.appendChild(option);
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createFreshState();
  try {
    return mergeWithDefaults(JSON.parse(raw));
  } catch {
    return createFreshState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  queueMethodologyAutoSave();
}

function queueMethodologyAutoSave() {
  window.clearTimeout(autoSaveTimer);
  autoSaveTimer = window.setTimeout(() => {
    runMethodologyAutoSave().catch(console.error);
  }, 10000);
}

async function runMethodologyAutoSave() {
  if (autoSaveInFlight) return;
  autoSaveInFlight = true;
  try {
    setSaveStatus("saving");
    await persistMethodologyToDatabase();
    setSaveStatus("saved");
  } catch (error) {
    console.error(error);
    setSaveStatus("error");
  } finally {
    autoSaveInFlight = false;
  }
}

async function syncMethodologyToDatabase() {
  const payload = {
    project_code: state.meta.projectCode || "",
    version_code: state.meta.currentVersion || "",
    original_project_code: state.meta.editingProjectCode || "",
    original_version_code: state.meta.editingVersionCode || "",
    dish_name: state.meta.dishName || "",
    linked_dish_code: state.meta.sourceDishCode || "",
    project_origin: state.meta.projectOrigin || "",
    current_stage: state.meta.currentStage || "",
    current_status: state.meta.currentStatus || "",
    foundation_code: state.meta.activeCreativeBasis || "",
    product_code: state.meta.activeProductBasis || "",
    payload_json: makeExportPayload()
  };

  const response = await fetch("/api/methodology", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to save methodology project");
  }

  state.meta.editingProjectCode = state.meta.projectCode || "";
  state.meta.editingVersionCode = state.meta.currentVersion || "";
}

async function savePrototypeToFile() {
  const payload = makeExportPayload();
  const contents = `${JSON.stringify(payload, null, 2)}\n`;
  const filename = getSaveFilename();

  if ("showSaveFilePicker" in window) {
    if (!saveFileHandle) {
      saveFileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: "JSON",
            accept: { "application/json": [".json"] }
          }
        ]
      });
    }
    const writable = await saveFileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
    return;
  }

  const blob = new Blob([contents], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function makeExportPayload() {
  return {
    exportedAt: new Date().toISOString(),
    schemaVersion: 1,
    app: "lera-methodology-prototype",
    state
  };
}

function getAnalysisWorkbookSheets() {
  return [
    {
      name: currentLang === "zh" ? "项目总览" : "Resumen",
      rows: buildSummaryExportRows()
    },
    {
      name: currentLang === "zh" ? "阶段内容" : "Etapas",
      rows: buildStageExportRows()
    },
    {
      name: currentLang === "zh" ? "工具使用" : "Uso herramienta",
      rows: buildToolUsageExportRows()
    },
    {
      name: currentLang === "zh" ? "修改记录" : "Registro cambios",
      rows: buildChangeLogExportRows()
    }
  ];
}

function buildSummaryExportRows() {
  return [
    [currentLang === "zh" ? "字段" : "Campo", currentLang === "zh" ? "内容" : "Contenido"],
    [currentLang === "zh" ? "导出时间" : "Fecha de exportación", formatDate(new Date().toISOString())],
    [currentLang === "zh" ? "项目编码" : "Código de proyecto", state.meta.projectCode || "-"],
    [currentLang === "zh" ? "菜品名称" : "Nombre del plato", state.meta.dishName || "-"],
    [currentLang === "zh" ? "原菜肴编码" : "Código del plato original", state.meta.sourceDishCode || "-"],
    [currentLang === "zh" ? "原方法论主编码" : "Código metodológico principal original", state.meta.sourceMethodologyCode || "-"],
    [currentLang === "zh" ? "当前方法论记录" : "Registro metodológico actual", state.meta.currentVersion || "-"],
    [currentLang === "zh" ? "当前阶段" : "Etapa actual", state.meta.currentStage || "-"],
    [currentLang === "zh" ? "当前状态" : "Estado actual", state.meta.currentStatus || "-"],
    [currentLang === "zh" ? "项目类型" : "Tipo de proyecto", state.meta.projectOrigin || "-"],
    [currentLang === "zh" ? "语言" : "Idioma", state.meta.language || "-"],
    [currentLang === "zh" ? "修改记录数量" : "Número de cambios", String(state.changeLog.length)],
    [currentLang === "zh" ? "工具使用次数" : "Número de usos de herramienta", String(getToolUsageEntries().length)]
  ];
}

function buildStageExportRows() {
  const header = [
    currentLang === "zh" ? "阶段" : "Etapa",
    currentLang === "zh" ? "字段路径" : "Ruta del campo",
    currentLang === "zh" ? "内容" : "Contenido"
  ];
  const rows = [header];
  stageIds.forEach((stageId) => {
    const stageState = state.stages?.[stageId] || {};
    const flatEntries = flattenForExport(stageState);
    flatEntries.forEach(([path, value]) => {
      rows.push([stageId, path, value]);
    });
    if (!flatEntries.length) {
      rows.push([stageId, "-", "-"]);
    }
  });
  return rows;
}

function buildToolUsageExportRows() {
  const header = [
    currentLang === "zh" ? "记录编号" : "Referencia",
    currentLang === "zh" ? "日期" : "Fecha",
    currentLang === "zh" ? "目标元素" : "Elemento objetivo",
    currentLang === "zh" ? "主输出" : "Salida principal",
    currentLang === "zh" ? "备选项" : "Alternativas",
    currentLang === "zh" ? "所有可能性" : "Posibilidades"
  ];
  const rows = [header];
  const entries = getToolUsageEntries();
  entries.forEach((entry) => {
    rows.push([
      entry.displayRef || getChangeDisplayRef(entry),
      formatDate(entry.date),
      entry.targetElementLabel || entry.targetElement || "-",
      entry.outputText || "-",
      entry.alternativeLabels?.join(" / ") || "-",
      entry.possibilities?.map((item) => item.label || item.text || item.code).join(" / ") || "-"
    ]);
  });
  if (rows.length === 1) {
    rows.push(["-", "-", "-", "-", "-", "-"]);
  }
  return rows;
}

function buildChangeLogExportRows() {
  const header = [
    currentLang === "zh" ? "记录编号" : "Referencia",
    currentLang === "zh" ? "类型" : "Tipo",
    currentLang === "zh" ? "日期" : "Fecha",
    currentLang === "zh" ? "内容" : "Contenido",
    currentLang === "zh" ? "补充" : "Detalle"
  ];
  const rows = [header];
  state.changeLog.forEach((entry) => {
    if (entry.type === "attribute_tool") {
      rows.push([
        getChangeDisplayRef(entry),
        currentLang === "zh" ? "工具使用" : "Uso de herramientas",
        formatDate(entry.date),
        `${currentLang === "zh" ? "元素" : "Elemento"}: ${entry.targetElementLabel || "-"}`,
        `${currentLang === "zh" ? "主输出" : "Salida principal"}: ${entry.outputText || "-"} | ${currentLang === "zh" ? "备选项" : "Alternativas"}: ${entry.alternativeLabels?.join(" / ") || "-"}`
      ]);
      return;
    }
    rows.push([
      getChangeDisplayRef(entry),
      currentLang === "zh" ? "正式修改" : "Ajuste formal",
      formatDate(entry.date),
      `${currentLang === "zh" ? "阶段" : "Etapa"}: ${entry.rollbackFromStage || "-"} -> ${entry.rollbackToStage || "-"}`,
      `${currentLang === "zh" ? "原因" : "Motivo"}: ${entry.reasonForChange || "-"}`
    ]);
  });
  if (rows.length === 1) {
    rows.push(["-", "-", "-", "-", "-"]);
  }
  return rows;
}

function getToolUsageEntries() {
  const rows = [];
  const selections = state.stages?.C?.attributeBranchSelections || {};
  Object.entries(selections).forEach(([targetKey, entries]) => {
    (entries || []).forEach((entry) => {
      rows.push({
        ...entry,
        type: "attribute_tool",
        targetElement: targetKey,
        targetElementLabel: t(`elements.${targetKey}`),
        alternativeLabels: (entry.alternatives || []).map((code) => {
          const option = (entry.possibilities || []).find((item) => item.code === code);
          return option?.label || option?.text || code;
        })
      });
    });
  });
  return rows;
}

function flattenForExport(value, prefix = "") {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenForExport(item, `${prefix}[${index}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, nestedValue]) =>
      flattenForExport(nestedValue, prefix ? `${prefix}.${key}` : key)
    );
  }
  if (!isMeaningfulExportValue(value)) {
    return [];
  }
  return [[prefix || "-", stringifyExportValue(value)]];
}

function isMeaningfulExportValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
}

function stringifyExportValue(value) {
  const text = String(value);
  if (text.startsWith("data:image/")) {
    return currentLang === "zh"
      ? `[图片数据，长度 ${text.length}]`
      : `[Datos de imagen, longitud ${text.length}]`;
  }
  return text;
}

function buildXlsxBlob(sheets) {
  const files = buildXlsxFiles(sheets);
  return buildStoredZip(files);
}

function buildXlsxFiles(sheets) {
  const workbookSheetsXml = sheets
    .map((sheet, index) => `<sheet name="${escapeXml(sheet.name).slice(0, 31)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`)
    .join("");
  const workbookRelsXml = sheets
    .map(
      (_, index) =>
        `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`
    )
    .join("");

  const files = [
    {
      path: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  ${sheets
    .map(
      (_, index) =>
        `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
    )
    .join("")}
</Types>`
    },
    {
      path: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`
    },
    {
      path: "docProps/core.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Lera methodology export</dc:title>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified>
</cp:coreProperties>`
    },
    {
      path: "docProps/app.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Codex</Application>
</Properties>`
    },
    {
      path: "xl/workbook.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>${workbookSheetsXml}</sheets>
</workbook>`
    },
    {
      path: "xl/_rels/workbook.xml.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${workbookRelsXml}
  <Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
    },
    {
      path: "xl/styles.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><name val="Calibri"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE8E2D5"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="1">
    <border><left/><right/><top/><bottom/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="2">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>`
    }
  ];

  sheets.forEach((sheet, index) => {
    files.push({
      path: `xl/worksheets/sheet${index + 1}.xml`,
      content: buildWorksheetXlsxXml(sheet.rows)
    });
  });

  return files;
}

function buildWorksheetXlsxXml(rows) {
  const dimensionRef = getWorksheetDimension(rows);
  const rowsXml = rows
    .map((row, rowIndex) => {
      const cellsXml = row
        .map((cell, cellIndex) => {
          const value = escapeXml(cell ?? "");
          const cellRef = `${columnNumberToName(cellIndex + 1)}${rowIndex + 1}`;
          const styleAttr = rowIndex === 0 ? ' s="1"' : "";
          return `<c r="${cellRef}" t="inlineStr"${styleAttr}><is><t xml:space="preserve">${value}</t></is></c>`;
        })
        .join("");
      return `<row r="${rowIndex + 1}">${cellsXml}</row>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="${dimensionRef}"/>
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <sheetData>${rowsXml}</sheetData>
</worksheet>`;
}

function getWorksheetDimension(rows) {
  const rowCount = Math.max(rows.length, 1);
  const colCount = Math.max(...rows.map((row) => row.length), 1);
  return `A1:${columnNumberToName(colCount)}${rowCount}`;
}

function columnNumberToName(number) {
  let value = number;
  let result = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result || "A";
}

function buildStoredZip(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.path);
    const dataBytes = encoder.encode(file.content);
    const crc = crc32(dataBytes);
    const localHeader = createZipLocalHeader(nameBytes, dataBytes.length, crc);
    localParts.push(localHeader, nameBytes, dataBytes);

    const centralHeader = createZipCentralHeader(nameBytes, dataBytes.length, crc, offset);
    centralParts.push(centralHeader, nameBytes);

    offset += localHeader.length + nameBytes.length + dataBytes.length;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const endRecord = createZipEndRecord(files.length, centralSize, offset);

  return new Blob([...localParts, ...centralParts, endRecord], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}

function createZipLocalHeader(nameBytes, size, crc) {
  const header = new Uint8Array(30);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x04034b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 1 << 11, true);
  view.setUint16(8, 0, true);
  view.setUint16(10, 0, true);
  view.setUint16(12, 0, true);
  view.setUint32(14, crc >>> 0, true);
  view.setUint32(18, size, true);
  view.setUint32(22, size, true);
  view.setUint16(26, nameBytes.length, true);
  view.setUint16(28, 0, true);
  return header;
}

function createZipCentralHeader(nameBytes, size, crc, offset) {
  const header = new Uint8Array(46);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x02014b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 20, true);
  view.setUint16(8, 1 << 11, true);
  view.setUint16(10, 0, true);
  view.setUint16(12, 0, true);
  view.setUint16(14, 0, true);
  view.setUint32(16, crc >>> 0, true);
  view.setUint32(20, size, true);
  view.setUint32(24, size, true);
  view.setUint16(28, nameBytes.length, true);
  view.setUint16(30, 0, true);
  view.setUint16(32, 0, true);
  view.setUint16(34, 0, true);
  view.setUint16(36, 0, true);
  view.setUint32(38, 0, true);
  view.setUint32(42, offset, true);
  return header;
}

function createZipEndRecord(fileCount, centralSize, centralOffset) {
  const record = new Uint8Array(22);
  const view = new DataView(record.buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(4, 0, true);
  view.setUint16(6, 0, true);
  view.setUint16(8, fileCount, true);
  view.setUint16(10, fileCount, true);
  view.setUint32(12, centralSize, true);
  view.setUint32(16, centralOffset, true);
  view.setUint16(20, 0, true);
  return record;
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let crc = i;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    table[i] = crc >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const value of bytes) {
    crc = CRC32_TABLE[(crc ^ value) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function getAnalysisFilename() {
  const code = sanitizeFilename(state.meta.projectCode || "");
  const dish = sanitizeFilename(state.meta.dishName || "");
  const version = sanitizeFilename(state.meta.currentVersion || "");
  const base = dish || code || "plato-sin-nombre";

  if (version && version.startsWith(`${base}-`)) {
    return `${version}-resultados-metodologicos.xlsx`;
  }

  if (version) {
    return `${base}-${version}-resultados-metodologicos.xlsx`;
  }

  return `${base}-resultados-metodologicos.xlsx`;
}

function getPdfDocumentTitle() {
  const code = sanitizeFilename(state.meta.projectCode || "");
  const dish = sanitizeFilename(state.meta.dishName || "");
  const version = sanitizeFilename(state.meta.currentVersion || "");
  const base = dish || code || "registro-metodologico";

  if (version && version !== code) {
    return `${base}-${version}`;
  }

  return base;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function pulseButtonState(buttonId, messageKey, restoreKey) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  button.textContent = t(messageKey);
  window.setTimeout(() => {
    button.textContent = t(restoreKey);
  }, 900);
}

function loadImportedState(payload, options = {}) {
  const incomingState = payload?.state ?? payload;
  if (!incomingState || typeof incomingState !== "object") {
    throw new Error("Invalid project file");
  }

  normalizeImportedState(incomingState);
  state = mergeWithDefaults(incomingState);
  state.meta.editingProjectCode = String(options.editingProjectCode || state.meta.editingProjectCode || state.meta.projectCode || "").trim();
  state.meta.editingVersionCode = String(options.editingVersionCode || state.meta.editingVersionCode || state.meta.currentVersion || state.meta.projectCode || "").trim();
  state.meta.language = "es";
  currentStageId = state.meta?.currentStage || "A";
  currentLang = "es";
  saveState();
  render();
}

function mergeWithDefaults(incomingState) {
  const emptyState = createFreshState("es");
  const merged = {
    ...emptyState,
    ...incomingState,
    meta: {
      ...emptyState.meta,
      ...(incomingState.meta || {})
    },
    stages: {
      ...emptyState.stages,
      ...(incomingState.stages || {})
    },
    changeLog: Array.isArray(incomingState.changeLog) ? incomingState.changeLog : []
  };
  if (!merged.meta.currentVersion) {
    merged.meta.currentVersion = merged.meta.projectCode || "";
  }
  if (!merged.meta.editingProjectCode) {
    merged.meta.editingProjectCode = "";
  }
  if (!merged.meta.editingVersionCode) {
    merged.meta.editingVersionCode = "";
  }
  merged.meta.language = "es";
  return merged;
}

function normalizeImportedState(incomingState) {
  const stageF = incomingState?.stages?.F;
  if (!stageF || typeof stageF !== "object") return;
  if (!stageF.generalAroma && stageF.aromaOverallDescription) {
    stageF.generalAroma = stageF.aromaOverallDescription;
  }
  delete stageF.aromaOverallDescription;
}

function getSaveFilename() {
  const code = sanitizeFilename(state.meta.projectCode || "");
  const version = sanitizeFilename(state.meta.currentVersion || "");
  const dish = sanitizeFilename(state.meta.dishName || "");
  const base = dish || code || "metodologia-sin-nombre";

  if (!version) {
    return `${base}.json`;
  }

  if (code && version === code) {
    return `${code}.json`;
  }

  if (code && version.startsWith(`${code}-`)) {
    return `${version}.json`;
  }

  return `${base}-${version}.json`;
}

function sanitizeFilename(value) {
  return String(value)
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "archivo";
}

function incrementVersion(version) {
  const match = version.match(/^(.*?)-([a-z])$/i);
  if (!match) return `${version}-a`;
  const [, base, suffix] = match;
  return `${base}-${String.fromCharCode(suffix.toLowerCase().charCodeAt(0) + 1)}`;
}

function createChangeId() {
  return `CHG-${Date.now().toString(36).toUpperCase()}`;
}

function createDisplayRef(type, changeId) {
  if (type === "attribute_tool") {
    const nextSequence = state.changeLog.filter((entry) => entry.type === "attribute_tool").length + 1;
    return `Herr-${getExperimentRef()}-${String(nextSequence).padStart(2, "0")}`;
  }
  const nextSequence = state.changeLog.filter((entry) => entry.type !== "attribute_tool").length + 1;
  return `Cam-${getExperimentRef()}-${String(nextSequence).padStart(2, "0")}`;
}

function pulseSavedState(messageKey = "saved") {
  const button = document.getElementById("save-button");
  button.textContent = messageKey === "autoSavedAt" && lastAutoSavedAt
    ? t("autoSavedAt").replace("{time}", formatDate(lastAutoSavedAt))
    : t(messageKey);
  window.setTimeout(() => {
    button.textContent = t("save");
  }, 900);
}

function setSaveStatus(status) {
  saveStatusState = status;
  updateSaveStatusText();
}

function updateSaveStatusText() {
  const element = document.getElementById("save-status-text");
  if (!element) return;
  element.className = "support-copy save-status";
  if (saveStatusState === "saving") {
    element.textContent = t("autoSaving");
    element.classList.add("is-saving");
    return;
  }
  if (saveStatusState === "saved" && lastAutoSavedAt) {
    element.textContent = t("autoSavedAt").replace("{time}", formatDate(lastAutoSavedAt));
    element.classList.add("is-saved");
    return;
  }
  if (saveStatusState === "error") {
    element.textContent = t("saveFailed");
    element.classList.add("is-error");
    return;
  }
  element.textContent = t("unsaved");
}

function archiveProject() {
  state.meta.currentStatus = "archived";
  saveState();
  render();
}

function archiveDishProject() {
  archiveProject();
  openRestaurantDishEntry();
}

function openRestaurantDishEntry() {
  const methodologyRecordCode =
    state.meta.currentVersion && state.meta.currentVersion !== state.meta.projectCode ? state.meta.currentVersion : "";
  const params = new URLSearchParams({
    entryMode: "methodology",
    dishName: state.meta.dishName || "",
    methodologyMainCode: state.meta.projectCode || "",
    methodologyVersionCode: methodologyRecordCode,
    foundationCode: state.meta.activeCreativeBasis || ""
  });

  window.open(`./restaurant-database/index.html?${params.toString()}`, "_blank", "noopener");
}

function setupSketchCanvas(canvas, savedCanvas, brushColor, undoButton, redoButton) {
  const context = canvas.getContext("2d");
  activeSketchCanvasContext = context;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = 4;
  context.strokeStyle = brushColor || "#6f2c19";
  const stageState = state.stages.F || {};
  let undoStack = Array.isArray(stageState.sketchUndoStack) ? [...stageState.sketchUndoStack] : [];
  let redoStack = Array.isArray(stageState.sketchRedoStack) ? [...stageState.sketchRedoStack] : [];

  const paintBackground = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#fffaf2";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const renderSnapshot = (snapshot) => {
    paintBackground();
    if (!snapshot) return;
    const image = new Image();
    image.onload = () => {
      paintBackground();
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = snapshot;
  };

  const persistHistory = (canvasData = canvas.toDataURL("image/png")) => {
    const nextStageState = state.stages.F || {};
    nextStageState.sketchCanvasData = canvasData;
    nextStageState.sketchUndoStack = undoStack;
    nextStageState.sketchRedoStack = redoStack;
    state.stages.F = nextStageState;
    saveState();
    updateHistoryButtons();
  };

  const updateHistoryButtons = () => {
    if (undoButton) undoButton.disabled = undoStack.length <= 1;
    if (redoButton) redoButton.disabled = redoStack.length === 0;
  };

  paintBackground();
  if (!undoStack.length) {
    undoStack = [savedCanvas || ""];
  }
  if (savedCanvas) {
    renderSnapshot(savedCanvas);
  }

  let drawing = false;
  let moved = false;

  const getPoint = (event) => {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches?.[0] || event;
    return {
      x: ((source.clientX - rect.left) / rect.width) * canvas.width,
      y: ((source.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const start = (event) => {
    event.preventDefault();
    drawing = true;
    moved = false;
    const point = getPoint(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const move = (event) => {
    if (!drawing) return;
    event.preventDefault();
    moved = true;
    const point = getPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const stop = () => {
    if (drawing && moved) {
      undoStack.push(canvas.toDataURL("image/png"));
      redoStack = [];
      persistHistory(undoStack[undoStack.length - 1]);
    }
    drawing = false;
  };

  undoButton?.addEventListener("click", () => {
    if (undoStack.length <= 1) return;
    const current = undoStack.pop();
    const previous = undoStack[undoStack.length - 1] || "";
    redoStack.push(current || "");
    renderSnapshot(previous);
    persistHistory(previous);
  });

  redoButton?.addEventListener("click", () => {
    if (!redoStack.length) return;
    const next = redoStack.pop();
    undoStack.push(next || "");
    renderSnapshot(next || "");
    persistHistory(next || "");
  });

  updateHistoryButtons();
  canvas.addEventListener("pointerdown", start);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointerleave", stop);
}

function saveCanvasSketch(canvas) {
  const stageState = state.stages.F || {};
  const currentData = canvas.toDataURL("image/png");
  stageState.sketchCanvasData = currentData;
  stageState.sketchUploadData = stageState.sketchUploadData || "";
  stageState.sketchUndoStack = Array.isArray(stageState.sketchUndoStack) && stageState.sketchUndoStack.length
    ? stageState.sketchUndoStack
    : [currentData];
  stageState.sketchRedoStack = Array.isArray(stageState.sketchRedoStack) ? stageState.sketchRedoStack : [];
  state.stages.F = stageState;
  saveState();
  renderStageForm();
}

function clearCanvasSketch(canvas) {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#fffaf2";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const stageState = state.stages.F || {};
  const currentData = canvas.toDataURL("image/png");
  const history = Array.isArray(stageState.sketchUndoStack) && stageState.sketchUndoStack.length
    ? stageState.sketchUndoStack
    : [currentData];
  stageState.sketchUndoStack = [...history, ""];
  stageState.sketchRedoStack = [];
  stageState.sketchCanvasData = "";
  state.stages.F = stageState;
  saveState();
  renderStageForm();
}

function handleSketchImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const stageState = state.stages.F || {};
    stageState.sketchUploadData = typeof reader.result === "string" ? reader.result : "";
    state.stages.F = stageState;
    saveState();
    renderStageForm();
  };
  reader.readAsDataURL(file);
}

function removeSketchImage() {
  const stageState = state.stages.F || {};
  stageState.sketchUploadData = "";
  state.stages.F = stageState;
  saveState();
  renderStageForm();
}

function setSketchBrushColor(color) {
  const stageState = state.stages.F || {};
  stageState.sketchBrushColor = color;
  state.stages.F = stageState;
  saveState();
  if (activeSketchCanvasContext) {
    activeSketchCanvasContext.strokeStyle = color;
  } else {
    renderStageForm();
    return;
  }
  syncSketchColorControls(color);
}

function syncSketchColorControls(color) {
  const normalized = String(color || "").toLowerCase();
  document.querySelectorAll(".color-swatch").forEach((button) => {
    button.classList.toggle("active", button.dataset.color === normalized);
  });
  const picker = document.getElementById("sketch-custom-color-picker");
  if (picker && picker.value.toLowerCase() !== normalized) {
    picker.value = color;
  }
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function setLabelAndPlaceholder(id, labelText, placeholder) {
  const input = document.getElementById(id);
  const label = input.closest("label");
  if (label?.firstChild) label.firstChild.textContent = labelText;
  if ("placeholder" in input) input.placeholder = placeholder;
}

function format(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function formatBlock(template, values) {
  return format(template, values).replaceAll("\n", "<br />");
}

function formatDate(isoString) {
  return new Intl.DateTimeFormat(currentLang === "zh" ? "zh-CN" : "es-ES", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(isoString));
}

function t(path) {
  return path.split(".").reduce((value, key) => value?.[key], i18n[currentLang]) ?? path;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
