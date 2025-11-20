module.exports = {
    applyTemplate: (sections, templateName) => {
        // Reorder sections based on template
        let orderedSections = templateName === "modern" ?
            ["summary", "skills", "experience", "education", "certifications"]
            : ["summary", "experience", "education", "skills", "certifications"];
        let newSections = {};
        orderedSections.forEach(key => {
            if (sections[key]) newSections[key] = sections[key];
        });
        return newSections;
    }
};