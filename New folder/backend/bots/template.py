def choose_template(sections, template_name):
    # Simple example: injects section ordering based on template name
    if template_name == "modern":
        ordered_sections = ["summary", "skills", "experience", "education", "certifications"]
    else:
        ordered_sections = ["summary", "experience", "education", "skills", "certifications"]
    return {section: sections.get(section, "") for section in ordered_sections}