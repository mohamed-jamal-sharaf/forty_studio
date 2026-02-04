// Copyright (c) 2026, Capital Project and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Code Editor", {
// 	refresh(frm) {

// 	},
// });


// Code Editor - Enhanced Monaco Editor with Professional Styling
// Mohamed Sharaf - Capital Project
// Version: 3.0.0 - Premium Edition
// Brand Color: #025074

// ==================== CONFIGURATION ====================
const EDITOR_CONFIG = {
    MONACO_VERSION: '0.44.0',
    MONACO_CDN: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor',
    DEFAULT_HEIGHT: 650,
    DEFAULT_FONT_SIZE: 14,
    DEFAULT_TAB_SIZE: 4,
    AUTOSAVE_DELAY: 60000,
    BRAND_COLOR: '#025074'
};

// ==================== BRAND COLORS ====================
const COLORS = {
    primary: '#025074',
    primaryDark: '#013D5C',
    primaryLight: '#037AA8',
    secondary: '#05668D',
    accent: '#02C39A',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    dark: '#1F2937',
    medium: '#6B7280',
    light: '#F3F4F6',
    lighter: '#F9FAFB',
    white: '#FFFFFF'
};

// ==================== CUSTOM THEMES ====================
const CUSTOM_THEMES = {
    'capital-dark': {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
            { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
            { token: 'string', foreground: 'CE9178' },
            { token: 'number', foreground: 'B5CEA8' },
            { token: 'function', foreground: 'DCDCAA' },
            { token: 'variable', foreground: '9CDCFE' },
            { token: 'type', foreground: '4EC9B0' },
            { token: 'class', foreground: '4EC9B0', fontStyle: 'bold' }
        ],
        colors: {
            'editor.background': '#0D1B2A',
            'editor.foreground': '#E0E0E0',
            'editor.lineHighlightBackground': '#1B3A4B',
            'editor.selectionBackground': '#025074AA',
            'editorCursor.foreground': '#02C39A',
            'editorLineNumber.foreground': '#4B5563',
            'editorLineNumber.activeForeground': '#02C39A',
            'editor.selectionHighlightBackground': '#025074AA',
            'editorIndentGuide.background': '#2D3748',
            'editorIndentGuide.activeBackground': '#4B5563',
            'editorBracketMatch.background': '#025074',
            'editorBracketMatch.border': '#02C39A',
            'minimap.background': '#0D1B2A',
            'scrollbar.shadow': '#000000',
            'scrollbarSlider.background': '#025074AA',
            'scrollbarSlider.hoverBackground': '#037AA8',
            'scrollbarSlider.activeBackground': '#02C39A'
        }
    },
    'capital-light': {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '008000', fontStyle: 'italic' },
            { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
            { token: 'string', foreground: 'A31515' },
            { token: 'number', foreground: '098658' },
            { token: 'function', foreground: '795E26' },
            { token: 'variable', foreground: '001080' },
            { token: 'type', foreground: '267F99' }
        ],
        colors: {
            'editor.background': '#FFFFFF',
            'editor.foreground': '#1F2937',
            'editor.lineHighlightBackground': '#F0F7FF',
            'editor.selectionBackground': '#ADD6FF',
            'editorCursor.foreground': '#025074',
            'editorLineNumber.foreground': '#9CA3AF',
            'editorLineNumber.activeForeground': '#025074',
            'editorIndentGuide.background': '#E5E7EB',
            'editorIndentGuide.activeBackground': '#D1D5DB',
            'editorBracketMatch.background': '#E0F2FE',
            'editorBracketMatch.border': '#025074'
        }
    },
    'capital-ocean': {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '637777', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'C792EA', fontStyle: 'bold' },
            { token: 'string', foreground: 'C3E88D' },
            { token: 'number', foreground: 'F78C6C' },
            { token: 'function', foreground: '82AAFF' },
            { token: 'variable', foreground: 'EEFFFF' },
            { token: 'type', foreground: 'FFCB6B' }
        ],
        colors: {
            'editor.background': '#011627',
            'editor.foreground': '#D6DEEB',
            'editor.lineHighlightBackground': '#1D3B53',
            'editor.selectionBackground': '#5F7E97',
            'editorCursor.foreground': '#80A4C2',
            'editorLineNumber.foreground': '#4B6479',
            'editorLineNumber.activeForeground': '#C792EA'
        }
    }
};

// ==================== GLOBAL STATE ====================
let editor = null;
let isMonacoLoaded = false;
let isFullscreen = false;
let editorSettings = {
    theme: localStorage.getItem('code_theme') || 'capital-dark',
    fontSize: parseInt(localStorage.getItem('code_fontsize')) || 14,
    tabSize: parseInt(localStorage.getItem('code_tabsize')) || 4,
    wordWrap: localStorage.getItem('code_wordwrap') !== 'false',
    minimap: localStorage.getItem('code_minimap') !== 'false',
    lineNumbers: localStorage.getItem('code_linenumbers') !== 'false',
    bracketPairs: localStorage.getItem('code_bracketpairs') !== 'false',
    indentGuides: localStorage.getItem('code_indentguides') !== 'false',
    renderWhitespace: localStorage.getItem('code_whitespace') || 'none',
    cursorBlinking: localStorage.getItem('code_cursorblink') || 'smooth',
    cursorStyle: localStorage.getItem('code_cursorstyle') || 'line',
    smoothScrolling: localStorage.getItem('code_smoothscroll') !== 'false',
    formatOnPaste: localStorage.getItem('code_formatpaste') !== 'false',
    formatOnType: localStorage.getItem('code_formattype') !== 'false',
    autoClosingBrackets: localStorage.getItem('code_autoclosebrackets') || 'always',
    autoClosingQuotes: localStorage.getItem('code_autoclosequotes') || 'always',
    autoIndent: localStorage.getItem('code_autoindent') || 'full',
    folding: localStorage.getItem('code_folding') !== 'false',
    showFoldingControls: localStorage.getItem('code_foldingcontrols') || 'mouseover',
    colorDecorators: localStorage.getItem('code_colordecorators') !== 'false',
    rulers: JSON.parse(localStorage.getItem('code_rulers') || '[80, 120]'),
    renderLineHighlight: localStorage.getItem('code_linehighlight') || 'all',
    stickyScroll: localStorage.getItem('code_stickyscroll') !== 'false',
    inlineSuggest: localStorage.getItem('code_inlinesuggest') !== 'false'
};

// ==================== UTILITY FUNCTIONS ====================
function showAlert(message, type = 'info') {
    const colors = {
        success: COLORS.success,
        error: COLORS.error,
        warning: COLORS.warning,
        info: COLORS.primary
    };
    frappe.show_alert({
        message: __(message),
        indicator: type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'orange' : 'blue'
    }, 5);
}

function getLanguage(code_type) {
    const langs = {
        'Java Script': 'javascript',
        'Server Python Script': 'python',
        'Python Code': 'python',
        'Server Command & Code': 'shell',
        'Frappe API': 'python',
        'CSS': 'css',
        'HTML': 'html',
        'JSON': 'json',
        'XML': 'xml',
        'SQL': 'sql',
        'Markdown': 'markdown',
        'TypeScript': 'typescript'
    };
    return langs[code_type] || 'javascript';
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function saveSettings() {
    Object.entries(editorSettings).forEach(([key, value]) => {
        const storageKey = `code_${key.toLowerCase()}`;
        if (typeof value === 'object') {
            localStorage.setItem(storageKey, JSON.stringify(value));
        } else {
            localStorage.setItem(storageKey, value);
        }
    });
}

// ==================== CREATE EDITOR HTML ====================
function createEditorHTML() {
    return `
        <div class="monaco-wrapper" id="monaco-wrapper">
            
            <!-- Main Toolbar -->
            <div class="editor-toolbar">
                
                <!-- Left Section - Actions -->
                <div class="toolbar-section toolbar-left">
                    <div class="btn-group">
                        <button class="toolbar-btn btn-undo" title="Undo (Ctrl+Z)">
                            <i class="fa fa-undo"></i>
                        </button>
                        <button class="toolbar-btn btn-redo" title="Redo (Ctrl+Y)">
                            <i class="fa fa-repeat"></i>
                        </button>
                    </div>
                    
                    <div class="toolbar-divider"></div>
                    
                    <div class="btn-group">
                        <button class="toolbar-btn btn-format" title="Format Code (Shift+Alt+F)">
                            <i class="fa fa-indent"></i>
                            <span class="btn-label">Format</span>
                        </button>
                        <button class="toolbar-btn btn-find" title="Find (Ctrl+F)">
                            <i class="fa fa-search"></i>
                            <span class="btn-label">Find</span>
                        </button>
                        <button class="toolbar-btn btn-replace" title="Replace (Ctrl+H)">
                            <i class="fa fa-exchange"></i>
                            <span class="btn-label">Replace</span>
                        </button>
                    </div>
                    
                    <div class="toolbar-divider"></div>
                    
                    <div class="btn-group">
                        <button class="toolbar-btn btn-comment" title="Toggle Comment (Ctrl+/)">
                            <i class="fa fa-commenting-o"></i>
                        </button>
                        <button class="toolbar-btn btn-fold-all" title="Fold All">
                            <i class="fa fa-compress"></i>
                        </button>
                        <button class="toolbar-btn btn-unfold-all" title="Unfold All">
                            <i class="fa fa-expand"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Center Section - Info -->
                <div class="toolbar-section toolbar-center">
                    <div class="editor-info">
                        <span class="info-item cursor-position" title="Cursor Position">
                            <i class="fa fa-crosshairs"></i>
                            <span class="line-col">Ln 1, Col 1</span>
                        </span>
                        <span class="info-item selection-info" title="Selection" style="display: none;">
                            <i class="fa fa-text-width"></i>
                            <span class="selection-text">0 selected</span>
                        </span>
                        <span class="info-item code-language" title="Language">
                            <i class="fa fa-code"></i>
                            <span class="lang-name">JavaScript</span>
                        </span>
                    </div>
                </div>
                
                <!-- Right Section - Settings -->
                <div class="toolbar-section toolbar-right">
                    <button class="toolbar-btn btn-settings" title="Editor Settings">
                        <i class="fa fa-cog"></i>
                    </button>
                    <button class="toolbar-btn btn-keyboard" title="Keyboard Shortcuts">
                        <i class="fa fa-keyboard-o"></i>
                    </button>
                    <button class="toolbar-btn btn-fullscreen primary" title="Fullscreen (F11)">
                        <i class="fa fa-expand"></i>
                        <span class="btn-label">Fullscreen</span>
                    </button>
                </div>
            </div>
            
            <!-- Quick Settings Bar -->
            <div class="quick-settings-bar">
                <div class="settings-group">
                    <label class="setting-label">
                        <i class="fa fa-paint-brush"></i> Theme:
                    </label>
                    <select class="setting-select select-theme">
                        <optgroup label="Capital Themes">
                            <option value="capital-dark">Capital Dark</option>
                            <option value="capital-light">Capital Light</option>
                            <option value="capital-ocean">Capital Ocean</option>
                        </optgroup>
                        <optgroup label="Monaco Themes">
                            <option value="vs">VS Light</option>
                            <option value="vs-dark">VS Dark</option>
                            <option value="hc-black">High Contrast</option>
                        </optgroup>
                    </select>
                </div>
                
                <div class="settings-group">
                    <label class="setting-label">
                        <i class="fa fa-text-height"></i> Font:
                    </label>
                    <input type="range" class="setting-range input-fontsize" min="10" max="28" value="${editorSettings.fontSize}">
                    <span class="setting-value label-fontsize">${editorSettings.fontSize}px</span>
                </div>
                
                <div class="settings-group">
                    <label class="setting-label">
                        <i class="fa fa-arrows-h"></i> Tab:
                    </label>
                    <select class="setting-select select-tabsize">
                        <option value="2">2 spaces</option>
                        <option value="4">4 spaces</option>
                        <option value="8">8 spaces</option>
                    </select>
                </div>
                
                <div class="settings-group toggles">
                    <label class="toggle-btn ${editorSettings.wordWrap ? 'active' : ''}" title="Word Wrap">
                        <input type="checkbox" class="toggle-wordwrap" ${editorSettings.wordWrap ? 'checked' : ''}>
                        <i class="fa fa-text-width"></i>
                        <span>Wrap</span>
                    </label>
                    <label class="toggle-btn ${editorSettings.minimap ? 'active' : ''}" title="Minimap">
                        <input type="checkbox" class="toggle-minimap" ${editorSettings.minimap ? 'checked' : ''}>
                        <i class="fa fa-map"></i>
                        <span>Map</span>
                    </label>
                    <label class="toggle-btn ${editorSettings.lineNumbers ? 'active' : ''}" title="Line Numbers">
                        <input type="checkbox" class="toggle-linenumbers" ${editorSettings.lineNumbers ? 'checked' : ''}>
                        <i class="fa fa-list-ol"></i>
                        <span>Lines</span>
                    </label>
                </div>
                
                <div class="settings-group save-indicator">
                    <span class="save-status saved">
                        <i class="fa fa-check-circle"></i> Saved
                    </span>
                </div>
            </div>
            
            <!-- Editor Container -->
            <div class="editor-container"></div>
            
            <!-- Status Bar -->
            <div class="status-bar">
                <div class="status-left">
                    <span class="status-item encoding">UTF-8</span>
                    <span class="status-item eol">LF</span>
                    <span class="status-item indent-info">Spaces: ${editorSettings.tabSize}</span>
                </div>
                <div class="status-center">
                    <span class="status-item file-info"></span>
                </div>
                <div class="status-right">
                    <span class="status-item problems-count" title="Problems">
                        <i class="fa fa-times-circle"></i> 0
                        <i class="fa fa-exclamation-triangle"></i> 0
                    </span>
                    <span class="status-item char-count" title="Characters">0 chars</span>
                    <span class="status-item line-count" title="Lines">0 lines</span>
                </div>
            </div>
            
        </div>
        
        <style>
            /* ===== Monaco Wrapper ===== */
            .monaco-wrapper {
                position: relative;
                width: 100%;
                height: ${EDITOR_CONFIG.DEFAULT_HEIGHT}px;
                border: 1px solid ${COLORS.light};
                border-radius: 8px;
                overflow: hidden;
                background: ${COLORS.white};
                box-shadow: 0 4px 20px rgba(2, 80, 116, 0.1);
                display: flex;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .monaco-wrapper:hover {
                box-shadow: 0 8px 30px rgba(2, 80, 116, 0.15);
            }
            
            /* ===== Main Toolbar ===== */
            .editor-toolbar {
                background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%);
                padding: 8px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                flex-shrink: 0;
            }
            
            .toolbar-section {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .toolbar-left { flex: 1; }
            .toolbar-center { flex: 0 0 auto; }
            .toolbar-right { flex: 1; justify-content: flex-end; }
            
            .btn-group {
                display: flex;
                gap: 4px;
            }
            
            .toolbar-divider {
                width: 1px;
                height: 24px;
                background: rgba(255,255,255,0.2);
                margin: 0 4px;
            }
            
            .toolbar-btn {
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.15);
                color: ${COLORS.white};
                padding: 6px 10px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: all 0.2s ease;
            }
            
            .toolbar-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: translateY(-1px);
            }
            
            .toolbar-btn:active {
                transform: translateY(0);
                background: rgba(255,255,255,0.25);
            }
            
            .toolbar-btn.primary {
                background: ${COLORS.accent};
                border-color: ${COLORS.accent};
            }
            
            .toolbar-btn.primary:hover {
                background: #03D4A8;
            }
            
            .toolbar-btn i {
                font-size: 13px;
            }
            
            .btn-label {
                font-weight: 500;
            }
            
            /* ===== Editor Info ===== */
            .editor-info {
                display: flex;
                gap: 16px;
                color: rgba(255,255,255,0.85);
                font-size: 12px;
            }
            
            .info-item {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 4px 8px;
                background: rgba(0,0,0,0.15);
                border-radius: 4px;
            }
            
            .info-item i {
                opacity: 0.7;
            }
            
            /* ===== Quick Settings Bar ===== */
            .quick-settings-bar {
                background: ${COLORS.lighter};
                padding: 8px 12px;
                display: flex;
                align-items: center;
                gap: 20px;
                border-bottom: 1px solid ${COLORS.light};
                flex-wrap: wrap;
                flex-shrink: 0;
            }
            
            .settings-group {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .setting-label {
                font-size: 12px;
                color: ${COLORS.medium};
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 4px;
                white-space: nowrap;
            }
            
            .setting-label i {
                color: ${COLORS.primary};
            }
            
            .setting-select {
                padding: 5px 10px;
                border: 1px solid ${COLORS.light};
                border-radius: 5px;
                font-size: 12px;
                background: ${COLORS.white};
                color: ${COLORS.dark};
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .setting-select:focus {
                outline: none;
                border-color: ${COLORS.primary};
                box-shadow: 0 0 0 2px rgba(2,80,116,0.1);
            }
            
            .setting-range {
                width: 80px;
                accent-color: ${COLORS.primary};
            }
            
            .setting-value {
                font-size: 12px;
                color: ${COLORS.dark};
                font-weight: 600;
                min-width: 40px;
            }
            
            .toggles {
                gap: 6px;
            }
            
            .toggle-btn {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 5px 10px;
                border: 1px solid ${COLORS.light};
                border-radius: 5px;
                font-size: 11px;
                color: ${COLORS.medium};
                background: ${COLORS.white};
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .toggle-btn:hover {
                border-color: ${COLORS.primary};
                color: ${COLORS.primary};
            }
            
            .toggle-btn.active {
                background: ${COLORS.primary};
                border-color: ${COLORS.primary};
                color: ${COLORS.white};
            }
            
            .toggle-btn input {
                display: none;
            }
            
            .toggle-btn i {
                font-size: 12px;
            }
            
            .save-indicator {
                margin-left: auto;
            }
            
            .save-status {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 5px 12px;
                border-radius: 5px;
                font-size: 12px;
                font-weight: 600;
            }
            
            .save-status.saved {
                background: rgba(16, 185, 129, 0.1);
                color: ${COLORS.success};
            }
            
            .save-status.unsaved {
                background: rgba(239, 68, 68, 0.1);
                color: ${COLORS.error};
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }
            
            /* ===== Editor Container ===== */
            .editor-container {
                flex: 1;
                min-height: 0;
                position: relative;
            }
            
            /* ===== Status Bar ===== */
            .status-bar {
                background: ${COLORS.primaryDark};
                padding: 4px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
                color: rgba(255,255,255,0.8);
                flex-shrink: 0;
            }
            
            .status-left, .status-right {
                display: flex;
                gap: 12px;
            }
            
            .status-center {
                flex: 1;
                text-align: center;
            }
            
            .status-item {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 2px 6px;
                border-radius: 3px;
                transition: background 0.2s;
            }
            
            .status-item:hover {
                background: rgba(255,255,255,0.1);
            }
            
            .problems-count i:first-child { color: ${COLORS.error}; }
            .problems-count i:last-of-type { color: ${COLORS.warning}; }
            
            /* ===== Fullscreen Mode ===== */
            .monaco-wrapper.fullscreen {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 9999 !important;
                border-radius: 0 !important;
            }
            
            /* ===== Responsive ===== */
            @media (max-width: 768px) {
                .btn-label { display: none; }
                .toolbar-center { display: none; }
                .quick-settings-bar { gap: 10px; }
                .settings-group { flex-wrap: wrap; }
            }
            
            /* ===== Animation ===== */
            .toolbar-btn, .toggle-btn, .setting-select {
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
        </style>
    `;
}

// ==================== LOAD MONACO ====================
function loadMonaco(callback) {
    console.log('Loading Monaco Editor...');

    if (window.monaco && window.require) {
        console.log('Monaco already loaded');
        isMonacoLoaded = true;
        registerCustomThemes();
        callback();
        return;
    }

    const script = document.createElement('script');
    script.src = `${EDITOR_CONFIG.MONACO_CDN}/${EDITOR_CONFIG.MONACO_VERSION}/min/vs/loader.min.js`;

    script.onload = function () {
        console.log('Monaco loader loaded');

        window.require.config({
            paths: { 'vs': `${EDITOR_CONFIG.MONACO_CDN}/${EDITOR_CONFIG.MONACO_VERSION}/min/vs` }
        });

        window.require(['vs/editor/editor.main'], function () {
            console.log('Monaco editor ready');
            isMonacoLoaded = true;
            registerCustomThemes();
            setupCompletions();
            callback();
        });
    };

    script.onerror = function () {
        console.error('Failed to load Monaco');
        showAlert('Failed to load Monaco Editor', 'error');
    };

    document.head.appendChild(script);
}

// ==================== REGISTER CUSTOM THEMES ====================
function registerCustomThemes() {
    if (!window.monaco) return;

    Object.entries(CUSTOM_THEMES).forEach(([name, theme]) => {
        monaco.editor.defineTheme(name, theme);
    });

    console.log('Custom themes registered');
}

// ==================== GET EDITOR OPTIONS ====================
function getEditorOptions(code, language) {
    return {
        value: code || '',
        language: language,
        theme: editorSettings.theme,
        fontSize: editorSettings.fontSize,
        tabSize: editorSettings.tabSize,

        // Layout
        automaticLayout: true,
        scrollBeyondLastLine: false,
        padding: { top: 10, bottom: 10 },

        // Line Numbers & Minimap
        lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
        lineNumbersMinChars: 4,
        minimap: {
            enabled: editorSettings.minimap,
            maxColumn: 80,
            renderCharacters: true,
            showSlider: 'mouseover',
            side: 'right',
            size: 'proportional'
        },

        // Word Wrap
        wordWrap: editorSettings.wordWrap ? 'on' : 'off',
        wordWrapColumn: 120,
        wrappingIndent: 'same',

        // Indentation
        insertSpaces: true,
        detectIndentation: true,
        autoIndent: editorSettings.autoIndent,

        // Brackets & Guides
        bracketPairColorization: { enabled: editorSettings.bracketPairs },
        guides: {
            bracketPairs: editorSettings.bracketPairs,
            indentation: editorSettings.indentGuides,
            highlightActiveIndentation: true,
            bracketPairsHorizontal: 'active'
        },
        matchBrackets: 'always',

        // Rendering
        renderWhitespace: editorSettings.renderWhitespace,
        renderControlCharacters: false,
        renderLineHighlight: editorSettings.renderLineHighlight,
        rulers: editorSettings.rulers,
        colorDecorators: editorSettings.colorDecorators,

        // Cursor
        cursorBlinking: editorSettings.cursorBlinking,
        cursorStyle: editorSettings.cursorStyle,
        cursorWidth: 2,
        cursorSmoothCaretAnimation: 'on',

        // Scrolling
        smoothScrolling: editorSettings.smoothScrolling,
        mouseWheelZoom: true,
        scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 12,
            useShadows: true,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            arrowSize: 15
        },

        // Code Actions
        formatOnPaste: editorSettings.formatOnPaste,
        formatOnType: editorSettings.formatOnType,
        autoClosingBrackets: editorSettings.autoClosingBrackets,
        autoClosingQuotes: editorSettings.autoClosingQuotes,
        autoSurround: 'languageDefined',

        // Folding
        folding: editorSettings.folding,
        foldingStrategy: 'indentation',
        foldingHighlight: true,
        unfoldOnClickAfterEndOfLine: true,
        showFoldingControls: editorSettings.showFoldingControls,

        // Suggestions
        quickSuggestions: {
            other: true,
            comments: false,
            strings: true
        },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'smart',
        tabCompletion: 'on',
        wordBasedSuggestions: 'matchingDocuments',
        parameterHints: { enabled: true },
        inlineSuggest: { enabled: editorSettings.inlineSuggest },

        // Features
        links: true,
        contextmenu: true,
        copyWithSyntaxHighlighting: true,
        dragAndDrop: true,
        emptySelectionClipboard: true,
        multiCursorModifier: 'ctrlCmd',

        // Sticky Scroll
        stickyScroll: { enabled: editorSettings.stickyScroll },

        // Find Widget
        find: {
            addExtraSpaceOnTop: false,
            autoFindInSelection: 'multiline',
            seedSearchStringFromSelection: 'selection'
        },

        // Hover
        hover: {
            enabled: true,
            delay: 300,
            sticky: true
        }
    };
}

// ==================== INITIALIZE EDITOR ====================
function initEditor(frm) {
    console.log('Initializing editor...');

    const wrapper = frm.fields_dict.code_editor.$wrapper;
    const container = wrapper.find('.editor-container')[0];

    if (!container) {
        console.error('Container not found');
        setTimeout(() => initEditor(frm), 500);
        return;
    }

    if (!window.monaco) {
        console.error('Monaco not loaded');
        return;
    }

    // Dispose old editor
    if (editor) {
        try {
            editor.dispose();
            editor = null;
        } catch (e) {
            console.error('Error disposing editor:', e);
        }
    }

    const language = getLanguage(frm.doc.code_type);

    // Create editor
    try {
        editor = monaco.editor.create(container, getEditorOptions(frm.doc.code, language));

        console.log('Editor created successfully');

        // Initialize UI
        initializeUI(frm);

        // Setup handlers
        setupEditorHandlers(frm);
        setupEditorEvents(frm);
        setupAutosave(frm);
        setupKeyboardShortcuts(frm);

        // Sync content changes
        editor.onDidChangeModelContent(() => {
            if (!frm._updating) {
                frm._updating = true;
                frm.set_value('code', editor.getValue());
                updateSaveStatus(frm, true);
                updateEditorInfo();
                setTimeout(() => { frm._updating = false; }, 100);
            }
        });

        // Force layout
        setTimeout(() => {
            if (editor) editor.layout();
        }, 100);

        showAlert('Monaco Editor Ready!', 'success');

    } catch (e) {
        console.error('Failed to create editor:', e);
        showAlert('Failed to create editor: ' + e.message, 'error');
    }
}

// ==================== INITIALIZE UI ====================
function initializeUI(frm) {
    const wrapper = frm.fields_dict.code_editor.$wrapper;

    // Set saved values
    wrapper.find('.select-theme').val(editorSettings.theme);
    wrapper.find('.input-fontsize').val(editorSettings.fontSize);
    wrapper.find('.label-fontsize').text(editorSettings.fontSize + 'px');
    wrapper.find('.select-tabsize').val(editorSettings.tabSize);

    // Update toggles
    wrapper.find('.toggle-wordwrap').prop('checked', editorSettings.wordWrap);
    wrapper.find('.toggle-minimap').prop('checked', editorSettings.minimap);
    wrapper.find('.toggle-linenumbers').prop('checked', editorSettings.lineNumbers);

    // Update toggle button states
    wrapper.find('.toggle-btn').each(function () {
        const input = $(this).find('input');
        $(this).toggleClass('active', input.is(':checked'));
    });

    // Update language display
    const language = getLanguage(frm.doc.code_type);
    wrapper.find('.lang-name').text(language.charAt(0).toUpperCase() + language.slice(1));

    // Update status bar
    updateEditorInfo();
}

// ==================== SETUP EDITOR HANDLERS ====================
function setupEditorHandlers(frm) {
    const wrapper = frm.fields_dict.code_editor.$wrapper;

    // Undo/Redo
    wrapper.find('.btn-undo').off('click').on('click', function () {
        if (editor) editor.trigger('keyboard', 'undo', null);
    });

    wrapper.find('.btn-redo').off('click').on('click', function () {
        if (editor) editor.trigger('keyboard', 'redo', null);
    });

    // Format button
    wrapper.find('.btn-format').off('click').on('click', function () {
        if (editor) {
            editor.getAction('editor.action.formatDocument').run();
            showAlert('Code Formatted', 'success');
        }
    });

    // Find button
    wrapper.find('.btn-find').off('click').on('click', function () {
        if (editor) editor.getAction('actions.find').run();
    });

    // Replace button
    wrapper.find('.btn-replace').off('click').on('click', function () {
        if (editor) editor.getAction('editor.action.startFindReplaceAction').run();
    });

    // Comment toggle
    wrapper.find('.btn-comment').off('click').on('click', function () {
        if (editor) editor.getAction('editor.action.commentLine').run();
    });

    // Fold All
    wrapper.find('.btn-fold-all').off('click').on('click', function () {
        if (editor) editor.getAction('editor.foldAll').run();
    });

    // Unfold All
    wrapper.find('.btn-unfold-all').off('click').on('click', function () {
        if (editor) editor.getAction('editor.unfoldAll').run();
    });

    // Fullscreen button
    wrapper.find('.btn-fullscreen').off('click').on('click', function () {
        toggleFullscreen(frm);
    });

    // Settings button
    wrapper.find('.btn-settings').off('click').on('click', function () {
        showSettingsDialog(frm);
    });

    // Keyboard shortcuts button
    wrapper.find('.btn-keyboard').off('click').on('click', function () {
        showKeyboardShortcuts();
    });

    // Theme selector
    wrapper.find('.select-theme').off('change').on('change', function () {
        const theme = $(this).val();
        editorSettings.theme = theme;
        saveSettings();
        if (editor) {
            monaco.editor.setTheme(theme);
        }
    });

    // Font size
    wrapper.find('.input-fontsize').off('input').on('input', function () {
        const size = parseInt($(this).val());
        editorSettings.fontSize = size;
        saveSettings();
        wrapper.find('.label-fontsize').text(size + 'px');
        if (editor) {
            editor.updateOptions({ fontSize: size });
        }
    });

    // Tab size
    wrapper.find('.select-tabsize').off('change').on('change', function () {
        const size = parseInt($(this).val());
        editorSettings.tabSize = size;
        saveSettings();
        wrapper.find('.indent-info').text('Spaces: ' + size);
        if (editor) {
            editor.getModel().updateOptions({ tabSize: size });
        }
    });

    // Toggle handlers
    wrapper.find('.toggle-wordwrap').off('change').on('change', function () {
        editorSettings.wordWrap = $(this).is(':checked');
        saveSettings();
        $(this).closest('.toggle-btn').toggleClass('active', editorSettings.wordWrap);
        if (editor) {
            editor.updateOptions({ wordWrap: editorSettings.wordWrap ? 'on' : 'off' });
        }
    });

    wrapper.find('.toggle-minimap').off('change').on('change', function () {
        editorSettings.minimap = $(this).is(':checked');
        saveSettings();
        $(this).closest('.toggle-btn').toggleClass('active', editorSettings.minimap);
        if (editor) {
            editor.updateOptions({ minimap: { enabled: editorSettings.minimap } });
        }
    });

    wrapper.find('.toggle-linenumbers').off('change').on('change', function () {
        editorSettings.lineNumbers = $(this).is(':checked');
        saveSettings();
        $(this).closest('.toggle-btn').toggleClass('active', editorSettings.lineNumbers);
        if (editor) {
            editor.updateOptions({ lineNumbers: editorSettings.lineNumbers ? 'on' : 'off' });
        }
    });
}

// ==================== SETUP EDITOR EVENTS ====================
function setupEditorEvents(frm) {
    if (!editor) return;

    // Cursor position change
    editor.onDidChangeCursorPosition((e) => {
        const wrapper = frm.fields_dict.code_editor.$wrapper;
        const pos = e.position;
        wrapper.find('.line-col').text(`Ln ${pos.lineNumber}, Col ${pos.column}`);
    });

    // Selection change
    editor.onDidChangeCursorSelection((e) => {
        const wrapper = frm.fields_dict.code_editor.$wrapper;
        const selection = editor.getSelection();

        if (selection && !selection.isEmpty()) {
            const selectedText = editor.getModel().getValueInRange(selection);
            const lines = selectedText.split('\n').length;
            const chars = selectedText.length;

            wrapper.find('.selection-info').show();
            wrapper.find('.selection-text').text(`${chars} chars, ${lines} lines`);
        } else {
            wrapper.find('.selection-info').hide();
        }
    });
}

// ==================== UPDATE EDITOR INFO ====================
function updateEditorInfo() {
    if (!editor) return;

    const wrapper = document.querySelector('[data-fieldname="code_editor"]');
    if (!wrapper) return;

    const model = editor.getModel();
    if (!model) return;

    const content = model.getValue();
    const lines = model.getLineCount();
    const chars = content.length;

    $(wrapper).find('.char-count').text(chars.toLocaleString() + ' chars');
    $(wrapper).find('.line-count').text(lines.toLocaleString() + ' lines');
}

// ==================== KEYBOARD SHORTCUTS ====================
function setupKeyboardShortcuts(frm) {
    if (!editor) return;

    // Save: Ctrl/Cmd + S
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        frm.save();
    });

    // Format: Shift + Alt + F
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
        editor.getAction('editor.action.formatDocument').run();
        showAlert('Code Formatted', 'success');
    });

    // Toggle Comment: Ctrl + /
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
        editor.getAction('editor.action.commentLine').run();
    });

    // Duplicate Line: Ctrl + Shift + D
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyD, () => {
        editor.getAction('editor.action.copyLinesDownAction').run();
    });

    // Move Line Up: Alt + Up
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, () => {
        editor.getAction('editor.action.moveLinesUpAction').run();
    });

    // Move Line Down: Alt + Down
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, () => {
        editor.getAction('editor.action.moveLinesDownAction').run();
    });

    // Delete Line: Ctrl + Shift + K
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyK, () => {
        editor.getAction('editor.action.deleteLines').run();
    });

    // Go to Line: Ctrl + G
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG, () => {
        editor.getAction('editor.action.gotoLine').run();
    });

    // Toggle Fullscreen: F11
    editor.addCommand(monaco.KeyCode.F11, () => {
        toggleFullscreen(frm);
    });
}

// ==================== SHOW KEYBOARD SHORTCUTS ====================
function showKeyboardShortcuts() {
    const shortcuts = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <style>
                .shortcut-table { width: 100%; border-collapse: collapse; }
                .shortcut-table th, .shortcut-table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
                .shortcut-table th { background: ${COLORS.lighter}; font-weight: 600; color: ${COLORS.dark}; }
                .shortcut-table tr:hover { background: ${COLORS.lighter}; }
                .kbd { background: ${COLORS.light}; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-size: 12px; border: 1px solid #d1d5db; }
            </style>
            
            <table class="shortcut-table">
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Shortcut</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Save</td><td><span class="kbd">Ctrl</span> + <span class="kbd">S</span></td></tr>
                    <tr><td>Format Code</td><td><span class="kbd">Shift</span> + <span class="kbd">Alt</span> + <span class="kbd">F</span></td></tr>
                    <tr><td>Find</td><td><span class="kbd">Ctrl</span> + <span class="kbd">F</span></td></tr>
                    <tr><td>Replace</td><td><span class="kbd">Ctrl</span> + <span class="kbd">H</span></td></tr>
                    <tr><td>Toggle Comment</td><td><span class="kbd">Ctrl</span> + <span class="kbd">/</span></td></tr>
                    <tr><td>Duplicate Line</td><td><span class="kbd">Ctrl</span> + <span class="kbd">Shift</span> + <span class="kbd">D</span></td></tr>
                    <tr><td>Delete Line</td><td><span class="kbd">Ctrl</span> + <span class="kbd">Shift</span> + <span class="kbd">K</span></td></tr>
                    <tr><td>Move Line Up</td><td><span class="kbd">Alt</span> + <span class="kbd">↑</span></td></tr>
                    <tr><td>Move Line Down</td><td><span class="kbd">Alt</span> + <span class="kbd">↓</span></td></tr>
                    <tr><td>Go to Line</td><td><span class="kbd">Ctrl</span> + <span class="kbd">G</span></td></tr>
                    <tr><td>Command Palette</td><td><span class="kbd">F1</span></td></tr>
                    <tr><td>Fullscreen</td><td><span class="kbd">F11</span></td></tr>
                    <tr><td>Fold All</td><td><span class="kbd">Ctrl</span> + <span class="kbd">K</span> + <span class="kbd">0</span></td></tr>
                    <tr><td>Unfold All</td><td><span class="kbd">Ctrl</span> + <span class="kbd">K</span> + <span class="kbd">J</span></td></tr>
                    <tr><td>Multi-cursor</td><td><span class="kbd">Alt</span> + Click</td></tr>
                    <tr><td>Select All Occurrences</td><td><span class="kbd">Ctrl</span> + <span class="kbd">Shift</span> + <span class="kbd">L</span></td></tr>
                </tbody>
            </table>
        </div>
    `;

    frappe.msgprint({
        title: __('Keyboard Shortcuts'),
        message: shortcuts,
        wide: true
    });
}

// ==================== SHOW SETTINGS DIALOG ====================
function showSettingsDialog(frm) {
    const d = new frappe.ui.Dialog({
        title: __('Editor Settings'),
        fields: [
            { fieldtype: 'Section Break', label: 'Appearance' },
            {
                fieldname: 'cursor_style',
                fieldtype: 'Select',
                label: 'Cursor Style',
                options: 'line\nblock\nunderline\nline-thin\nblock-outline\nunderline-thin',
                default: editorSettings.cursorStyle
            },
            {
                fieldname: 'cursor_blinking',
                fieldtype: 'Select',
                label: 'Cursor Animation',
                options: 'blink\nsmooth\nphase\nexpand\nsolid',
                default: editorSettings.cursorBlinking
            },
            {
                fieldname: 'render_whitespace',
                fieldtype: 'Select',
                label: 'Render Whitespace',
                options: 'none\nboundary\nselection\ntrailing\nall',
                default: editorSettings.renderWhitespace
            },
            {
                fieldname: 'line_highlight',
                fieldtype: 'Select',
                label: 'Line Highlight',
                options: 'none\ngutter\nline\nall',
                default: editorSettings.renderLineHighlight
            },

            { fieldtype: 'Section Break', label: 'Code Intelligence' },
            {
                fieldname: 'bracket_pairs',
                fieldtype: 'Check',
                label: 'Bracket Pair Colorization',
                default: editorSettings.bracketPairs
            },
            {
                fieldname: 'indent_guides',
                fieldtype: 'Check',
                label: 'Indentation Guides',
                default: editorSettings.indentGuides
            },
            {
                fieldname: 'color_decorators',
                fieldtype: 'Check',
                label: 'Color Decorators',
                default: editorSettings.colorDecorators
            },
            {
                fieldname: 'sticky_scroll',
                fieldtype: 'Check',
                label: 'Sticky Scroll',
                default: editorSettings.stickyScroll
            },

            { fieldtype: 'Section Break', label: 'Editing' },
            {
                fieldname: 'auto_indent',
                fieldtype: 'Select',
                label: 'Auto Indent',
                options: 'none\nkeep\nbrackets\nadvanced\nfull',
                default: editorSettings.autoIndent
            },
            {
                fieldname: 'auto_closing_brackets',
                fieldtype: 'Select',
                label: 'Auto Close Brackets',
                options: 'always\nlanguageDefined\nbeforeWhitespace\nnever',
                default: editorSettings.autoClosingBrackets
            },
            {
                fieldname: 'format_on_paste',
                fieldtype: 'Check',
                label: 'Format on Paste',
                default: editorSettings.formatOnPaste
            },
            {
                fieldname: 'format_on_type',
                fieldtype: 'Check',
                label: 'Format on Type',
                default: editorSettings.formatOnType
            },

            { fieldtype: 'Section Break', label: 'Scrolling & Folding' },
            {
                fieldname: 'smooth_scrolling',
                fieldtype: 'Check',
                label: 'Smooth Scrolling',
                default: editorSettings.smoothScrolling
            },
            {
                fieldname: 'folding',
                fieldtype: 'Check',
                label: 'Enable Folding',
                default: editorSettings.folding
            },
            {
                fieldname: 'folding_controls',
                fieldtype: 'Select',
                label: 'Folding Controls',
                options: 'always\nmouseover\nnever',
                default: editorSettings.showFoldingControls
            },

            { fieldtype: 'Section Break', label: 'Rulers (Column Guides)' },
            {
                fieldname: 'rulers',
                fieldtype: 'Data',
                label: 'Ruler Columns (comma-separated)',
                default: editorSettings.rulers.join(', ')
            }
        ],
        primary_action_label: __('Apply'),
        primary_action: function () {
            const values = d.get_values();

            // Update settings
            editorSettings.cursorStyle = values.cursor_style;
            editorSettings.cursorBlinking = values.cursor_blinking;
            editorSettings.renderWhitespace = values.render_whitespace;
            editorSettings.renderLineHighlight = values.line_highlight;
            editorSettings.bracketPairs = values.bracket_pairs;
            editorSettings.indentGuides = values.indent_guides;
            editorSettings.colorDecorators = values.color_decorators;
            editorSettings.stickyScroll = values.sticky_scroll;
            editorSettings.autoIndent = values.auto_indent;
            editorSettings.autoClosingBrackets = values.auto_closing_brackets;
            editorSettings.formatOnPaste = values.format_on_paste;
            editorSettings.formatOnType = values.format_on_type;
            editorSettings.smoothScrolling = values.smooth_scrolling;
            editorSettings.folding = values.folding;
            editorSettings.showFoldingControls = values.folding_controls;

            // Parse rulers
            try {
                editorSettings.rulers = values.rulers.split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r));
            } catch (e) {
                editorSettings.rulers = [80, 120];
            }

            saveSettings();

            // Apply to editor
            if (editor) {
                editor.updateOptions({
                    cursorStyle: editorSettings.cursorStyle,
                    cursorBlinking: editorSettings.cursorBlinking,
                    renderWhitespace: editorSettings.renderWhitespace,
                    renderLineHighlight: editorSettings.renderLineHighlight,
                    bracketPairColorization: { enabled: editorSettings.bracketPairs },
                    guides: {
                        bracketPairs: editorSettings.bracketPairs,
                        indentation: editorSettings.indentGuides,
                        highlightActiveIndentation: true
                    },
                    colorDecorators: editorSettings.colorDecorators,
                    stickyScroll: { enabled: editorSettings.stickyScroll },
                    autoIndent: editorSettings.autoIndent,
                    autoClosingBrackets: editorSettings.autoClosingBrackets,
                    formatOnPaste: editorSettings.formatOnPaste,
                    formatOnType: editorSettings.formatOnType,
                    smoothScrolling: editorSettings.smoothScrolling,
                    folding: editorSettings.folding,
                    showFoldingControls: editorSettings.showFoldingControls,
                    rulers: editorSettings.rulers
                });
            }

            showAlert('Settings Applied', 'success');
            d.hide();
        }
    });

    d.show();
}

// ==================== FULLSCREEN ====================
function toggleFullscreen(frm) {
    const wrapper = frm.fields_dict.code_editor.$wrapper;
    const container = wrapper.find('.monaco-wrapper');
    const btn = wrapper.find('.btn-fullscreen');

    if (!isFullscreen) {
        container.addClass('fullscreen');
        btn.html('<i class="fa fa-compress"></i> <span class="btn-label">Exit</span>');
        isFullscreen = true;

        $(document).on('keydown.fullscreen', function (e) {
            if (e.key === 'Escape') toggleFullscreen(frm);
        });
    } else {
        container.removeClass('fullscreen');
        btn.html('<i class="fa fa-expand"></i> <span class="btn-label">Fullscreen</span>');
        isFullscreen = false;

        $(document).off('keydown.fullscreen');
    }

    if (editor) {
        setTimeout(() => editor.layout(), 100);
    }
}

// ==================== AUTOSAVE ====================
function setupAutosave(frm) {
    if (!editor) return;

    let lastContent = frm.doc.code || '';

    const autoSave = debounce(() => {
        const content = editor.getValue();
        if (content !== lastContent && !frm.doc.__islocal) {
            frm.save('Save', null, null, () => {
                lastContent = content;
                updateSaveStatus(frm, false);
            });
        }
    }, EDITOR_CONFIG.AUTOSAVE_DELAY);

    editor.onDidChangeModelContent(() => {
        const content = editor.getValue();
        if (content !== lastContent) {
            updateSaveStatus(frm, true);
            autoSave();
        }
    });
}

// ==================== UPDATE STATUS ====================
function updateSaveStatus(frm, isDirty) {
    const wrapper = frm.fields_dict.code_editor.$wrapper;
    const status = wrapper.find('.save-status');

    if (isDirty) {
        status.removeClass('saved').addClass('unsaved');
        status.html('<i class="fa fa-circle"></i> Unsaved');
    } else {
        status.removeClass('unsaved').addClass('saved');
        status.html('<i class="fa fa-check-circle"></i> Saved');
    }
}

// ==================== CODE ANALYSIS ====================
function analyzeCode(frm) {
    if (!frm.doc.code || !frm.fields_dict.code_analysis) return;

    try {
        const code = frm.doc.code;
        const lines = code.split('\n');
        const totalLines = lines.length;
        const nonEmpty = lines.filter(l => l.trim()).length;
        const comments = lines.filter(l => {
            const t = l.trim();
            return t.startsWith('//') || t.startsWith('#') || t.startsWith('/*') || t.startsWith('*') || t.startsWith('"""') || t.startsWith("'''");
        }).length;

        const commentRatio = nonEmpty > 0 ? (comments / nonEmpty * 100).toFixed(1) : 0;

        // Extract functions
        const functions = [];
        if (frm.doc.code_type === 'Java Script') {
            const regex = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?function)/g;
            let match;
            while ((match = regex.exec(code)) !== null) {
                functions.push(match[1] || match[2] || match[3]);
            }
        } else if (frm.doc.code_type && frm.doc.code_type.includes('Python')) {
            const regex = /def\s+(\w+)\s*\(/g;
            let match;
            while ((match = regex.exec(code)) !== null) {
                functions.push(match[1]);
            }
        }

        // Extract API calls
        const apis = [];
        const frappeRegex = /frappe\.(\w+(?:\.\w+)*)/g;
        let match;
        while ((match = frappeRegex.exec(code)) !== null) {
            apis.push(`frappe.${match[1]}`);
        }

        // Extract frm calls
        const frmRegex = /frm\.(\w+(?:\.\w+)*)/g;
        while ((match = frmRegex.exec(code)) !== null) {
            apis.push(`frm.${match[1]}`);
        }

        const uniqueFuncs = [...new Set(functions)];
        const uniqueApis = [...new Set(apis)];

        const html = `
            <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                
                <!-- Stats Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    <div style="background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%); padding: 20px; border-radius: 12px; color: white;">
                        <div style="font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px;">Total Lines</div>
                        <div style="font-size: 32px; font-weight: 700; margin-top: 5px;">${totalLines}</div>
                    </div>
                    <div style="background: linear-gradient(135deg, ${COLORS.accent} 0%, #00A080 100%); padding: 20px; border-radius: 12px; color: white;">
                        <div style="font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px;">Characters</div>
                        <div style="font-size: 32px; font-weight: 700; margin-top: 5px;">${code.length.toLocaleString()}</div>
                    </div>
                    <div style="background: linear-gradient(135deg, ${COLORS.secondary} 0%, #04577A 100%); padding: 20px; border-radius: 12px; color: white;">
                        <div style="font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px;">Non-Empty Lines</div>
                        <div style="font-size: 32px; font-weight: 700; margin-top: 5px;">${nonEmpty}</div>
                    </div>
                    <div style="background: linear-gradient(135deg, ${COLORS.success} 0%, #0D9668 100%); padding: 20px; border-radius: 12px; color: white;">
                        <div style="font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px;">Comment Ratio</div>
                        <div style="font-size: 32px; font-weight: 700; margin-top: 5px;">${commentRatio}%</div>
                    </div>
                </div>

                <!-- Functions Section -->
                <div style="background: white; border: 1px solid ${COLORS.light}; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                    <h4 style="margin: 0 0 15px 0; color: ${COLORS.dark}; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                        <span style="background: ${COLORS.primary}; color: white; width: 28px; height: 28px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px;">
                            ${uniqueFuncs.length}
                        </span>
                        Functions Detected
                    </h4>
                    ${uniqueFuncs.length > 0 ? `
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${uniqueFuncs.map(fn => `
                                <span style="background: ${COLORS.lighter}; padding: 8px 14px; border-radius: 6px; font-family: 'Fira Code', 'Consolas', monospace; font-size: 13px; color: ${COLORS.dark}; border: 1px solid ${COLORS.light};">
                                    <span style="color: ${COLORS.primary}; font-weight: 600;">ƒ</span> ${fn}()
                                </span>
                            `).join('')}
                        </div>
                    ` : `<p style="color: ${COLORS.medium}; margin: 0; font-size: 14px;">No functions detected</p>`}
                </div>

                <!-- API Calls Section -->
                <div style="background: white; border: 1px solid ${COLORS.light}; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                    <h4 style="margin: 0 0 15px 0; color: ${COLORS.dark}; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                        <span style="background: ${COLORS.accent}; color: white; width: 28px; height: 28px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px;">
                            ${uniqueApis.length}
                        </span>
                        API Calls Detected
                    </h4>
                    ${uniqueApis.length > 0 ? `
                        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto;">
                            ${uniqueApis.map(api => `
                                <div style="background: ${COLORS.lighter}; padding: 10px 14px; border-radius: 6px; font-family: 'Fira Code', 'Consolas', monospace; font-size: 13px; color: ${COLORS.dark}; border-left: 3px solid ${COLORS.accent};">
                                    ${api}
                                </div>
                            `).join('')}
                        </div>
                    ` : `<p style="color: ${COLORS.medium}; margin: 0; font-size: 14px;">No API calls detected</p>`}
                </div>
            </div>
        `;

        frm.fields_dict.code_analysis.$wrapper.html(html);
    } catch (e) {
        console.error('Error analyzing code:', e);
    }
}

// ==================== VERSION CONTROL ====================
function addVersionButtons(frm) {
    if (frm.doc.__islocal) return;

    frm.add_custom_button(__('Create Version'), () => {
        frappe.prompt([
            {
                label: 'Version Type',
                fieldname: 'type',
                fieldtype: 'Select',
                options: 'Major\nMinor\nPatch',
                default: 'Patch',
                reqd: 1
            },
            {
                label: 'Notes',
                fieldname: 'notes',
                fieldtype: 'Small Text'
            }
        ], (values) => {
            const current = frm.doc.code_version || '1.0.0';
            const parts = current.split('.').map(Number);

            if (values.type === 'Major') {
                parts[0]++; parts[1] = 0; parts[2] = 0;
            } else if (values.type === 'Minor') {
                parts[1]++; parts[2] = 0;
            } else {
                parts[2]++;
            }

            const newVersion = parts.join('.');
            const code = editor ? editor.getValue() : frm.doc.code;

            frappe.call({
                method: 'frappe.client.insert',
                args: {
                    doc: {
                        doctype: 'Code Editor',
                        code_name: frm.doc.code_name,
                        code_type: frm.doc.code_type,
                        code: code,
                        code_description: frm.doc.code_description,
                        quick_note: values.notes || `Version ${newVersion}`,
                        code_version: newVersion
                    }
                },
                callback: (r) => {
                    if (r.message) {
                        showAlert(`Version ${newVersion} created`, 'success');
                        frappe.set_route('Form', 'Code Editor', r.message.name);
                    }
                }
            });
        }, __('Create New Version'), __('Create'));
    }, __('Version'));

    frm.add_custom_button(__('View History'), () => {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Code Editor',
                filters: { code_name: frm.doc.code_name },
                fields: ['name', 'code_version', 'creation', 'quick_note'],
                order_by: 'code_version desc',
                limit_page_length: 50
            },
            callback: (r) => {
                if (r.message && r.message.length) {
                    let html = `
                        <style>
                            .version-table { width: 100%; border-collapse: collapse; }
                            .version-table th, .version-table td { padding: 12px; text-align: left; border-bottom: 1px solid ${COLORS.light}; }
                            .version-table th { background: ${COLORS.lighter}; font-weight: 600; color: ${COLORS.dark}; }
                            .version-table tr:hover { background: ${COLORS.lighter}; }
                            .version-badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
                            .version-badge.current { background: ${COLORS.success}; color: white; }
                            .version-badge.version { background: ${COLORS.primary}; color: white; }
                        </style>
                        <table class="version-table">
                            <thead>
                                <tr>
                                    <th>Version</th>
                                    <th>Date</th>
                                    <th>Notes</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

                    r.message.forEach(v => {
                        const isCurrent = v.name === frm.doc.name;
                        html += `
                            <tr ${isCurrent ? `style="background: rgba(16,185,129,0.1);"` : ''}>
                                <td>
                                    <span class="version-badge version">${v.code_version}</span>
                                    ${isCurrent ? '<span class="version-badge current" style="margin-left: 8px;">Current</span>' : ''}
                                </td>
                                <td>${frappe.datetime.str_to_user(v.creation)}</td>
                                <td>${v.quick_note || '-'}</td>
                                <td><a href="/app/code-archive/${v.name}" class="btn btn-xs btn-default">Open</a></td>
                            </tr>
                        `;
                    });

                    html += '</tbody></table>';

                    frappe.msgprint({
                        title: __('Version History - {0}', [frm.doc.code_name]),
                        message: html,
                        wide: true
                    });
                }
            }
        });
    }, __('Version'));
}

// ==================== COMPLETIONS ====================
function setupCompletions() {
    try {
        // JavaScript Completions
        monaco.languages.registerCompletionItemProvider('javascript', {
            provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                return {
                    suggestions: [
                        // Frappe Call
                        {
                            label: 'frappe.call',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.call({\n\tmethod: "${1:path.to.method}",\n\targs: {\n\t\t${2:arg}: ${3:value}\n\t},\n\tfreeze: true,\n\tfreeze_message: __("${4:Loading...}"),\n\tcallback: function(r) {\n\t\tif (r.message) {\n\t\t\t${5:// handle response}\n\t\t}\n\t}\n});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Make a server-side method call',
                            range: range
                        },
                        // Frappe xcall (async)
                        {
                            label: 'frappe.xcall',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'const result = await frappe.xcall("${1:method}", {\n\t${2:arg}: ${3:value}\n});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Async/await server call',
                            range: range
                        },
                        // Message Print
                        {
                            label: 'frappe.msgprint',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.msgprint({\n\ttitle: __("${1:Title}"),\n\tmessage: __("${2:Message}"),\n\tindicator: "${3|green,red,orange,blue|}"\n});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Show a message dialog',
                            range: range
                        },
                        // Show Alert
                        {
                            label: 'frappe.show_alert',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.show_alert({\n\tmessage: __("${1:Message}"),\n\tindicator: "${2|green,red,orange,blue|}"\n}, ${3:5});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Show a temporary alert',
                            range: range
                        },
                        // Confirm Dialog
                        {
                            label: 'frappe.confirm',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.confirm(\n\t__("${1:Are you sure?}"),\n\tfunction() {\n\t\t// Yes\n\t\t${2}\n\t},\n\tfunction() {\n\t\t// No\n\t}\n);',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Show a confirmation dialog',
                            range: range
                        },
                        // Prompt
                        {
                            label: 'frappe.prompt',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.prompt([\n\t{\n\t\tlabel: "${1:Field}",\n\t\tfieldname: "${2:field}",\n\t\tfieldtype: "${3|Data,Int,Link,Select,Check|}",\n\t\treqd: 1\n\t}\n], function(values) {\n\t${4:// handle values}\n}, __("${5:Title}"), __("${6:Submit}"));',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Show an input dialog',
                            range: range
                        },
                        // DB Get Value
                        {
                            label: 'frappe.db.get_value',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.db.get_value("${1:DocType}", "${2:name}", "${3:field}").then(r => {\n\tconst value = r.message.${3:field};\n\t${4}\n});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Get a field value from database',
                            range: range
                        },
                        // DB Get List
                        {
                            label: 'frappe.db.get_list',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.db.get_list("${1:DocType}", {\n\tfields: ["${2:name}", "${3:field}"],\n\tfilters: {\n\t\t${4:field}: ${5:value}\n\t},\n\tlimit: ${6:20},\n\torder_by: "${7:creation desc}"\n}).then(records => {\n\t${8}\n});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Get a list of documents',
                            range: range
                        },
                        // DB Set Value
                        {
                            label: 'frappe.db.set_value',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.db.set_value("${1:DocType}", "${2:name}", "${3:field}", ${4:value}).then(r => {\n\t${5}\n});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Update a field value',
                            range: range
                        },
                        // DB Insert
                        {
                            label: 'frappe.db.insert',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.db.insert({\n\tdoctype: "${1:DocType}",\n\t${2:field}: ${3:value}\n}).then(doc => {\n\t${4}\n});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Insert a new document',
                            range: range
                        },
                        // FRM Set Value
                        {
                            label: 'frm.set_value',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frm.set_value("${1:fieldname}", ${2:value});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Set a field value in the form',
                            range: range
                        },
                        // FRM Refresh Field
                        {
                            label: 'frm.refresh_field',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frm.refresh_field("${1:fieldname}");',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Refresh a field display',
                            range: range
                        },
                        // FRM Toggle Display
                        {
                            label: 'frm.toggle_display',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frm.toggle_display("${1:fieldname}", ${2:true});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Show or hide a field',
                            range: range
                        },
                        // FRM Toggle Reqd
                        {
                            label: 'frm.toggle_reqd',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frm.toggle_reqd("${1:fieldname}", ${2:true});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Make a field mandatory or optional',
                            range: range
                        },
                        // FRM Add Custom Button
                        {
                            label: 'frm.add_custom_button',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frm.add_custom_button(__("${1:Button}"), function() {\n\t${2:// action}\n}${3:, __("Group")});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Add a custom button to the form',
                            range: range
                        },
                        // FRM Set Query
                        {
                            label: 'frm.set_query',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frm.set_query("${1:link_field}", function() {\n\treturn {\n\t\tfilters: {\n\t\t\t${2:field}: ${3:value}\n\t\t}\n\t};\n});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Set a query filter for a Link field',
                            range: range
                        },
                        // Form Script Template
                        {
                            label: 'frappe.ui.form.on',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: 'frappe.ui.form.on("${1:DocType}", {\n\trefresh: function(frm) {\n\t\t${2}\n\t},\n\n\tonload: function(frm) {\n\t\t${3}\n\t},\n\n\tvalidate: function(frm) {\n\t\t${4}\n\t}\n});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Form script template',
                            range: range
                        },
                        // Child Table Script
                        {
                            label: 'frappe.ui.form.on_child',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: 'frappe.ui.form.on("${1:Child DocType}", {\n\t${2:fieldname}: function(frm, cdt, cdn) {\n\t\tlet row = locals[cdt][cdn];\n\t\t${3}\n\t}\n});',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Child table row script',
                            range: range
                        },

                    ]
                };
            }
        });

        // Python Completions
        monaco.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                return {
                    suggestions: [
                        // Whitelist Decorator
                        {
                            label: '@frappe.whitelist()',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: '@frappe.whitelist()\ndef ${1:function_name}(${2:args}):\n\t"""${3:Docstring}"""\n\t${4:pass}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Whitelist function for API access',
                            range: range
                        },
                        // Get Doc
                        {
                            label: 'frappe.get_doc',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'doc = frappe.get_doc("${1:DocType}", "${2:name}")',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Get a document object',
                            range: range
                        },
                        // New Doc
                        {
                            label: 'frappe.new_doc',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'doc = frappe.new_doc("${1:DocType}")\ndoc.${2:field} = ${3:value}\ndoc.insert()',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Create a new document',
                            range: range
                        },
                        // Get All
                        {
                            label: 'frappe.get_all',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'records = frappe.get_all("${1:DocType}",\n\tfilters={"${2:field}": ${3:value}},\n\tfields=["${4:name}", "${5:field}"],\n\tlimit=${6:20}\n)',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Get list of documents',
                            range: range
                        },
                        // DB Get Value
                        {
                            label: 'frappe.db.get_value',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'value = frappe.db.get_value("${1:DocType}", "${2:name}", "${3:field}")',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Get a field value',
                            range: range
                        },
                        // DB Set Value
                        {
                            label: 'frappe.db.set_value',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.db.set_value("${1:DocType}", "${2:name}", "${3:field}", ${4:value})',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Update a field value',
                            range: range
                        },
                        // DB Exists
                        {
                            label: 'frappe.db.exists',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'if frappe.db.exists("${1:DocType}", "${2:name}"):\n\t${3:pass}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Check if document exists',
                            range: range
                        },
                        // DB SQL
                        {
                            label: 'frappe.db.sql',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'result = frappe.db.sql("""\n\tSELECT ${1:*}\n\tFROM `tab${2:DocType}`\n\tWHERE ${3:condition}\n""", as_dict=True)',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Execute SQL query',
                            range: range
                        },
                        // Throw
                        {
                            label: 'frappe.throw',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.throw(_("${1:Error message}"))',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Throw an error',
                            range: range
                        },
                        // MsgPrint
                        {
                            label: 'frappe.msgprint',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.msgprint(_("${1:Message}"), title=_("${2:Title}"))',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Show a message',
                            range: range
                        },
                        // Send Email
                        {
                            label: 'frappe.sendmail',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.sendmail(\n\trecipients=["${1:email@example.com}"],\n\tsubject="${2:Subject}",\n\tmessage="${3:Message}"\n)',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Send an email',
                            range: range
                        },
                        // Enqueue
                        {
                            label: 'frappe.enqueue',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'frappe.enqueue(\n\t"${1:module.path.function}",\n\tqueue="${2|short,default,long|}",\n\t${3:arg}=${4:value}\n)',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Queue a background job',
                            range: range
                        },
                        // Document Controller
                        {
                            label: 'DocType Controller',
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: 'import frappe\nfrom frappe.model.document import Document\n\n\nclass ${1:DocType}(Document):\n\tdef validate(self):\n\t\t${2:pass}\n\n\tdef on_submit(self):\n\t\t${3:pass}\n\n\tdef on_cancel(self):\n\t\t${4:pass}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Document controller template',
                            range: range
                        }
                    ]
                };
            }
        });

        console.log('Completions registered');
    } catch (e) {
        console.error('Error setting up completions:', e);
    }
}

// ==================== MAIN FORM SCRIPT ====================
frappe.ui.form.on('Code Editor', {
    onload: function (frm) {
        console.log('Code Editor: Form loading...');

        frm._updating = false;

        // Create editor HTML
        if (frm.fields_dict.code_editor) {
            frm.fields_dict.code_editor.$wrapper.html(createEditorHTML());
            console.log('Code Editor: HTML created');
        }

        // Load Monaco
        setTimeout(() => {
            if (!isMonacoLoaded) {
                loadMonaco(() => {
                    setTimeout(() => initEditor(frm), 300);
                });
            } else {
                setTimeout(() => initEditor(frm), 300);
            }
        }, 200);
    },

    refresh: function (frm) {
        console.log('Code Editor: Refresh');

        // Ensure editor exists
        if (isMonacoLoaded && !editor) {
            console.log('Reinitializing editor...');
            setTimeout(() => initEditor(frm), 200);
        }

        // Analyze code
        if (frm.doc.code) {
            analyzeCode(frm);
        }

        // Version buttons
        addVersionButtons(frm);

        // Action buttons
        frm.add_custom_button(__('Format'), () => {
            if (editor) {
                editor.getAction('editor.action.formatDocument').run();
                showAlert('Formatted', 'success');
            }
        }, __('Actions'));

        frm.add_custom_button(__('Copy'), () => {
            const code = editor ? editor.getValue() : frm.doc.code;
            navigator.clipboard.writeText(code).then(() => {
                showAlert('Copied!', 'success');
            });
        }, __('Actions'));

        frm.add_custom_button(__('Download'), () => {
            const exts = {
                'Java Script': 'js',
                'Server Python Script': 'py',
                'Python Code': 'py',
                'Server Command & Code': 'sh',
                'Frappe API': 'py',
                'CSS': 'css',
                'HTML': 'html',
                'JSON': 'json',
                'XML': 'xml',
                'SQL': 'sql',
                'Markdown': 'md',
                'TypeScript': 'ts'
            };

            const ext = exts[frm.doc.code_type] || 'txt';
            const filename = `${frm.doc.code_name || 'code'}.${ext}`;
            const code = editor ? editor.getValue() : frm.doc.code;

            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }, __('Actions'));

        frm.add_custom_button(__('Diff Compare'), () => {
            showDiffDialog(frm);
        }, __('Actions'));
    },

    code_type: function (frm) {
        if (editor && monaco) {
            const model = editor.getModel();
            if (model) {
                const language = getLanguage(frm.doc.code_type);
                monaco.editor.setModelLanguage(model, language);

                // Update language display
                const wrapper = frm.fields_dict.code_editor.$wrapper;
                wrapper.find('.lang-name').text(language.charAt(0).toUpperCase() + language.slice(1));
            }
        }
        if (frm.doc.code) analyzeCode(frm);
    },

    code: function (frm) {
        if (editor && !frm._updating) {
            const current = editor.getValue();
            const newVal = frm.doc.code || '';
            if (current !== newVal) {
                editor.setValue(newVal);
            }
        }
        if (frm.doc.code) analyzeCode(frm);
    },

    code_name: function (frm) {
        if (!frm.doc.code_version) {
            frm.set_value('code_version', '1.0.0');
        }
    },

    before_save: function (frm) {
        if (editor) {
            frm.doc.code = editor.getValue();
        }
    },

    after_save: function (frm) {
        showAlert('Saved Successfully!', 'success');
        updateSaveStatus(frm, false);
    }
});

// ==================== DIFF DIALOG ====================
function showDiffDialog(frm) {
    const d = new frappe.ui.Dialog({
        title: __('Compare Code'),
        size: 'extra-large',
        fields: [
            {
                fieldname: 'compare_code',
                fieldtype: 'Code',
                label: 'Paste code to compare',
                options: 'JavaScript'
            }
        ],
        primary_action_label: __('Compare'),
        primary_action: function () {
            const compareCode = d.get_value('compare_code');
            if (!compareCode) {
                frappe.msgprint(__('Please paste code to compare'));
                return;
            }

            showDiffView(frm.doc.code, compareCode);
            d.hide();
        }
    });
    d.show();
}

function showDiffView(original, modified) {
    const dialog = new frappe.ui.Dialog({
        title: __('Code Diff'),
        size: 'extra-large'
    });

    dialog.$body.html('<div id="diff-editor" style="height: 500px;"></div>');
    dialog.show();

    setTimeout(() => {
        if (window.monaco) {
            monaco.editor.createDiffEditor(document.getElementById('diff-editor'), {
                automaticLayout: true,
                theme: editorSettings.theme,
                renderSideBySide: true,
                readOnly: true
            }).setModel({
                original: monaco.editor.createModel(original, 'javascript'),
                modified: monaco.editor.createModel(modified, 'javascript')
            });
        }
    }, 100);
}

// ==================== CLEANUP ====================
window.addEventListener('beforeunload', () => {
    if (editor) {
        try {
            editor.dispose();
        } catch (e) {
            console.error('Cleanup error:', e);
        }
    }
});

console.log('✓ Code Editor Enhanced Script Loaded v3.0.0 - Capital Project Premium Edition');