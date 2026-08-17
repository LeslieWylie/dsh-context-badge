window.__ModuleLoader__.load({
  id: "dsh-context-badge",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    var STORAGE_KEY = "dsh-context-badge:v1";
    var STYLE_ID = "dsh-context-badge-style";

    var CSS = [
      ".dcb-row{display:flex;align-items:center;gap:8px;min-height:22px;color:var(--dsw-alias-label-secondary,#8b949e);font:12px ui-monospace,SFMono-Regular,Menlo,monospace;}",
      ".dcb-badge{border:1px solid var(--dsw-alias-border-l1,#444);background:var(--dsw-alias-bg-layer-2,#252525);color:var(--dsw-alias-label-primary,#eee);border-radius:999px;padding:3px 9px;cursor:pointer;font:inherit;}",
      ".dcb-badge:hover{background:var(--dsw-alias-interactive-bg-hover,#333);}",
      ".dcb-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
      ".dcb-panel{position:fixed;right:24px;bottom:86px;width:min(440px,calc(100vw - 32px));max-height:min(620px,calc(100vh - 120px));z-index:9400;display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--dsw-alias-border-l1,#444);border-radius:14px;background:var(--dsw-alias-bg-layer-1,#1f1f1f);color:var(--dsw-alias-label-primary,#eee);box-shadow:0 18px 60px rgba(0,0,0,.4);}",
      ".dcb-panel-head{display:flex;align-items:flex-start;gap:10px;}",
      ".dcb-panel-title{flex:1;font-size:14px;font-weight:650;line-height:1.4;}",
      ".dcb-panel-meta{margin-top:3px;color:var(--dsw-alias-label-secondary,#999);font-size:11px;line-height:1.5;}",
      ".dcb-close{border:0;background:transparent;color:var(--dsw-alias-label-secondary,#999);font-size:18px;cursor:pointer;line-height:1;}",
      ".dcb-note{width:100%;min-height:90px;box-sizing:border-box;resize:vertical;border:1px solid var(--dsw-alias-border-l1,#444);border-radius:9px;padding:9px;background:var(--dsw-alias-bg-base,#121212);color:var(--dsw-alias-label-primary,#eee);font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;}",
      ".dcb-section-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;font-size:12px;font-weight:600;}",
      ".dcb-todo-add{display:flex;gap:6px;}",
      ".dcb-todo-add input{flex:1;min-width:0;border:1px solid var(--dsw-alias-border-l1,#444);border-radius:7px;padding:7px 8px;background:var(--dsw-alias-bg-base,#121212);color:var(--dsw-alias-label-primary,#eee);font:12px sans-serif;}",
      ".dcb-btn{border:1px solid var(--dsw-alias-border-l1,#444);border-radius:7px;padding:6px 9px;background:var(--dsw-alias-bg-layer-2,#2b2b2b);color:var(--dsw-alias-label-primary,#eee);cursor:pointer;font-size:12px;}",
      ".dcb-btn:hover{background:var(--dsw-alias-interactive-bg-hover,#383838);}",
      ".dcb-todos{display:flex;flex-direction:column;gap:5px;max-height:190px;overflow:auto;}",
      ".dcb-todo{display:flex;align-items:center;gap:7px;padding:5px 6px;border-radius:7px;background:var(--dsw-alias-bg-layer-2,#252525);}",
      ".dcb-todo span{flex:1;min-width:0;overflow-wrap:anywhere;font:12px/1.4 sans-serif;}",
      ".dcb-todo.done span{text-decoration:line-through;opacity:.55;}",
      ".dcb-delete{border:0;background:transparent;color:var(--dsw-alias-label-secondary,#999);cursor:pointer;}",
      ".dcb-empty{padding:8px;color:var(--dsw-alias-label-secondary,#999);font-size:12px;}",
      ".dcb-foot{color:var(--dsw-alias-label-caption,#777);font-size:10px;line-height:1.4;}",
    ].join("");

    function installStyle() {
      if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
      var node = document.createElement("style");
      node.id = STYLE_ID;
      node.textContent = CSS;
      document.head.appendChild(node);
    }

    function readStore() {
      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        var parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch (e) { return {}; }
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
      var workspace = summary.cwd ? String(summary.cwd).split(/[\\/]/).filter(Boolean).pop() : "";
      var stats = typeof props.useProjection === "function" ? props.useProjection("sessionStats") : null;
      var usage = typeof props.useProjection === "function" ? props.useProjection("tokenUsage") : null;
      return {
        key: sessionId,
        title: title,
        workspace: workspace,
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

    function BadgePanel(props) {
      var ctx = props.context;
      var record = props.record;
      var onChange = props.onChange;
      var [draft, setDraft] = React.useState(record.note || "");
      var [todoDraft, setTodoDraft] = React.useState("");
      React.useEffect(function () { setDraft(record.note || ""); }, [ctx.key, record.note]);

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
      return React.createElement("div", { className: "dcb-panel" },
        React.createElement("div", { className: "dcb-panel-head" },
          React.createElement("div", { className: "dcb-panel-title" }, "🧭 ", ctx.title,
            React.createElement("div", { className: "dcb-panel-meta" },
              (ctx.workspace ? ctx.workspace + " · " : "") + ctx.turns + " 轮 · " + ctx.steps + " 步" +
              (ctx.input || ctx.output ? " · 输入 " + fmt(ctx.input) + " · 输出 " + fmt(ctx.output) : ""))),
          React.createElement("button", { className: "dcb-close", onClick: props.onClose, "aria-label": "Close" }, "×")),
        React.createElement("div", null,
          React.createElement("div", { className: "dcb-section-title" }, "上下文笔记"),
          React.createElement("textarea", { className: "dcb-note", value: draft, onChange: function (e) { saveNote(e.target.value); }, placeholder: "记录这个会话的关键上下文…" })),
        React.createElement("div", null,
          React.createElement("div", { className: "dcb-section-title" }, "待办", React.createElement("span", null, todos.filter(function (x) { return !x.done; }).length, " 未完成")),
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
          }) : React.createElement("div", { className: "dcb-empty" }, "还没有待办"))),
        React.createElement("div", { className: "dcb-foot" }, "仅保存在当前浏览器的 localStorage，不上传笔记、待办或窗口信息。"));
    }

    function ContextBadge(props) {
      installStyle();
      var ctx = sessionContext(props);
      var [open, setOpen] = React.useState(false);
      var [store, setStore] = React.useState(readStore);
      var record = store[ctx.key] || { note: "", todos: [], updatedAt: 0 };
      function update(next) {
        var value = Object.assign({}, store, {});
        value[ctx.key] = next;
        setStore(value);
        writeStore(value);
      }
      var remaining = (record.todos || []).filter(function (x) { return !x.done; }).length;
      return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "dcb-row" },
          React.createElement("button", { className: "dcb-badge", onClick: function () { setOpen(true); } }, "🧭 上下文"),
          React.createElement("span", { className: "dcb-label", title: ctx.title }, ctx.title),
          React.createElement("span", null, "· ", remaining, " 待办")),
        open ? React.createElement(BadgePanel, { context: ctx, record: record, onChange: update, onClose: function () { setOpen(false); } }) : null);
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
      __testables: { sessionContext: sessionContext, fmt: fmt, newTodo: newTodo },
    };
    return module.exports;
  },
});
