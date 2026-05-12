const fs = require('fs');
const postcss = require('postcss');

const scopePlugin = (scopeClass) => {
    return {
        postcssPlugin: 'ScopePlugin',
        Rule(rule) {
            if (rule.parent && rule.parent.type === 'atrule' && rule.parent.name.includes('keyframes')) {
                return;
            }
            if (rule.selector.includes(':root')) {
                rule.selector = rule.selector.replace(':root', `.${scopeClass}`);
                return;
            }
            if (rule.selector === 'body') {
                rule.selector = `.${scopeClass}`;
                return;
            }
            if (rule.selector.includes('[data-dark="true"]')) {
                if (rule.selector === '[data-dark="true"]') {
                    rule.selector = `[data-dark="true"]:has(.${scopeClass}), [data-dark="true"] .${scopeClass}`;
                } else {
                    rule.selector = rule.selector.replace(/\[data-dark="true"\]\s+/, `[data-dark="true"] .${scopeClass} `);
                }
                return;
            }

            if (rule.selector.includes(`.${scopeClass}`)) return;
            
            if (rule.selector.trim().startsWith('*')) return;

            const selectors = rule.selector.split(',').map(s => {
                let sel = s.trim();
                if (sel === '') return sel;
                return `.${scopeClass} ${sel}`;
            });
            rule.selector = selectors.join(', ');
        }
    }
}
scopePlugin.postcss = true;

async function run() {
    for (const {file, scope} of [
        {file: 'd:/Smriti AI/FrontEnd/src/components/User/User.css', scope: 'user-scope'},
        {file: 'd:/Smriti AI/FrontEnd/src/components/Doctor/Doctor.css', scope: 'doctor-scope'}
    ]) {
        const css = fs.readFileSync(file, 'utf8');
        const result = await postcss([scopePlugin(scope)]).process(css, { from: file, to: file });
        fs.writeFileSync(file, result.css);
        console.log(`Processed ${file}`);
    }
}

run().catch(console.error);
