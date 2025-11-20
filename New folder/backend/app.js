const express = require('express');
const bodyParser = require('body-parser');
const skillsBot = require('./bots/skills');
const experienceBot = require('./bots/experience');
const templateBot = require('./bots/template');
const atsBot = require('./bots/ats');
const exporter = require('./export/exporter');

const app = express();
app.use(bodyParser.json());

app.post('/resume/build', (req, res) => {
    let data = req.body;
    let sections = skillsBot.analyzeSkills(data);
    sections = experienceBot.formatExperience(sections);
    sections = templateBot.applyTemplate(sections, data.templateName);
    let atsFeedback = atsBot.optimizeATS(sections);
    let atsScore = atsBot.atsScore(sections);
    res.json({
        sections, atsScore, feedback: atsFeedback
    });
});

app.post('/resume/export', (req, res) => {
    let { sections, filetype } = req.body;
    let fileBuffer = exporter.exportResume(sections, filetype);
    res.set('Content-Type', 'application/octet-stream');
    res.send(fileBuffer);
});

app.listen(5000, () => console.log('Backend running on port 5000'));