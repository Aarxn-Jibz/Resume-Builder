module.exports = {
    analyzeSkills: (data) => {
        // Simple regex-based skill extraction (replace with NLP for production)
        let skills = [];
        let rawText = data.rawText;
        const skillKeywords = [/Python/gi, /JavaScript/gi, /Leadership/gi, /React/gi, /Node\.js/gi];
        skillKeywords.forEach(rx => {
            let found = rawText.match(rx);
            if (found) skills.push(found[0]);
        });
        return {...data.sections, skills: [...new Set(skills)]};
    }
};