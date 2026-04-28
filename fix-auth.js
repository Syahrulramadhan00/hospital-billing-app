const fs = require('fs');
const path = require('path');

const dir = 'resources/js/Pages/Auth';
fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.jsx')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf-8');

        // Wrap input and label inside form-control and label > label-text structure
        content = content.replace(/<div>\s*<label htmlFor="([^"]+)" className="block label-text font-semibold">\s*(.*?)\s*<\/label>\s*<input([^>]+)\/>\s*(.*?)\s*<\/div>/gs, 
        (match, id, labelText, inputAttrs, errorMsg) => {
            return `<label className="form-control w-full">
                    <div className="label">
                        <span className="label-text font-semibold">${labelText.trim()}</span>
                    </div>
                    <input${inputAttrs}/>
                    ${errorMsg ? `<div className="label">
                        <span className="label-text-alt text-error">${errorMsg.replace(/<p[^>]*>(.*?)<\/p>/, '$1')}</span>
                    </div>` : ''}
                </label>`;
        });

        // the errorMsg match might capture the error block if it exists
        // the replace above assumes something. Let's fix the errorMsg part properly.
        content = content.replace(/<p className="text-sm text-error font-semibold mt-1">(\{errors\.[^}]+\})<\/p>/g, '<div className="label"><span className="label-text-alt text-error">$1</span></div>');

        // checkbox
        content = content.replace(/<div className="flex items-center">\s*<input([^>]+type="checkbox"[^>]+)\/>\s*<label htmlFor="([^"]+)" className="label-text cursor-pointer hover:text-primary transition-colors">\s*(.*?)\s*<\/label>\s*<\/div>/gs, 
        `<div className="form-control">
                    <label className="cursor-pointer label justify-start gap-3">
                        <input$1/>
                        <span className="label-text hover:text-primary transition-colors">$3</span>
                    </label>
                </div>`);

        fs.writeFileSync(path.join(dir, file), content);
    }
});
