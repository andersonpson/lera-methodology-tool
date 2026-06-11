const LANGUAGE_STORAGE_KEY = "lera-ui-language";
const LEGACY_LANGUAGE_STORAGE_KEY = "restaurant-database-language";
const STAGE_ORDER = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function getInitialLanguage() {
  return "es";
}

function persistLanguage() {}

const reportParams = new URLSearchParams(window.location.search);
const projectCode = reportParams.get("projectCode") || "";
const versionCode = reportParams.get("versionCode") || "";
const eventCode = reportParams.get("eventCode") || "";
const sectionTarget = reportParams.get("section") || "";

const reportState = {
  item: null,
  highlightEventCode: eventCode,
  currentLang: getInitialLanguage()
};

const VALUE_LABELS = {
  zh: {
    protagonista: "主角",
    liquido: "液体",
    crujiente: "脆感",
    aromatico: "香气",
    cambio_de_estacion: "季节变化",
    relectura_producto_habitual: "重新解读常用产品",
    nueva_narrativa: "新的叙事",
    influencia_otra_cultura: "其他文化影响",
    nuevas_formas_presentar: "新的呈现方式",
    mejor_textura_cada_pieza: "为每个部位寻找最佳质地",
    approved_for_menu: "批准进入菜单",
    advance: "继续推进",
    archived: "已归档",
    yes: "是",
    no: "否",
    balanced: "平衡"
  },
  es: {
    protagonista: "Protagonista",
    secundario: "Secundario",
    liquido: "Parte líquida",
    solido: "Elemento sólido",
    crujiente: "Elemento crujiente",
    aromatico: "Elemento aromático",
    graso: "Elemento graso",
    decorativo: "Elemento decorativo",
    otro: "Otro elemento",
    operational_need: "Necesidad operativa",
    conceptual_need: "Necesidad conceptual",
    product_need: "Necesidad de producto",
    inspiration_accumulation: "Acumulación de inspiración",
    cambio_disponibilidad_producto: "Cambio de disponibilidad del producto",
    cambio_de_estacion: "Cambio de estación",
    sustitucion_del_plato: "Sustitución del plato",
    aprovechamiento_excedentes: "Aprovechamiento de excedentes",
    equilibrio_del_menu: "Equilibrio del menú",
    optimizacion_rentabilidad: "Optimización de rentabilidad",
    nueva_tendencia_culinaria: "Nueva tendencia culinaria",
    desarrollo_aprendizaje_reciente: "Desarrollo de aprendizaje reciente",
    referencia_historica: "Referencia histórica",
    exploracion_tecnica: "Exploración técnica",
    entrada_inesperada_producto: "Entrada inesperada del producto",
    producto_excepcional: "Producto excepcional",
    producto_olvidado: "Producto olvidado",
    producto_infrautilizado: "Producto infrautilizado",
    relectura_producto_habitual: "Relectura de producto habitual",
    emotion: "Emoción",
    memory: "Memoria",
    learning: "Aprendizaje",
    tradition: "Tradición",
    product_logic: "Producto",
    divertido: "Divertido",
    memoria_casa_infancia: "Memoria de casa / infancia",
    recuerdos_gustativos: "Recuerdos gustativos",
    error_previo: "Error previo",
    nueva_narrativa: "Nueva narrativa",
    influencia_otra_cultura: "Influencia de otra cultura",
    nuevas_combinaciones_sabores_texturas: "Nuevas combinaciones de sabores y texturas",
    nuevas_combinaciones_ingredientes: "Nuevas combinaciones de ingredientes",
    interaccion_otras_personas: "Interacción con otras personas",
    tradicion_sin_tocar: "Tradición sin tocar",
    tecnicas_ancestrales: "Técnicas ancestrales",
    nuevas_formas_presentar: "Nuevas formas de presentar la tradición",
    cambiar_elementos_receta_tradicional: "Cambio de elementos de una receta tradicional",
    mejor_textura_cada_pieza: "Búsqueda de la mejor textura para cada pieza",
    aprovechamiento_total: "Aprovechamiento total",
    cambio_protagonista_plato: "Cambio de protagonista del plato",
    busqueda_combinacion_atributos_sensoriales: "Búsqueda de la combinación de atributos sensoriales",
    wholeDish: "Plato completo",
    singleElement: "Elemento",
    approved_for_menu: "Aprobado para menú",
    advance: "Avanzar",
    adjust: "Ajustar",
    rollback_to_d: "Volver a D",
    rollback_to_g: "Volver a G",
    pending_timing: "Pendiente de momento",
    continue_development: "Continuar desarrollo",
    archived: "Archivado",
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
    none: "Sin ajuste",
    proportion_correction: "Corrección de proporciones",
    technique_revision: "Revisión técnica",
    simplification: "Simplificación",
    element_removal: "Eliminación de elemento",
    menu_position_change: "Cambio de posición en menú",
    balanced: "Equilibrado"
  }
};

const i18n = {
  zh: {
    htmlLang: "zh-CN",
    brandEyebrow: "Lera 方法论",
    brandTitle: "方法论使用报告",
    backButton: "返回上一页",
    printReport: "保存 PDF",
    printFailed: "打印未能启动，请重试。",
    savePdfFailed: "保存 PDF 失败，请重试。",
    savePdfFailedWithReason: "保存 PDF 失败：",
    printDocumentTitle: "方法论使用记录",
    printProjectCodeLabel: "项目编码",
    printDishNameLabel: "菜品名称",
    printVersionLabel: "记录版本",
    printStageLabel: "当前阶段",
    homeLink: "返回主页",
    backList: "返回方法论列表",
    metaTitle: "基础信息",
    metaFinalVersion: "当前记录",
    metaProjectCode: "项目编码",
    metaDishName: "菜品名称",
    metaLinkedDishCode: "关联菜品编码",
    metaCurrentStage: "当前阶段",
    metaCurrentStatus: "当前状态",
    contentEyebrow: "阶段记录",
    contentTitle: "最终填写内容",
    changesEyebrow: "修改留痕",
    changesTitle: "进行过的修改",
    changesEmpty: "",
    toolsEyebrow: "工具使用",
    toolsTitle: "工具使用说明",
    toolsEmpty: "",
    empty: "未找到",
    noText: "-",
    timelineTool: "工具使用",
    timelineRollback: "正式回退",
    rollbackRoute: "回退路径",
    rollbackReason: "修改原因",
    rollbackElements: "受影响元素",
    rollbackTechniques: "受影响技法",
    rollbackOccurred: "是否发生过正式回退",
    rollbackOccurredYes: "是",
    rollbackOccurredNo: "否",
    rollbackRefs: "对应记录",
    toolTarget: "对应元素",
    toolOutput: "采用结果",
    toolAlternatives: "同时比较过",
    recordRef: "记录编号",
    stageTitles: {
      A: "A. 菜品创造的需求",
      B: "B. 创意基础",
      C: "C. 元素、属性与功能",
      D: "D. 每个元素的呈现方式",
      E: "E. 适配每个元素的技术",
      F: "F. 概念验证",
      G: "G. 厨房测试",
      H: "H. 验证与调整",
      I: "I. 决策",
      J: "J. 文档归档"
    },
    fieldLabels: {
      selected: "已选方向",
      brief: "起因说明",
      serviceGoal: "服务目标",
      creativeBasis: "创意基础",
      productBasis: "原料依据",
      concept: "概念",
      dishIdeaSummary: "菜品构想",
      selectedElements: "选定元素",
      protagonist_product: "主角",
      protagonista_product: "主角产品",
      protagonista_flavor: "主角风味",
      protagonista_texture: "主角质地",
      protagonista_aroma: "主角香气",
      protagonista_temperature: "主角温度",
      protagonista_function: "主角功能",
      protagonista_tasteIntensity: "主角风味强度",
      protagonista_textureIntensity: "主角质地强度",
      protagonista_aromaIntensity: "主角香气强度",
      liquid_product: "液体",
      liquido_product: "液体产品",
      liquido_flavor: "液体风味",
      liquido_texture: "液体质地",
      liquido_aroma: "液体香气",
      liquido_temperature: "液体温度",
      liquido_function: "液体功能",
      liquido_tasteIntensity: "液体风味强度",
      liquido_textureIntensity: "液体质地强度",
      liquido_aromaIntensity: "液体香气强度",
      decorativo_product: "装饰元素产品",
      decorativo_flavor: "装饰元素风味",
      decorativo_texture: "装饰元素质地",
      decorativo_aroma: "装饰元素香气",
      decorativo_temperature: "装饰元素温度",
      decorativo_function: "装饰元素功能",
      decorativo_tasteIntensity: "装饰元素风味强度",
      decorativo_textureIntensity: "装饰元素质地强度",
      decorativo_aromaIntensity: "装饰元素香气强度",
      otro_customName: "其他元素名称",
      otro_product: "其他元素产品",
      otro_flavor: "其他元素风味",
      otro_texture: "其他元素质地",
      otro_aroma: "其他元素香气",
      otro_temperature: "其他元素温度",
      otro_function: "其他元素功能",
      otro_tasteIntensity: "其他元素风味强度",
      otro_textureIntensity: "其他元素质地强度",
      otro_aromaIntensity: "其他元素香气强度",
      garnish_product: "配角 / 装饰",
      crujiente_product: "脆感产品",
      crujiente_flavor: "脆感风味",
      crujiente_texture: "脆感质地",
      crujiente_aroma: "脆感香气",
      crujiente_temperature: "脆感温度",
      crujiente_function: "脆感功能",
      crujiente_tasteIntensity: "脆感风味强度",
      crujiente_textureIntensity: "脆感质地强度",
      crujiente_aromaIntensity: "脆感香气强度",
      aromatico_product: "香气产品",
      aromatico_flavor: "香气风味",
      aromatico_texture: "香气质地",
      aromatico_aroma: "香气描述",
      aromatico_temperature: "香气温度",
      aromatico_function: "香气功能",
      aromatico_tasteIntensity: "香气风味强度",
      aromatico_textureIntensity: "香气质地强度",
      aromatico_aromaIntensity: "香气强度",
      structure: "结构",
      presentation_protagonista: "主角呈现方式",
      presentation_liquido: "液体呈现方式",
      presentation_crujiente: "脆感呈现方式",
      presentation_aromatico: "香气呈现方式",
      technique_protagonista: "主角技术方案",
      technique_liquido: "液体技术方案",
      technique_crujiente: "脆感技术方案",
      technique_aromatico: "香气技术方案",
      generalFlavor: "整体风味",
      generalTexture: "整体质地",
      generalAroma: "整体香气",
      aromaContributors: "提供整体香气的元素",
      aromaOverallDescription: "整体香气描述",
      aromaNotes: "注意事项",
      balanceAcidityIssue: "是否存在酸度问题",
      balanceAcidityIssueType: "酸度问题类型",
      risk: "风险点",
      revisionFocus: "调整重点",
      test1: "测试记录",
      test2: "第二轮测试",
      decision: "结论",
      sketchMode: "草图方式",
      sketchOrVisualization: "草图 / 可视化说明",
      sketchUploadData: "参考图",
      serviceTest: "服务测试",
      verificationDecision: "验证结论",
      finalStatus: "最终状态",
      technicalCard: "技术卡摘要",
      finalExecution: "最终执行结论",
      documentationNotes: "文档备注",
      archiveNote: "归档说明"
    }
  },
  es: {
    htmlLang: "es",
    brandEyebrow: "Metodología Lera",
    brandTitle: "Informe metodológico",
    backButton: "Volver",
    printReport: "Guardar PDF",
    printFailed: "No se pudo iniciar la impresión. Inténtalo de nuevo.",
    savePdfFailed: "No se pudo guardar el PDF. Inténtalo de nuevo.",
    savePdfFailedWithReason: "No se pudo guardar el PDF:",
    printDocumentTitle: "Registro de uso metodológico",
    printProjectCodeLabel: "Código de proyecto",
    printDishNameLabel: "Nombre del plato",
    printVersionLabel: "Versión del registro",
    printStageLabel: "Etapa actual",
    homeLink: "Inicio",
    backList: "Volver al listado metodológico",
    metaTitle: "Información base",
    metaFinalVersion: "Registro actual",
    metaProjectCode: "Código de proyecto",
    metaDishName: "Nombre del plato",
    metaLinkedDishCode: "Código del plato vinculado",
    metaCurrentStage: "Etapa actual",
    metaCurrentStatus: "Estado actual",
    contentEyebrow: "Registro por etapas",
    contentTitle: "Contenido final registrado",
    changesEyebrow: "Trazabilidad de cambios",
    changesTitle: "Cambios realizados",
    changesEmpty: "Todavía no se ha registrado ninguna modificación formal.",
    toolsEyebrow: "Uso de herramientas",
    toolsTitle: "Registro de uso de herramientas",
    toolsEmpty: "Todavía no se ha registrado ningún uso de herramienta.",
    empty: "No encontrado",
    noText: "-",
    timelineTool: "Uso de herramientas",
    timelineRollback: "Rollback formal",
    rollbackRoute: "Ruta de rollback",
    rollbackReason: "Motivo del cambio",
    rollbackElements: "Elementos afectados",
    rollbackTechniques: "Técnicas afectadas",
    rollbackOccurred: "¿Hubo rollback formal?",
    rollbackOccurredYes: "Sí",
    rollbackOccurredNo: "No",
    rollbackRefs: "Registros vinculados",
    toolTarget: "Elemento relacionado",
    toolOutput: "Resultado aplicado",
    toolAlternatives: "Opciones comparadas",
    recordRef: "Referencia del registro",
    stageTitles: {
      A: "A. Necesidad de la creación del plato",
      B: "B. Fundamentos creativos",
      C: "C. Elementos, atributos y funciones",
      D: "D. Forma de presentar cada elemento",
      E: "E. Técnicas adaptadas a cada elemento",
      F: "F. Prueba conceptual",
      G: "G. Pruebas en cocina",
      H: "H. Verificación y ajustes",
      I: "I. Decisión",
      J: "J. Documentación"
    },
    fieldLabels: {
      selected: "Selecciones",
      brief: "Motivo de partida",
      serviceGoal: "Objetivo de servicio",
      creativeBasis: "Fundamento creativo",
      productBasis: "Fundamento de producto",
      concept: "Concepto",
      dishIdeaSummary: "Idea general del plato",
      selectedElements: "Elementos seleccionados",
      protagonist_product: "Protagonista",
      protagonista_product: "Producto protagonista",
      protagonista_flavor: "Sabor del protagonista",
      protagonista_texture: "Textura del protagonista",
      protagonista_aroma: "Aroma del protagonista",
      protagonista_temperature: "Temperatura del protagonista",
      protagonista_function: "Función del protagonista",
      protagonista_tasteIntensity: "Intensidad de sabor del protagonista",
      protagonista_textureIntensity: "Intensidad de textura del protagonista",
      protagonista_aromaIntensity: "Intensidad aromática del protagonista",
      liquid_product: "Parte líquida",
      liquido_product: "Producto de la parte líquida",
      liquido_flavor: "Sabor de la parte líquida",
      liquido_texture: "Textura de la parte líquida",
      liquido_aroma: "Aroma de la parte líquida",
      liquido_temperature: "Temperatura de la parte líquida",
      liquido_function: "Función de la parte líquida",
      liquido_tasteIntensity: "Intensidad de sabor de la parte líquida",
      liquido_textureIntensity: "Intensidad de textura de la parte líquida",
      liquido_aromaIntensity: "Intensidad aromática de la parte líquida",
      decorativo_product: "Producto del elemento decorativo",
      decorativo_flavor: "Sabor del elemento decorativo",
      decorativo_texture: "Textura del elemento decorativo",
      decorativo_aroma: "Aroma del elemento decorativo",
      decorativo_temperature: "Temperatura del elemento decorativo",
      decorativo_function: "Función del elemento decorativo",
      decorativo_tasteIntensity: "Intensidad de sabor del elemento decorativo",
      decorativo_textureIntensity: "Intensidad de textura del elemento decorativo",
      decorativo_aromaIntensity: "Intensidad aromática del elemento decorativo",
      otro_customName: "Nombre del otro elemento",
      otro_product: "Producto del otro elemento",
      otro_flavor: "Sabor del otro elemento",
      otro_texture: "Textura del otro elemento",
      otro_aroma: "Aroma del otro elemento",
      otro_temperature: "Temperatura del otro elemento",
      otro_function: "Función del otro elemento",
      otro_tasteIntensity: "Intensidad de sabor del otro elemento",
      otro_textureIntensity: "Intensidad de textura del otro elemento",
      otro_aromaIntensity: "Intensidad aromática del otro elemento",
      garnish_product: "Acompañamiento / acabado",
      crujiente_product: "Producto del elemento crujiente",
      crujiente_flavor: "Sabor del elemento crujiente",
      crujiente_texture: "Textura del elemento crujiente",
      crujiente_aroma: "Aroma del elemento crujiente",
      crujiente_temperature: "Temperatura del elemento crujiente",
      crujiente_function: "Función del elemento crujiente",
      crujiente_tasteIntensity: "Intensidad de sabor del elemento crujiente",
      crujiente_textureIntensity: "Intensidad de textura del elemento crujiente",
      crujiente_aromaIntensity: "Intensidad aromática del elemento crujiente",
      aromatico_product: "Producto del elemento aromático",
      aromatico_flavor: "Sabor del elemento aromático",
      aromatico_texture: "Textura del elemento aromático",
      aromatico_aroma: "Descripción aromática",
      aromatico_temperature: "Temperatura del elemento aromático",
      aromatico_function: "Función del elemento aromático",
      aromatico_tasteIntensity: "Intensidad de sabor del elemento aromático",
      aromatico_textureIntensity: "Intensidad de textura del elemento aromático",
      aromatico_aromaIntensity: "Intensidad aromática del elemento aromático",
      structure: "Estructura",
      presentation_protagonista: "Presentación del protagonista",
      presentation_liquido: "Presentación de la parte líquida",
      presentation_crujiente: "Presentación del elemento crujiente",
      presentation_aromatico: "Presentación del elemento aromático",
      technique_protagonista: "Técnica del protagonista",
      technique_liquido: "Técnica de la parte líquida",
      technique_crujiente: "Técnica del elemento crujiente",
      technique_aromatico: "Técnica del elemento aromático",
      generalFlavor: "Sabor general",
      generalTexture: "Textura general",
      generalAroma: "Aroma general",
      aromaContributors: "Elementos que aportan el aroma global",
      aromaOverallDescription: "Descripción aromática global",
      aromaNotes: "Observaciones",
      balanceAcidityIssue: "¿Existe un problema de acidez?",
      balanceAcidityIssueType: "Tipo de problema de acidez",
      risk: "Punto de riesgo detectado",
      revisionFocus: "Aspecto principal del ajuste",
      test1: "Registro de prueba",
      test2: "Segunda prueba",
      decision: "Decisión",
      sketchMode: "Modo de boceto",
      sketchOrVisualization: "Boceto / visualización",
      sketchUploadData: "Imagen de referencia",
      serviceTest: "Prueba de servicio",
      verificationDecision: "Decisión de verificación",
      finalStatus: "Estado final",
      technicalCard: "Resumen de la ficha técnica",
      finalExecution: "Conclusión de ejecución final",
      documentationNotes: "Nota documental",
      archiveNote: "Nota de archivo"
    }
  }
};

document.getElementById("back-button").addEventListener("click", () => window.history.back());
document.getElementById("print-report-button").addEventListener("click", async () => {
  try {
    document.title = getMethodologyReportWindowTitle();
    if (window.leraDesktop?.saveCurrentWindowPdf) {
      const result = await window.leraDesktop.saveCurrentWindowPdf({
        suggestedName: buildPdfFilename()
      });
      if (result?.status === "saved" || result?.status === "cancelled") return;
      if (result?.status === "failed") {
        throw new Error(result.message || "save-pdf-failed");
      }
    }
    if (window.leraDesktop?.printCurrentWindow) {
      const result = await window.leraDesktop.printCurrentWindow();
      if (result?.status === "printed" || result?.status === "cancelled") return;
      if (result?.status === "failed") {
        throw new Error(result.message || "print-failed");
      }
    }
    window.print();
  } catch (error) {
    console.error(error);
    const reason = error instanceof Error ? error.message : String(error || "");
    window.alert(`${t("savePdfFailedWithReason")} ${reason || t("savePdfFailed")}`);
  }
});

initMethodologyReport();

async function initMethodologyReport() {
  renderLanguage();
  if (!projectCode) return;

  const list = await fetchMethodologyList();
  const projectItems = list.filter((item) => item.project_code === projectCode);
  if (!projectItems.length) return;

  const targetItem = versionCode
    ? projectItems.find((item) => item.version_code === versionCode) || projectItems[0]
    : projectItems[0];

  const item = await fetchMethodologyReport(targetItem.project_code, targetItem.version_code);
  if (!item || !item.project_code) return;

  reportState.item = item;
  renderLanguage();
  renderMethodologyMeta(item);
  renderPrintHeader(item);
  renderMethodologyContent(item.payload_json?.state || {});
  renderHistorySections(getChangeLog(item.payload_json));
  scrollToRequestedTarget();
  document.getElementById("methodology-report-empty").style.display = "none";
}

function t(key) {
  return i18n[reportState.currentLang][key];
}

function getChangeLog(payload) {
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload.changeLog)) return payload.changeLog;
  if (payload.state && Array.isArray(payload.state.changeLog)) return payload.state.changeLog;
  return [];
}

function renderLanguage() {
  document.documentElement.lang = t("htmlLang");
  document.title = getMethodologyReportWindowTitle();
  setText("brand-eyebrow", t("brandEyebrow"));
  setText("brand-title", t("brandTitle"));
  setText("print-brand", t("brandEyebrow"));
  setText("print-document-title", t("printDocumentTitle"));
  setText("print-project-code-label", t("printProjectCodeLabel"));
  setText("print-dish-name-label", t("printDishNameLabel"));
  setText("print-version-label", t("printVersionLabel"));
  setText("print-stage-label", t("printStageLabel"));
  setText("back-button", t("backButton"));
  setText("print-report-button", t("printReport"));
  setText("home-link", t("homeLink"));
  setText("back-list-link", t("backList"));
  setText("meta-title", t("metaTitle"));
  setText("content-eyebrow", t("contentEyebrow"));
  setText("content-title", t("contentTitle"));
  setText("changes-eyebrow", t("changesEyebrow"));
  setText("changes-title", t("changesTitle"));
  setText("tools-eyebrow", t("toolsEyebrow"));
  setText("tools-title", t("toolsTitle"));
  document.getElementById("methodology-report-empty").textContent = t("empty");
}

function getMethodologyReportWindowTitle() {
  const dishName = reportState.item?.dish_name?.trim();
  const projectRef = reportState.item?.project_code || projectCode;
  const suffix = t("brandTitle");
  if (dishName) return `${dishName} · ${suffix}`;
  if (projectRef) return `${projectRef} · ${suffix}`;
  return `Lera · ${suffix}`;
}

function buildPdfFilename() {
  const item = reportState.item;
  const parts = [item?.project_code, item?.dish_name, item?.version_code].filter(Boolean);
  const rawName = parts.length ? parts.join("-") : "lera-methodology-report";
  return `${rawName.replace(/[<>:"/\\|?*\u0000-\u001F]+/g, "_")}.pdf`;
}

async function fetchMethodologyList() {
  const response = await fetch("/api/methodology");
  if (!response.ok) return [];
  return await response.json();
}

async function fetchMethodologyReport(projectCodeValue, versionCodeValue) {
  const response = await fetch(
    `/api/methodology?project_code=${encodeURIComponent(projectCodeValue)}&version_code=${encodeURIComponent(versionCodeValue)}`
  );
  if (!response.ok) return null;
  return await response.json();
}

function renderMethodologyMeta(item) {
  const container = document.getElementById("methodology-report-meta");
  container.innerHTML = `
    <label><span>${t("metaProjectCode")}</span><input value="${escapeHtmlAttr(item.project_code || t("noText"))}" readonly /></label>
    <label><span>${t("metaFinalVersion")}</span><input value="${escapeHtmlAttr(item.version_code || t("noText"))}" readonly /></label>
    <label><span>${t("metaDishName")}</span><input value="${escapeHtmlAttr(item.dish_name || t("noText"))}" readonly /></label>
    <label><span>${t("metaLinkedDishCode")}</span><input value="${escapeHtmlAttr(item.linked_dish_code || t("noText"))}" readonly /></label>
    <label><span>${t("metaCurrentStage")}</span><input value="${escapeHtmlAttr(item.current_stage || t("noText"))}" readonly /></label>
    <label><span>${t("metaCurrentStatus")}</span><input value="${escapeHtmlAttr(item.current_status || t("noText"))}" readonly /></label>
  `;
}

function renderPrintHeader(item) {
  setText("print-project-code-value", item?.project_code || t("noText"));
  setText("print-dish-name-value", item?.dish_name || t("noText"));
  setText("print-version-value", item?.version_code || t("noText"));
  setText("print-stage-value", item?.current_stage || t("noText"));
}

function renderMethodologyContent(state) {
  const stages = state?.stages || {};
  const container = document.getElementById("methodology-report-content");
  container.innerHTML = "";

  STAGE_ORDER.forEach((stageId) => {
    const stageState = stages[stageId];
    if (!hasRenderableStage(stageState)) return;
    const rows =
      stageId === "C"
        ? buildStageCContent(stageState)
        : stageId === "F"
          ? buildStageFContent(stageState)
          : buildStageRows(stageState);
    if (!rows.length) return;

    const card = document.createElement("article");
    card.className = "dashboard-card";
    card.innerHTML = `
      <div class="methodology-report-head">
        <h3>${escapeHtml(t("stageTitles")[stageId] || stageId)}</h3>
      </div>
      <div class="methodology-report-stage">${rows.join("")}</div>
    `;
    container.appendChild(card);
  });
}

function renderHistorySections(changeLog) {
  const rollbackContainer = document.getElementById("methodology-report-rollbacks");
  const toolContainer = document.getElementById("methodology-report-tools");
  rollbackContainer.innerHTML = "";
  toolContainer.innerHTML = "";

  const rollbacks = changeLog.filter((entry) => entry.type !== "attribute_tool");
  const tools = changeLog.filter((entry) => entry.type === "attribute_tool");

  if (!rollbacks.length) {
    rollbackContainer.innerHTML = `<div class="empty-state compact-empty">${t("changesEmpty")}</div>`;
  } else {
    rollbacks.forEach((entry) => {
      const card = document.createElement("article");
      card.className = `dashboard-card${entry.displayRef === reportState.highlightEventCode ? " highlighted-card" : ""}`;
      card.dataset.eventCode = entry.displayRef || "";
      card.innerHTML = renderRollbackEntry(entry);
      rollbackContainer.appendChild(card);
    });
  }

  if (!tools.length) {
    toolContainer.innerHTML = `<div class="empty-state compact-empty">${t("toolsEmpty")}</div>`;
  } else {
    tools.forEach((entry) => {
      const card = document.createElement("article");
      card.className = `dashboard-card${entry.displayRef === reportState.highlightEventCode ? " highlighted-card" : ""}`;
      card.dataset.eventCode = entry.displayRef || "";
      card.innerHTML = renderToolEntry(entry);
      toolContainer.appendChild(card);
    });
  }
}

function scrollToRequestedTarget() {
  requestAnimationFrame(() => {
    if (reportState.highlightEventCode) {
      const eventCard = document.querySelector(`[data-event-code="${cssEscape(reportState.highlightEventCode)}"]`);
      if (eventCard) {
        eventCard.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    const sectionId = resolveSectionId();
    if (!sectionId) return;
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function resolveSectionId() {
  if (sectionTarget === "changes") return "report-changes-section";
  if (sectionTarget === "tools") return "report-tools-section";
  if (sectionTarget === "content") return "report-content-section";
  if (reportState.highlightEventCode.startsWith("Cam-")) return "report-changes-section";
  if (reportState.highlightEventCode.startsWith("Herr-")) return "report-tools-section";
  return "report-content-section";
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === "function") {
    return window.CSS.escape(value);
  }
  return String(value).replaceAll('"', '\\"');
}

function renderToolEntry(entry) {
  return `
    <div class="methodology-report-head">
      <h3>${escapeHtml(t("timelineTool"))}</h3>
      <span class="support-copy">${escapeHtml(`${t("recordRef")}: ${entry.displayRef || t("noText")}`)}</span>
    </div>
    <div class="methodology-report-stage">
      ${buildFieldRow(t("toolTarget"), entry.targetElementLabel || entry.targetElement || t("noText"))}
      ${buildFieldRow(t("toolOutput"), entry.outputText || t("noText"))}
      ${buildFieldRow(t("toolAlternatives"), (entry.alternativeLabels || []).join(" / ") || t("noText"))}
    </div>
  `;
}

function renderRollbackEntry(entry) {
  return `
    <div class="methodology-report-head">
      <h3>${escapeHtml(t("timelineRollback"))}</h3>
      <span class="support-copy">${escapeHtml(`${t("recordRef")}: ${entry.displayRef || t("noText")}`)}</span>
    </div>
    <div class="methodology-report-stage">
      ${buildFieldRow(t("rollbackRoute"), `${entry.rollbackFromStage || t("noText")} -> ${entry.rollbackToStage || t("noText")}`)}
      ${buildFieldRow(t("rollbackReason"), entry.reasonForChange || t("noText"))}
      ${buildFieldRow(t("rollbackElements"), entry.affectedElements || t("noText"))}
      ${buildFieldRow(t("rollbackTechniques"), entry.affectedTechniques || t("noText"))}
    </div>
  `;
}

function buildStageRows(stageState) {
  return Object.entries(stageState || {})
    .filter(([key, value]) => key !== "attributeBranchSelections" && hasRenderableValue(value))
    .map(([key, value]) => buildFieldRow(getFieldLabel(key), formatValue(key, value)));
}

function buildStageCContent(stageState) {
  const blocks = [];
  const summaryKeys = ["selectedElements", "dishIdeaSummary", "structure"];
  const summaryRows = summaryKeys
    .filter((key) => hasRenderableValue(stageState?.[key]))
    .map((key) => buildFieldRow(getFieldLabel(key), formatValue(key, stageState[key])));

  if (summaryRows.length) {
    blocks.push(`
      <section class="methodology-stage-cluster">
        <div class="methodology-stage-cluster-body">
          ${summaryRows.join("")}
        </div>
      </section>
    `);
  }

  const selected = Array.isArray(stageState?.selectedElements) ? stageState.selectedElements : [];
  const orderedElements = selected.length ? selected : ["protagonista", "liquido", "crujiente", "aromatico"];
  const suffixes = [
    "product",
    "flavor",
    "texture",
    "aroma",
    "temperature",
    "function",
    "tasteIntensity",
    "textureIntensity",
    "aromaIntensity"
  ];

  orderedElements.forEach((elementKey) => {
    const rows = suffixes
      .map((suffix) => {
        const key = `${elementKey}_${suffix}`;
        if (!hasRenderableValue(stageState?.[key])) return "";
        return buildFieldRow(getFieldLabel(key), formatValue(key, stageState[key]));
      })
      .filter(Boolean);

    if (!rows.length) return;

    blocks.push(`
      <section class="methodology-stage-cluster">
        <div class="methodology-stage-cluster-head">
          <h4>${escapeHtml(formatAtomicValue(elementKey))}</h4>
        </div>
        <div class="methodology-stage-cluster-body">
          ${rows.join("")}
        </div>
      </section>
    `);
  });

  return blocks;
}

function buildStageFContent(stageState) {
  const blocks = [];
  const openQuestionKeys = ["generalFlavor", "generalTexture", "generalAroma"];
  const openRows = openQuestionKeys
    .filter((key) => hasRenderableValue(stageState?.[key]))
    .map((key) => buildFieldRow(getFieldLabel(key), formatValue(key, stageState[key])));

  if (openRows.length) {
    blocks.push(`
      <section class="methodology-stage-cluster">
        <div class="methodology-stage-cluster-body">
          ${openRows.join("")}
        </div>
      </section>
    `);
  }

  const sketchData = stageState?.sketchUploadData || stageState?.sketchCanvasData || "";
  if (sketchData) {
    blocks.push(`
      <section class="methodology-stage-cluster">
        <div class="methodology-stage-cluster-body">
          ${buildImageRow(getFieldLabel("sketchOrVisualization"), sketchData)}
        </div>
      </section>
    `);
  }

  const rollbackEntries = getChangeLog(reportState.item?.payload_json).filter(
    (entry) => entry.type !== "attribute_tool" && entry.rollbackFromStage === "F"
  );
  const rollbackOccurred = rollbackEntries.length > 0;
  blocks.push(`
    <section class="methodology-stage-cluster">
      <div class="methodology-stage-cluster-body">
        ${buildFieldRow(t("rollbackOccurred"), rollbackOccurred ? t("rollbackOccurredYes") : t("rollbackOccurredNo"))}
        ${rollbackOccurred ? buildFieldRow(t("rollbackRefs"), rollbackEntries.map((entry) => entry.displayRef || t("noText")).join(" / ")) : ""}
      </div>
    </section>
  `);

  return blocks;
}

function hasRenderableStage(stageState) {
  if (!stageState || typeof stageState !== "object") return false;
  return Object.entries(stageState).some(([key, value]) => key !== "attributeBranchSelections" && hasRenderableValue(value));
}

function hasRenderableValue(value) {
  if (value === "" || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function getFieldLabel(key) {
  return t("fieldLabels")[key] || humanizeKey(key);
}

function humanizeKey(key) {
  return String(key || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildFieldRow(label, value) {
  return `
    <div class="methodology-field-row">
      <strong>${escapeHtml(label)}</strong>
      <div class="detail-copy">${value}</div>
    </div>
  `;
}

function buildImageRow(label, imageData) {
  return `
    <div class="methodology-field-row">
      <strong>${escapeHtml(label)}</strong>
      <div class="detail-copy">
        <div class="sketch-preview methodology-report-sketch">
          <img src="${escapeHtmlAttr(imageData)}" alt="${escapeHtmlAttr(label)}" />
        </div>
      </div>
    </div>
  `;
}

function formatValue(key, value) {
  if (Array.isArray(value)) {
    return escapeHtml(value.map(formatAtomicValue).join(" / "));
  }
  if (typeof value === "object" && value) {
    return formatStructuredValue(key, value);
  }
  if (typeof value === "string" && value.startsWith("data:image/")) {
    return escapeHtml(t("fieldLabels").sketchUploadData);
  }
  return escapeHtml(formatAtomicValue(value));
}

function formatStructuredValue(key, value) {
  const lines = Object.entries(value).map(([subKey, subValue]) => {
    if (Array.isArray(subValue)) {
      return `${getFieldLabel(subKey)}: ${subValue.map((item) => formatAtomicValue(item?.outputText || item)).join(" / ")}`;
    }
    if (typeof subValue === "object" && subValue) {
      return `${getFieldLabel(subKey)}: ${JSON.stringify(subValue)}`;
    }
    return `${getFieldLabel(subKey)}: ${formatAtomicValue(subValue)}`;
  });
  return escapeHtml(lines.join("\n")).replaceAll("\n", "<br>");
}

function formatAtomicValue(value) {
  const langMap = VALUE_LABELS[reportState.currentLang] || {};
  return langMap[String(value)] || String(value);
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeHtmlAttr(value) {
  return escapeHtml(value);
}
