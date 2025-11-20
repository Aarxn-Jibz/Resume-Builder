class ResumeBuilderCrew:

    def __init__(self, raw_text):
        self.raw_text = raw_text
        self.sections = {}
        self.ats_score = 0

    def setup_resume(self):
        """Extract basic info and sections from raw text."""
        self.sections = self.parse_sections(self.raw_text)
        self.sections['summary'] = self.generate_summary()
        self.ensure_data_privacy()
    
    def parse_sections(self, text):
        """NLP parsing of Experience, Education, etc."""
        # Extract experience, education, skills, certifications, languages, projects
        return SkillsAnalyzerBot.parse_sections(text)

    def generate_summary(self):
        """Create summary using NLP."""
        return SkillsAnalyzerBot.generate_summary(self.raw_text)

    def format_experience(self):
        """Format experience/bullets/achievements."""
        self.sections['experience'] = ExperienceFormatterBot.format(self.sections.get('experience', ''))

    def choose_template(self):
        """Display template choices and apply selection."""
        self.sections = TemplateDesignerBot.apply_template(self.sections)
    
    def optimize_ats(self):
        """Optimize resume for ATS, iterate until score threshold met."""
        self.ats_score = ATSOptimizerBot.score(self.sections)
        while self.ats_score < 85:
            suggestions = ATSOptimizerBot.suggest_improvements(self.sections)
            self.sections = ATSOptimizerBot.apply_suggestions(self.sections, suggestions)
            self.ats_score = ATSOptimizerBot.score(self.sections)

    def export_resume(self):
        """Offer options for exporting (PDF, DOCX, TXT)."""
        ExporterBot.export(self.sections, filetype='pdf')
        ExporterBot.export(self.sections, filetype='docx')
        ExporterBot.export(self.sections, filetype='txt')

    def ensure_data_privacy(self):
        """Assure privacy/security for user data."""
        DataPrivacyBot.secure_data(self.sections)

    def full_workflow(self):
        self.setup_resume()
        self.format_experience()
        self.choose_template()
        self.optimize_ats()
        self.export_resume()