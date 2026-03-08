// js/colorcode/javascript.js
const ColorCode = {
    javascript: function(code) {
        if (!code) return '';
        
        // Escape HTML
        let highlighted = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
            
        // regex replacements
        // comments must be done first to avoid matching keywords inside comments
        highlighted = highlighted.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span style="color: #7a8a9a;">$1</span>');
        
        // strings
        highlighted = highlighted.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span style="color: #71b157;">$&</span>');
        
        // keywords
        const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'new', 'this', 'typeof', 'try', 'catch', 'import', 'export', 'default', 'null', 'true', 'false', 'await', 'async'];
        const keywordRegex = new RegExp('\\b(' + keywords.join('|') + ')\\b(?!([^<]*>))', 'g');
        highlighted = highlighted.replace(keywordRegex, '<span style="color: #d15bd2;">$1</span>');
        
        // functions
        highlighted = highlighted.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span style="color: #d99a4e;">$1</span>');
        
        // numbers
        highlighted = highlighted.replace(/\b(\d+(?:\.\d+)?)\b(?!([^<]*>))/g, '<span style="color: #61b1c2;">$1</span>');
        
        return highlighted;
    }
};

window.ColorCode = ColorCode;
