window.__ModuleLoader__.load({
  id: "dsh-context-badge",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    var STORAGE_KEY = "dsh-context-badge:v2";
    var LEGACY_STORAGE_KEY = "dsh-context-badge:v1";
    var STYLE_ID = "dsh-context-badge-style";

    var CSS = [
      ".dcb-row{display:flex;align-items:center;gap:8px;min-height:22px;color:var(--dsw-alias-label-secondary,#8b949e);font:12px ui-monospace,SFMono-Regular,Menlo,monospace;}",
      ".dcb-badge{border:1px solid var(--dsw-alias-border-l1,#444);background:var(--dsw-alias-bg-layer-2,#252525);color:var(--dsw-alias-label-primary,#eee);border-radius:999px;padding:3px 9px;cursor:pointer;font:inherit;white-space:nowrap;}",
      ".dcb-badge:hover{background:var(--dsw-alias-interactive-bg-hover,#333);}",
      ".dcb-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
      ".dcb-panel{position:fixed;right:24px;bottom:86px;width:min(460px,calc(100vw - 32px));max-height:min(680px,calc(100vh - 120px));z-index:9400;display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--dsw-alias-border-l1,#444);border-radius:14px;background:var(--dsw-alias-bg-layer-1,#1f1f1f);color:var(--dsw-alias-label-primary,#eee);box-shadow:0 18px 60px rgba(0,0,0,.4);overflow:auto;}",
      ".dcb-panel-head{display:flex;align-items:flex-start;gap:10px;}",
      ".dcb-panel-title{flex:1;font-size:14px;font-weight:650;line-height:1.4;}",
      ".dcb-panel-meta{margin-top:3px;color:var(--dsw-alias-label-secondary,#999);font-size:11px;line-height:1.5;word-break:break-word;}",
      ".dcb-purpose{padding:9px 10px;border-left:3px solid var(--dsw-alias-interactive-border-selected,#6ea8fe);border-radius:6px;background:var(--dsw-alias-bg-layer-2,#252525);font:12px/1.5 sans-serif;white-space:pre-wrap;word-break:break-word;}",
      ".dcb-purpose-meta{margin-top:4px;color:var(--dsw-alias-label-secondary,#999);font-size:10px;}",
      ".dcb-close{border:0;background:transparent;color:var(--dsw-alias-label-secondary,#999);font-size:18px;cursor:pointer;line-height:1;}",
      ".dcb-tabs{display:flex;gap:6px;padding:3px;border-radius:9px;background:var(--dsw-alias-bg-layer-2,#252525);}",
      ".dcb-tab{flex:1;border:0;border-radius:7px;padding:7px;background:transparent;color:var(--dsw-alias-label-secondary,#aaa);cursor:pointer;font-size:12px;}",
      ".dcb-tab.active{background:var(--dsw-alias-bg-layer-3,#3a3a3a);color:var(--dsw-alias-label-primary,#fff);font-weight:600;}",
      ".dcb-note{width:100%;min-height:90px;box-sizing:border-box;resize:vertical;border:1px solid var(--dsw-alias-border-l1,#444);border-radius:9px;padding:9px;background:var(--dsw-alias-bg-base,#121212);color:var(--dsw-alias-label-primary,#eee);font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;}",
      ".dcb-section-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;font-size:12px;font-weight:600;}",
      ".dcb-section-title small{font-weight:400;color:var(--dsw-alias-label-secondary,#999);}",
      ".dcb-todo-add{display:flex;gap:6px;}",
      ".dcb-todo-add input{flex:1;min-width:0;border:1px solid var(--dsw-alias-border-l1,#444);border-radius:7px;padding:7px 8px;background:var(--dsw-alias-bg-base,#121212);color:var(--dsw-alias-label-primary,#eee);font:12px sans-serif;}",
      ".dcb-btn{border:1px solid var(--dsw-alias-border-l1,#444);border-radius:7px;padding:6px 9px;background:var(--dsw-alias-bg-layer-2,#2b2b2b);color:var(--dsw-alias-label-primary,#eee);cursor:pointer;font-size:12px;}",
      ".dcb-btn:hover{background:var(--dsw-alias-interactive-bg-hover,#383838);}",
      ".dcb-btn:disabled{cursor:default;opacity:.45;}",
      ".dcb-todo-actions{display:flex;justify-content:flex-end;margin-top:6px;}",
      ".dcb-messages{display:flex;flex-direction:column;gap:6px;max-height:190px;overflow:auto;}",
      ".dcb-user-message{display:flex;gap:7px;padding:7px 8px;border-radius:7px;background:var(--dsw-alias-bg-layer-2,#252525);font:12px/1.45 sans-serif;white-space:pre-wrap;word-break:break-word;}",
      ".dcb-user-message-index{flex:0 0 auto;color:var(--dsw-alias-label-secondary,#999);font:11px ui-monospace,SFMono-Regular,Menlo,monospace;}",
      ".dcb-todos{display:flex;flex-direction:column;gap:5px;max-height:190px;overflow:auto;}",
      ".dcb-todo{display:flex;align-items:center;gap:7px;padding:5px 6px;border-radius:7px;background:var(--dsw-alias-bg-layer-2,#252525);}",
      ".dcb-todo span{flex:1;min-width:0;overflow-wrap:anywhere;font:12px/1.4 sans-serif;}",
      ".dcb-todo.done span{text-decoration:line-through;opacity:.55;}",
      ".dcb-delete{border:0;background:transparent;color:var(--dsw-alias-label-secondary,#999);cursor:pointer;}",
      ".dcb-empty{padding:8px;color:var(--dsw-alias-label-secondary,#999);font-size:12px;}",
      ".dcb-recent{display:flex;flex-wrap:wrap;gap:5px;}",
      ".dcb-recent-item{max-width:100%;border:1px solid var(--dsw-alias-border-l1,#444);border-radius:999px;padding:4px 8px;color:var(--dsw-alias-label-secondary,#aaa);font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
      ".dcb-saved{color:var(--dsw-alias-label-secondary,#999);font-size:10px;font-weight:400;}",
      ".dcb-foot{color:var(--dsw-alias-label-caption,#777);font-size:10px;line-height:1.4;}",
    ].join("");

    function installStyle() {
      if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
      var node = document.createElement("style");
      node.id = STYLE_ID;
      node.textContent = CSS;
      document.head.appendChild(node);
    }

    function emptyStore() { return { records: {}, recent: [] }; }

    function normalizeRecord(value) {
      value = value && typeof value === "object" ? value : {};
      return {
        note: typeof value.note === "string" ? value.note : "",
        purpose: typeof value.purpose === "string" ? value.purpose : "",
        messages: Array.isArray(value.messages) ? value.messages.filter(function (message) { return message && typeof message.text === "string"; }).slice(0, 5).map(function (message, index) {
          return { id: String(message.id || "message:" + index), text: message.text, time: Number(message.time) || 0 };
        }) : [],
        todos: Array.isArray(value.todos) ? value.todos.filter(function (todo) { return todo && typeof todo.text === "string"; }).map(function (todo) {
          return { id: String(todo.id || Date.now().toString(36)), text: todo.text, done: !!todo.done };
        }) : [],
        updatedAt: Number(value.updatedAt) || 0,
      };
    }

    function normalizeStore(value) {
      var result = emptyStore();
      if (!value || typeof value !== "object") return result;
      if (value.records && typeof value.records === "object") {
        Object.keys(value.records).forEach(function (key) { result.records[key] = normalizeRecord(value.records[key]); });
        result.recent = Array.isArray(value.recent) ? value.recent.filter(function (item) { return item && item.key; }).slice(0, 8) : [];
        return result;
      }
      // v1 stored session records at the root. Keep them usable after upgrade.
      Object.keys(value).forEach(function (key) {
        if (key === "recent") return;
        result.records["session:" + key] = normalizeRecord(value[key]);
      });
      return result;
    }

    function readStore() {
      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
        return normalizeStore(raw ? JSON.parse(raw) : null);
      } catch (e) { return emptyStore(); }
    }

    function writeStore(value) {
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch (e) {}
    }

    function sessionContext(props) {
      var session = props.session || {};
      var sessionId = String(session.sessionId || props.sessionId || "unknown");
      // DSH standard hooks are selector hooks; passing an identity selector is
      // required even when the component needs the complete list snapshot.
      var sessions = typeof props.useSessions === "function" ? props.useSessions(function (value) { return value; }) : {};
      var summary = sessions && sessions.byId ? sessions.byId[sessionId] || {} : {};
      var title = summary.displayTitle || summary.title || sessionId;
      var workspacePath = summary.cwd ? String(summary.cwd) : "";
      var workspace = workspacePath ? workspacePath.split(/[\\/]/).filter(Boolean).pop() : "当前工作区";
      var stats = typeof props.useProjection === "function" ? props.useProjection("sessionStats") : null;
      var usage = typeof props.useProjection === "function" ? props.useProjection("tokenUsage") : null;
      return {
        key: sessionId,
        sessionKey: "session:" + sessionId,
        title: title,
        workspace: workspace,
        workspacePath: workspacePath,
        workspaceKey: "workspace:" + (workspacePath || "unknown"),
        turns: stats && Number(stats.turns) || 0,
        steps: stats && Number(stats.steps) || 0,
        input: usage && Number(usage.uncachedInputTokens) || 0,
        output: usage && Number(usage.outputTokens) || 0,
      };
    }

    function fmt(n) {
      n = Number(n) || 0;
      if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
      if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
      return String(n);
    }

    function newTodo(text) {
      return { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), text: text.trim(), done: false };
    }

    function recordFor(store, context, scope) {
      var key = scope === "workspace" ? context.workspaceKey : context.sessionKey;
      return (store.records && store.records[key]) || { note: "", purpose: "", messages: [], todos: [], updatedAt: 0 };
    }

    function blockText(block) {
      if (!block || typeof block !== "object") return "";
      if (block.type === "text" || block.type === "reasoning") return typeof block.text === "string" ? block.text : "";
      if (block.type === "image") return "[图片]";
      if (block.type === "tool-call") return "[工具调用]";
      if (block.type === "tool-result") return "[工具结果]";
      return "";
    }

    function messageText(node) {
      var content = node && Array.isArray(node.content) ? node.content : [];
      return content.map(blockText).filter(Boolean).join("\n").trim().replace(/\n{3,}/g, "\n\n");
    }

    function firstUserMessages(nodes) {
      if (!Array.isArray(nodes)) return [];
      return nodes.filter(function (node) { return node && (node.kind === "user" || node.kind === "steering"); }).map(function (node, index) {
        return { id: String(node.kind) + ":" + String(node.seq == null ? index : node.seq), text: messageText(node), time: Number(node.time) || 0 };
      }).filter(function (message) { return message.text; }).slice(0, 5).map(function (message) {
        return Object.assign({}, message, { text: message.text.slice(0, 1200) });
      });
    }

    function derivePurpose(messages, title) {
      if (!messages.length) return title && title !== "unknown" ? "等待首条消息（" + title + "）" : "等待第一条消息";
      var seed = messages[0].text.replace(/\s+/g, " ").trim();
      if (seed.length > 96) seed = seed.slice(0, 96) + "…";
      return "围绕「" + seed + "」推进";
    }

    function sessionDigest(props, title) {
      var nodes = typeof props.useSession === "function" ? props.useSession(function (snapshot) {
        return snapshot && snapshot.chat && snapshot.chat.legacy ? snapshot.chat.legacy.nodes : (snapshot && snapshot.nodes) || [];
      }) : [];
      var messages = firstUserMessages(nodes);
      var purpose = derivePurpose(messages, title);
      return { messages: messages, purpose: purpose, hasMore: !!(props.session && props.session.hasMore), signature: JSON.stringify(messages) + "|" + purpose };
    }

    function savedLabel(updatedAt) {
      return updatedAt ? "已保存 " + new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "未记录";
    }

    function BadgePanel(props) {
      var ctx = props.context;
      var scope = props.scope;
      var record = props.record;
      var onChange = props.onChange;
      var [draft, setDraft] = React.useState(record.note || "");
      var [todoDraft, setTodoDraft] = React.useState("");
      React.useEffect(function () { setDraft(record.note || ""); setTodoDraft(""); }, [scope, ctx.sessionKey, ctx.workspaceKey, record.note]);

      function saveNote(value) {
        setDraft(value);
        onChange(Object.assign({}, record, { note: value, updatedAt: Date.now() }));
      }
      function addTodo() {
        var item = newTodo(todoDraft);
        if (!item.text) return;
        onChange(Object.assign({}, record, { todos: (record.todos || []).concat(item), updatedAt: Date.now() }));
        setTodoDraft("");
      }
      function keyDown(e) { if (e.key === "Enter") { e.preventDefault(); addTodo(); } }
      var todos = record.todos || [];
      var doneCount = todos.filter(function (x) { return x.done; }).length;
      return React.createElement("div", { className: "dcb-panel" },
        React.createElement("div", { className: "dcb-panel-head" },
          React.createElement("div", { className: "dcb-panel-title" }, "🧭 ", scope === "workspace" ? ctx.workspace : ctx.title,
            React.createElement("div", { className: "dcb-panel-meta" },
              (scope === "workspace" ? "工作区级上下文" : "会话级上下文") + " · " +
              (scope === "workspace" ? (ctx.workspacePath || "未识别路径") : ((ctx.workspace ? ctx.workspace + " · " : "") + ctx.turns + " 轮 · " + ctx.steps + " 步")) +
              (scope === "session" && (ctx.input || ctx.output) ? " · 输入 " + fmt(ctx.input) + " · 输出 " + fmt(ctx.output) : ""))),
          React.createElement("button", { className: "dcb-close", onClick: props.onClose, "aria-label": "Close" }, "×")),
        React.createElement("div", { className: "dcb-tabs" },
          React.createElement("button", { className: "dcb-tab" + (scope === "session" ? " active" : ""), onClick: function () { props.onScopeChange("session"); } }, "当前会话"),
          React.createElement("button", { className: "dcb-tab" + (scope === "workspace" ? " active" : ""), onClick: function () { props.onScopeChange("workspace"); } }, "当前工作区")),
        scope === "session" ? React.createElement(React.Fragment, null,
          React.createElement("div", null,
            React.createElement("div", { className: "dcb-section-title" }, "这个对话在干什么", React.createElement("small", null, "自动整理")),
            React.createElement("div", { className: "dcb-purpose" }, record.purpose || "等待第一条消息",
              React.createElement("div", { className: "dcb-purpose-meta" }, props.messageCount + " / 5 条消息" + (props.hasMore ? " · 历史还有更早消息未加载" : "")))),
          React.createElement("div", null,
            React.createElement("div", { className: "dcb-section-title" }, "我发出的前 5 条", React.createElement("small", null, props.messageCount ? "自动保留" : "暂无")),
            props.messages.length ? React.createElement("div", { className: "dcb-messages" }, props.messages.map(function (message, index) {
              return React.createElement("div", { className: "dcb-user-message", key: message.id },
                React.createElement("span", { className: "dcb-user-message-index" }, "#" + (index + 1)),
                React.createElement("span", null, message.text));
            })) : React.createElement("div", { className: "dcb-empty" }, "还没有已发送的消息"))) : null,
        React.createElement("div", null,
          React.createElement("div", { className: "dcb-section-title" }, "上下文笔记", React.createElement("span", { className: "dcb-saved" }, savedLabel(record.updatedAt))),
          React.createElement("textarea", { className: "dcb-note", value: draft, onChange: function (e) { saveNote(e.target.value); }, placeholder: scope === "workspace" ? "记录这个工作区的长期上下文…" : "记录这个会话的关键上下文…" })),
        React.createElement("div", null,
          React.createElement("div", { className: "dcb-section-title" }, "待办", React.createElement("span", null, todos.filter(function (x) { return !x.done; }).length, " 未完成 · ", React.createElement("small", null, doneCount, " 已完成"))),
          React.createElement("div", { className: "dcb-todo-add" },
            React.createElement("input", { value: todoDraft, onChange: function (e) { setTodoDraft(e.target.value); }, onKeyDown: keyDown, placeholder: "添加待办，回车保存" }),
            React.createElement("button", { className: "dcb-btn", onClick: addTodo }, "添加")),
          React.createElement("div", { className: "dcb-todos" }, todos.length ? todos.map(function (todo) {
            return React.createElement("div", { className: "dcb-todo" + (todo.done ? " done" : ""), key: todo.id },
              React.createElement("input", { type: "checkbox", checked: !!todo.done, onChange: function () {
                onChange(Object.assign({}, record, { todos: todos.map(function (x) { return x.id === todo.id ? Object.assign({}, x, { done: !x.done }) : x; }), updatedAt: Date.now() }));
              } }),
              React.createElement("span", null, todo.text),
              React.createElement("button", { className: "dcb-delete", onClick: function () {
                onChange(Object.assign({}, record, { todos: todos.filter(function (x) { return x.id !== todo.id; }), updatedAt: Date.now() }));
              }, "aria-label": "Delete" }, "×"));
          }) : React.createElement("div", { className: "dcb-empty" }, "还没有待办")),
          React.createElement("div", { className: "dcb-todo-actions" },
            React.createElement("button", { className: "dcb-btn", disabled: doneCount === 0, onClick: function () {
              onChange(Object.assign({}, record, { todos: todos.filter(function (x) { return !x.done; }), updatedAt: Date.now() }));
            } }, "清理已完成"))),
        props.recent.length ? React.createElement("div", null,
          React.createElement("div", { className: "dcb-section-title" }, "最近更新", React.createElement("small", null, "自动保留 8 条")),
          React.createElement("div", { className: "dcb-recent" }, props.recent.map(function (item) {
            return React.createElement("span", { className: "dcb-recent-item", key: item.key, title: item.title }, (item.scope === "workspace" ? "工作区 · " : "会话 · ") + item.title);
          }))) : null,
        React.createElement("div", { className: "dcb-foot" }, "仅保存在当前浏览器的 localStorage，不上传笔记、待办或窗口信息。"));
    }

    function ContextBadge(props) {
      installStyle();
      var ctx = sessionContext(props);
      var digest = sessionDigest(props, ctx.title);
      var [open, setOpen] = React.useState(false);
      var [scope, setScope] = React.useState("session");
      var [store, setStore] = React.useState(readStore);
      var sessionRecord = recordFor(store, ctx, "session");
      var workspaceRecord = recordFor(store, ctx, "workspace");
      var record = scope === "workspace" ? workspaceRecord : sessionRecord;
      React.useEffect(function () {
        var current = store.records[ctx.sessionKey] || recordFor(store, ctx, "session");
        var currentSignature = JSON.stringify(current.messages || []) + "|" + (current.purpose || "");
        if (currentSignature === digest.signature) return;
        var value = { records: Object.assign({}, store.records), recent: (store.recent || []).slice() };
        value.records[ctx.sessionKey] = Object.assign({}, current, { messages: digest.messages, purpose: digest.purpose, digestUpdatedAt: Date.now() });
        setStore(value);
        writeStore(value);
      }, [ctx.sessionKey, digest.signature]);
      function update(next) {
        var key = scope === "workspace" ? ctx.workspaceKey : ctx.sessionKey;
        var value = { records: Object.assign({}, store.records), recent: (store.recent || []).slice() };
        value.records[key] = next;
        value.recent = [{ key: key, scope: scope, title: scope === "workspace" ? ctx.workspace : ctx.title, updatedAt: next.updatedAt || Date.now() }]
          .concat(value.recent.filter(function (item) { return item.key !== key; })).slice(0, 8);
        setStore(value);
        writeStore(value);
      }
      var sessionRemaining = sessionRecord.todos.filter(function (x) { return !x.done; }).length;
      var workspaceRemaining = workspaceRecord.todos.filter(function (x) { return !x.done; }).length;
      return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "dcb-row" },
          React.createElement("button", { className: "dcb-badge", onClick: function () { setOpen(true); } }, "🧭 上下文"),
          React.createElement("span", { className: "dcb-label", title: ctx.title }, ctx.title),
          React.createElement("span", null, "· 会话 ", sessionRemaining, " · 工作区 ", workspaceRemaining)),
        open ? React.createElement(BadgePanel, { context: ctx, scope: scope, record: record, recent: store.recent || [], messages: digest.messages, messageCount: digest.messages.length, hasMore: digest.hasMore, onChange: update, onScopeChange: setScope, onClose: function () { setOpen(false); } }) : null);
    }

    module.exports = {
      inject: ["slots"],
      apply: function (ctx) {
        var slots = ctx.get("slots");
        if (slots === undefined) return;
        slots.inject("conversation.composer.dock", function () {
          return slots.register(
            { name: "conversation.composer.dock", id: "dsh-context-badge", order: 120 },
            function (props) { return React.createElement(ContextBadge, props); },
          );
        });
      },
      __testables: { sessionContext: sessionContext, fmt: fmt, newTodo: newTodo, normalizeStore: normalizeStore, recordFor: recordFor, messageText: messageText, firstUserMessages: firstUserMessages, derivePurpose: derivePurpose },
    };
    return module.exports;
  },
});
