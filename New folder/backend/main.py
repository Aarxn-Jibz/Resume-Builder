from fastapi import FastAPI, UploadFile, Form
from bots.skills import analyze_skills
from bots.template import choose_template
from bots.experience import format_experience
from bots.ats import optimize_ats, ats_score
from models.resume import ResumeInput, ResumeOutput
from export.exporter import export_resume

app = FastAPI()

@app.post("/resume/build")
async def build_resume(data: ResumeInput):
    sections = analyze_skills(data)
    formatted = format_experience(sections)
    template_applied = choose_template(formatted, data.template_name)
    ats_opt, feedback = optimize_ats(template_applied)
    score = ats_score(ats_opt)
    result = ResumeOutput(
        sections=ats_opt,
        ats_score=score,
        feedback=feedback
    )
    return result

@app.post("/resume/export")
async def export_resume_api(data: ResumeOutput, filetype: str = Form("pdf")):
    file_bytes = export_resume(data.sections, filetype)
    return Response(file_bytes, media_type="application/octet-stream")