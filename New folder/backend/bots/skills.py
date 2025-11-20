def analyze_skills(resume_input):
    # Example: Extracts skills with simple NLP
    import re
    skills = re.findall(r"(Python|JavaScript|Teamwork|Leadership|Machine Learning)", resume_input.raw_text, re.IGNORECASE)
    resume_input.sections["skills"] = list(set(skills))
    return resume_input.sections