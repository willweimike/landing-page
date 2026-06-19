/* ================================================================
   Autonomy i18n — Bilingual Translation System
   Author: Bill Liu
   Languages: zh-TW (default), en
   ================================================================ */

'use strict';

/* ── 1. Translations Object ─────────────────────────────────── */
const I18N = {
  zh: {
    nav: {
      about: '設計理念',
      features: '核心模組',
      arch: '系統架構',
      toolsets: '工具集',
      author: '作者',
    },
    hero: {
      badge: 'Python 3.13 · 自律執行中',
      title2: '自律型 AI',
      title3: '代理人框架',
      subtitle: '以 <strong>Beam Search 候選排序</strong>、<strong>受管行動閘道</strong>與<strong>程序技能學習</strong>為核心，<br />打造真正能自主感知、規劃、執行並持續進化的 AI 代理人系統。',
      explore: '探索核心模組',
      github: '查看原始碼',
      stat1: '內建 Procedure Skills',
      stat2: '+ 內建工具',
      stat3: '支援 AI Provider',
      stat4: 'Beam Width',
    },
    about: {
      tag: '設計理念',
      h2: 'AgentLoop：自導向任務迴圈',
      desc: '每個執行回合（Turn）依固定五步驟推進，直到目標達成、被封鎖或超過步數上限',
      lead: '<mark>AgentLoop</mark> 是 Autonomy 的核心驅動器——一個「自導向任務迴圈」，不需要人工介入即可從目標出發，自主選擇工具、執行行動並從結果中學習。',
      body1: '每個 Turn 的執行流程：①從技能庫選取相關 <code>ProcedureSkill</code>，②由 LLM 提案 + RecipeEngine 產出候選動作路徑，③以 5 維評分排序（Beam Width=3），④透過 <code>ActionGateway</code> 受管執行，⑤評估結果並觸發學習。',
      body2: '終止條件明確：<code>ACHIEVED</code>（目標完成）、<code>BLOCKED</code>（無法繼續）、<code>NO_CANDIDATES</code>、<code>APPROVAL_DENIED</code>、<code>MAX_STEPS_REACHED</code>、或 <code>FAILED</code>——系統永遠不會陷入無限循環。',
    },
    tf: {
      s1: '選取相關技能',
      s2: 'LLM 提案 + Recipe Engine',
      s3: '5 維評分 · Beam Width=3',
      s4: 'ApprovalPolicy 授權 · 受管執行',
      s5: '結果評估 · Recipe 學習',
    },
    feat: {
      tag: '核心模組',
      h2: '十二大技術特點',
      desc: '每個特點都直接對應 Autonomy 原始碼中的具體實作',
      f1t: '自導向代理人迴圈',
      f1d: '<code>AgentLoop.run(goal, max_steps=12)</code> 啟動後完全自主執行，每步驟透過 <code>run_turn()</code> 推進。支援互動模式（<code>interactive=True</code>）與批次模式，所有事件均以 <code>run_id</code> 記錄於 <code>AutonomyStore</code>。',
      f2t: '受管行動閘道',
      f2d: '所有工具呼叫必須通過 <code>ActionGateway</code> 的 <code>ApprovalPolicy</code> 授權。每個動作帶有 <code>RiskLevel</code>（LOW / MEDIUM / HIGH）、<code>expected_effect</code> 與 <code>verification_plan</code>，確保執行可控、可審計。',
      f3t: '5 維 Beam Search 評分',
      f3d: '<code>CandidateSelector</code> 以 evidence_strength（+0.30）、purpose（+0.10）、risk（−0.35）、side_effects（−0.20）、penalty（−1.0）五個維度計算總分，選出前 <code>beam_width=3</code> 名候選路徑送往執行。',
      f4t: '混合結果評估',
      f4d: '<code>DeterministicOutcomeEvaluator</code> 優先判斷執行失敗（直接 BLOCKED），成功但結果不確定時再交由 <code>ModelAssistedOutcomeEvaluator</code> 呼叫 LLM 語義判斷——最小化昂貴的模型呼叫次數。',
      f5t: '程序技能庫（13 內建）',
      f5d: '<code>ProcedureSkillLibrary</code> 內建 13 個 bundled skills，涵蓋 api-debugging、browser-navigation、code-editing、codebase-documentation、plan、procedure-skill-authoring、process-management、requesting-code-review、systematic-debugging、technical-spike、TDD、website-inspection、writing-plans。每步依可用工具、平台動態篩選并載入最相關技能。',
      f6t: '後執行學習迴路',
      f6d: '每次 Run 結束後，<code>LearningLoop.review_run()</code> 自動觸發：若結果為 ACHIEVED 且有 ≥2 個成功步驟，自動起草新 <code>ProcedureSkillDraft</code>（信心度 0.85），生成 <code>LearningProposal</code> 等待審核。',
      f7t: 'Action Recipe 引擎',
      f7d: '<code>RecipeEngine</code> 監控每個成功動作的 SHA-256 指紋——當同一動作成功次數 ≥ <code>candidate_threshold=2</code>，自動升格為候選 Recipe，下次直接作為行動選項（source=<code>action_skill</code>）提出，無需 LLM 重新推理。',
      f8t: '技能策展守護程序',
      f8d: '每次 Run 結束後，<code>CuratorDaemon</code> 在後台執行緒（<code>daemon=True</code>）非同步啟動 <code>SkillCurator.apply_auto_merges()</code>，自動偵測並合併重複（信心 0.95）或子集（信心 0.90）技能，防止技能庫膨脹。',
      f9t: '可擴展工具集目錄',
      f9d: '<code>TOOLSET_CATALOG</code> 涵蓋 4 個預設啟用工具集：file、terminal、search、skills，加上 opt-in 的 project（git / JSON / YAML / Python 測試探索）與 browser（Playwright headless Chromium，11 工具）。規劃中：memory、delegate、cronjob、computer_use。',
      f10t: '完整事件溯源稽核',
      f10d: '<code>AutonomyStore</code> 以 Event Sourcing 模式記錄整個執行生命週期：run_started → skills_selected → candidates_ranked → action_selected → approval_decision → observation → outcome_evaluated → recipe_learned → learning_review → run_finished，完整可重播。',
      f11t: 'TUI 終端互動介面',
      f11d: '<code>autonomy tui</code> 啟動豐富終端介面，提供 session 總覽面板、回合記錄、Action trail、compact/full 切換模式與 <code>/</code> 指令面板。自然語言直接流入 <code>AgentLoop</code>，UI 永遠不直接執行工具。',
      f12t: '多 Provider 支援',
      f12d: '支援 <code>ollama</code>（本地）與 8 個 OpenAI-compatible providers：openai-api、nvidia、openrouter、deepseek、xai、zai、kimi-coding、alibaba。API 金鑰儲存於 workspace <code>.autonomy/.env</code>（mode 0600），<code>autonomy doctor</code> 可檢查端點走通性。',
    },
    score: {
      tag: 'CandidateSelector',
      h2: '5 維候選評分系統',
      desc: '每個候選動作路徑依以下公式計算總分，選出前 3 名送往執行',
      b1: '動作有充分依據與證據加分',
      b2: '有明確目的說明加分',
      b3: 'HIGH risk 扣最多，LOW 不扣分',
      b4: '有副作用的動作扣分',
      b5: '已執行過或工具不可用，大量扣分',
    },
    arch: {
      tag: '系統架構',
      h2: '真實模組關係圖',
      desc: '每個方塊對應 Autonomy 原始碼中的實際類別或模組',
      techtitle: 'TOOLSET_CATALOG — 工具集 & AI Providers',
      providertitle: '支援 AI Provider（9 個）',
    },
    toolsets: {
      tag: '內建技能',
      h2: '13 個 Bundled Procedure Skills',
      desc: '每個技能以 SKILL.md 格式定義，包含名稱、描述、所需工具與平台篩選',
      note: '每次執行 Turn 時，<code>model.select_procedure_skills()</code> 依可用工具名稱動態篩選並載入最相關技能；執行成功且達到門櫞後，<code>LearningLoop</code> 將自動起草新技能並生成 <code>LearningProposal</code>（CANDIDATE 狀態）。',
    },
    demo: {
      tag: '真實事件序列',
      h2: 'AgentLoop 執行日誌',
      desc: '以下事件序列直接對應 AutonomyStore.record_event() 的實際呼叫順序',
      terminaltitle: 'autonomy · AgentLoop · run_id: a3f9c2e1',
    },
    author: {
      tag: '作者介紹',
      h2: '關於作者',
      role: 'Autonomy 框架設計者 &amp; AI Agent 系統工程師',
      bio1: '設計並實作了 Autonomy 自律型 AI 代理人框架，核心貢獻包括：Beam Search 候選評分系統、受管行動閘道（ActionGateway）、後執行學習迴路（LearningLoop）、以及後台技能策展守護程序（CuratorDaemon）。',
      bio2: '致力於讓 AI 代理人在真實工程環境中可靠運行——從程式碼編輯、瀏覽器自動化到系統除錯，透過可組合的技能庫與事件溯源架構實現完整可審計性。',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
    cta: {
      h2: '準備好打造你的自律型 AI 代理人了嗎？',
      desc: 'Fork Autonomy，添加你的工具集、訓練專屬技能庫，讓代理人在你的領域自主作業。',
      github: '前往 GitHub',
      contact: '聯絡作者',
    },
    footer: {
      tagline: '自律型 AI 代理人框架 · 由 Bill Liu 設計與實作',
      copy: '© 2025 Bill Liu · Autonomy Framework · AgentLoop · ProcedureSkillLibrary · CuratorDaemon',
    },
  },

  en: {
    nav: {
      about: 'Philosophy',
      features: 'Core Modules',
      arch: 'Architecture',
      toolsets: 'Toolsets',
      author: 'Author',
    },
    hero: {
      badge: 'Python 3.13 · Running Autonomously',
      title2: 'Autonomous AI',
      title3: 'Agent Framework',
      subtitle: 'Built around <strong>Beam Search candidate ranking</strong>, <strong>governed action gateway</strong>, and <strong>procedural skill learning</strong> — a framework for AI agents that truly perceive, plan, act, and continuously evolve.',
      explore: 'Explore Core Modules',
      github: 'View Source Code',
      stat1: 'Built-in Procedure Skills',
      stat2: '+ Built-in Tools',
      stat3: 'AI Providers Supported',
      stat4: 'Beam Width',
    },
    about: {
      tag: 'Design Philosophy',
      h2: 'AgentLoop: Self-Directed Task Loop',
      desc: 'Each Turn advances through a fixed five-step pipeline until the goal is achieved, blocked, or step limit is reached',
      lead: '<mark>AgentLoop</mark> is the core engine of Autonomy — a self-directed task loop that autonomously selects tools, executes actions, and learns from results without human intervention.',
      body1: "Each Turn's execution flow: ① Select relevant <code>ProcedureSkill</code> from the library, ② LLM proposals + RecipeEngine generate candidate action paths, ③ Rank by 5-dimensional scoring (Beam Width=3), ④ Governed execution via <code>ActionGateway</code>, ⑤ Evaluate outcome and trigger learning.",
      body2: 'Termination conditions are explicit: <code>ACHIEVED</code> (goal met), <code>BLOCKED</code> (cannot continue), <code>NO_CANDIDATES</code>, <code>APPROVAL_DENIED</code>, <code>MAX_STEPS_REACHED</code>, or <code>FAILED</code> — the system never enters an infinite loop.',
    },
    tf: {
      s1: 'Select relevant skills',
      s2: 'LLM proposals + Recipe Engine',
      s3: '5-dim scoring · Beam Width=3',
      s4: 'ApprovalPolicy auth · Governed exec',
      s5: 'Outcome evaluation · Recipe learning',
    },
    feat: {
      tag: 'Core Modules',
      h2: '12 Technical Highlights',
      desc: 'Every feature maps directly to a concrete implementation in the Autonomy source code',
      f1t: 'Self-Directed Agent Loop',
      f1d: '<code>AgentLoop.run(goal, max_steps=12)</code> runs fully autonomously once started, advancing each step via <code>run_turn()</code>. Supports interactive (<code>interactive=True</code>) and batch modes, with all events recorded in <code>AutonomyStore</code> by <code>run_id</code>.',
      f2t: 'Governed Action Gateway',
      f2d: "All tool calls must pass <code>ActionGateway</code>'s <code>ApprovalPolicy</code> authorization. Every action carries a <code>RiskLevel</code> (LOW / MEDIUM / HIGH), <code>expected_effect</code>, and <code>verification_plan</code>, ensuring execution is controlled and auditable.",
      f3t: '5-Dimensional Beam Search Scoring',
      f3d: '<code>CandidateSelector</code> calculates total score using five dimensions: evidence_strength (+0.30), purpose (+0.10), risk (−0.35), side_effects (−0.20), penalty (−1.0), then selects the top <code>beam_width=3</code> candidate paths for execution.',
      f4t: 'Hybrid Outcome Evaluation',
      f4d: '<code>DeterministicOutcomeEvaluator</code> prioritizes failed executions (immediately BLOCKED), while <code>ModelAssistedOutcomeEvaluator</code> calls LLM semantic judgment only for successful but uncertain outcomes — minimizing expensive model calls.',
      f5t: 'Procedure Skill Library (13 Built-in)',
      f5d: '<code>ProcedureSkillLibrary</code> ships with 13 bundled skills: api-debugging, browser-navigation, code-editing, codebase-documentation, plan, procedure-skill-authoring, process-management, requesting-code-review, systematic-debugging, technical-spike, TDD, website-inspection, writing-plans. The most relevant skills are dynamically filtered by available tools and platform, then loaded each step.',
      f6t: 'Post-Execution Learning Loop',
      f6d: 'After each Run, <code>LearningLoop.review_run()</code> auto-triggers: if the result is ACHIEVED with ≥2 successful steps, it drafts a new <code>ProcedureSkillDraft</code> (confidence 0.85), generating a <code>LearningProposal</code> awaiting review.',
      f7t: 'Action Recipe Engine',
      f7d: "<code>RecipeEngine</code> monitors the SHA-256 fingerprint of every successful action. When the same action succeeds ≥ <code>candidate_threshold=2</code> times, it's promoted to a candidate Recipe and directly proposed as an action option (source=<code>action_skill</code>), bypassing LLM re-inference.",
      f8t: 'Skill Curator Daemon',
      f8d: 'After each Run, <code>CuratorDaemon</code> asynchronously launches <code>SkillCurator.apply_auto_merges()</code> in a background thread (<code>daemon=True</code>), automatically detecting and merging duplicate (confidence 0.95) or subset (confidence 0.90) skills to prevent library bloat.',
      f9t: 'Extensible Toolset Catalog',
      f9d: '<code>TOOLSET_CATALOG</code> includes 4 default-enabled toolsets: file, terminal, search, skills, plus opt-in toolsets: project (git / JSON / YAML / Python test discovery) and browser (Playwright headless Chromium, 11 tools). Planned: memory, delegate, cronjob, computer_use.',
      f10t: 'Full Event Sourcing Audit',
      f10d: '<code>AutonomyStore</code> records the complete execution lifecycle in Event Sourcing pattern: run_started → skills_selected → candidates_ranked → action_selected → approval_decision → observation → outcome_evaluated → recipe_learned → learning_review → run_finished, fully replayable.',
      f11t: 'TUI Terminal Interface',
      f11d: '<code>autonomy tui</code> launches a rich terminal UI with session overview panel, turn transcript, Action trail, compact/full toggle, and <code>/</code> command palette. Natural language flows directly into <code>AgentLoop</code>; the UI never executes tools directly.',
      f12t: 'Multi-Provider Support',
      f12d: 'Supports <code>ollama</code> (local) and 8 OpenAI-compatible providers: openai-api, nvidia, openrouter, deepseek, xai, zai, kimi-coding, alibaba. API keys stored in workspace <code>.autonomy/.env</code> (mode 0600). <code>autonomy doctor</code> verifies endpoint reachability.',
    },
    score: {
      tag: 'CandidateSelector',
      h2: '5-Dimensional Candidate Scoring',
      desc: 'Each candidate action path is scored by the formula below; the top 3 are sent for execution',
      b1: 'Evidence-backed actions score higher',
      b2: 'Clear purpose statement adds score',
      b3: 'HIGH risk penalized most; LOW has zero penalty',
      b4: 'Actions with side effects are penalized',
      b5: 'Already-executed or unavailable tools are heavily penalized',
    },
    arch: {
      tag: 'Architecture',
      h2: 'Real Module Relationship Diagram',
      desc: 'Each block corresponds to an actual class or module in the Autonomy source code',
      techtitle: 'TOOLSET_CATALOG — Toolsets & AI Providers',
      providertitle: 'Supported AI Providers (9)',
    },
    toolsets: {
      tag: 'Built-in Skills',
      h2: '13 Bundled Procedure Skills',
      desc: 'Each skill is defined in SKILL.md format with name, description, required tools, and platform filter',
      note: 'On each Turn, <code>model.select_procedure_skills()</code> dynamically filters and loads the most relevant skills based on available tool names and platform. After a successful Run meeting the threshold, <code>LearningLoop</code> auto-drafts a new skill and generates a <code>LearningProposal</code> (CANDIDATE status).',
    },
    demo: {
      tag: 'Real Event Sequence',
      h2: 'AgentLoop Execution Log',
      desc: 'The event sequence below directly corresponds to the actual call order of AutonomyStore.record_event()',
      terminaltitle: 'autonomy · AgentLoop · run_id: a3f9c2e1',
    },
    author: {
      tag: 'About the Author',
      h2: 'Author',
      role: 'Autonomy Framework Designer &amp; AI Agent Systems Engineer',
      bio1: 'Designed and implemented the Autonomy autonomous AI agent framework. Core contributions: Beam Search candidate scoring system, Governed Action Gateway (ActionGateway), Post-execution Learning Loop (LearningLoop), and background Skill Curator Daemon (CuratorDaemon).',
      bio2: 'Dedicated to making AI agents reliably operate in real engineering environments — from code editing and browser automation to system debugging — through composable skill libraries and event-sourced architecture for full auditability.',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
    cta: {
      h2: 'Ready to Build Your Autonomous AI Agent?',
      desc: 'Fork Autonomy, add your toolsets, train your skill library, and let the agent operate autonomously in your domain.',
      github: 'Go to GitHub',
      contact: 'Contact Author',
    },
    footer: {
      tagline: 'Autonomous AI Agent Framework · Designed & Implemented by Bill Liu',
      copy: '© 2025 Bill Liu · Autonomy Framework · AgentLoop · ProcedureSkillLibrary · CuratorDaemon',
    },
  },
};

/* ── 2. Resolution helper (dot-path) ─────────────────────────── */
function t(key, lang) {
  const parts = key.split('.');
  let node = I18N[lang];
  for (const p of parts) {
    if (node == null) return undefined;
    node = node[p];
  }
  return node;
}

/* ── 3. Apply Language ───────────────────────────────────────── */
function applyLanguage(lang) {
  // Update <html lang>
  document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';

  // textContent elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t(el.dataset.i18n, lang);
    if (val != null) el.textContent = val;
  });

  // innerHTML elements (contain <code>, <strong>, <mark> etc.)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const val = t(el.dataset.i18nHtml, lang);
    if (val != null) el.innerHTML = val;
  });

  // aria-label elements
  document.querySelectorAll('[data-i18n-label]').forEach(el => {
    const val = t(el.dataset.i18nLabel, lang);
    if (val != null) el.setAttribute('aria-label', val);
  });

  // Update switcher appearance
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    const zhEl = btn.querySelector('.lang-toggle__zh');
    const enEl = btn.querySelector('.lang-toggle__en');
    if (zhEl) zhEl.classList.toggle('lang-toggle__active', lang === 'zh');
    if (enEl) enEl.classList.toggle('lang-toggle__active', lang === 'en');
    btn.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切換至中文');
  }

  // Persist
  try { localStorage.setItem('autonomy-lang', lang); } catch (_) {}

  // Dispatch event so main.js can react (e.g., restart terminal)
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

/* ── 4. Init ─────────────────────────────────────────────────── */
function initI18n() {
  let lang = 'zh';
  try {
    const saved = localStorage.getItem('autonomy-lang');
    if (saved === 'en' || saved === 'zh') lang = saved;
  } catch (_) {}

  // Wire up toggle button
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.lang === 'zh-TW' ? 'zh' : 'en';
      applyLanguage(current === 'zh' ? 'en' : 'zh');
    });
  }

  applyLanguage(lang);
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}
