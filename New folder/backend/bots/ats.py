def optimize_ats(sections):
    # Check ATS compatibility, suggest fixes.
    feedback = []
    # Example check: No tables/images, simple section headings, etc.
    score = 80   # Dummy score
    # Suggest adding more keywords if score < 85
    if score < 85:
        feedback.append("Add more job-specific keywords to 'skills' and 'experience'.")
        # Simulate adding keywords
        sections["skills"] = sections.get("skills", []) + ["Project Management", "Agile"]
        score = 87
    return sections, feedback

def ats_score(sections):
    return 87    # Dummy implementation