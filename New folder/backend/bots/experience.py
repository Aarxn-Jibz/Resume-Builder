def format_experience(sections):
    # Example: Format bullet points, standardize verbs.
    experience = sections.get("experience", "")
    formatted = experience.replace("-", "•").replace("\n", "\n• ")
    sections["experience"] = formatted
    return sections