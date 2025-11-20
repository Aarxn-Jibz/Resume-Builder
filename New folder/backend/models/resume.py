from pydantic import BaseModel

class ResumeInput(BaseModel):
    raw_text: str
    template_name: str = "modern"

class ResumeOutput(BaseModel):
    sections: dict
    ats_score: int
    feedback: list