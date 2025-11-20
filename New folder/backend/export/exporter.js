module.exports = {
    exportResume: (sections, filetype) => {
        // Simple TXT export for demo
        let content = Object.entries(sections)
            .map(([sec, body]) => `${sec.toUpperCase()}:\n${body}\n`)
            .join('\n');
        // PDF/DOCX: would require real libraries (e.g. pdfkit, docx)
        return Buffer.from(content, 'utf-8');
    }
};