module.exports = {
    formatExperience: (sections) => {
        // Format experience as bullets (for demo)
        if (sections.experience) {
            sections.experience = sections.experience
                .split('\n')
                .map(line => line.startsWith('•') ? line : '• ' + line)
                .join('\n');
        }
        return sections;
    }
};