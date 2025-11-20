module.exports = {
    optimizeATS: (sections) => {
        // Dummy logic: Improve skills for demo, flag formatting issues
        let feedback = [];
        let score = 80;
        if (sections.skills && sections.skills.length < 5) {
            feedback.push('Add more skills for better ATS compatibility.');
            sections.skills.push('Project Management', 'Agile');
            score += 7;
        }
        if (sections.experience && sections.experience.includes('table')) {
            feedback.push('Avoid tables in experience section.');
            score -= 5;
        }
        return feedback;
    },
    atsScore: (sections) => {
        // Demo ATS score
        let score = 80;
        if (sections.skills && sections.skills.length >= 5) score += 5;
        return score > 85 ? 87 : score;
    }
};