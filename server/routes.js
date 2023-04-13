const express = require("express");
const routes = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage()  })
const serverController = require("./controllers/server-controller");

routes.post("/login", serverController.loginService);
routes.get("/interviewer", serverController.interviewerService);
routes.get("/interviewer/selectors", serverController.getAllSelectors);
routes.get("/candidate", serverController.getAllCandidates);
routes.post("/candidate", serverController.getAllCandidatesByPage);
routes.get("/candidate/:id", serverController.getCandidateById);
routes.get("/criteriaGroup/:id", serverController.getCriteriaGroupById);
routes.get("/criteriaGroup", serverController.getCriteriaGroups);
routes.get("/criteria", serverController.getCriterias);
routes.get("/criteria/:id", serverController.getCriteriaById);
routes.post("/validateCandidate/:id", serverController.validateCandidate);
routes.post("/createCandidate",upload.single('file'), serverController.createCandidate);
routes.post("/createInterviewer", serverController.createInterviewer);
routes.post("/createFeedbackCriteria", serverController.createFeedbackCriteria);
routes.post("/createFeedbackGroups", serverController.createFeedbackGroups);
routes.post("/loginWithToken", serverController.loginWithToken);
routes.post("/workflow", serverController.workflow);
routes.post("/workflow/cancel", serverController.cancelWorkflow);
routes.get("/getAllHrs", serverController.getAllHrs);
routes.get("/interviewer/:id", serverController.getInterviewerById);
routes.delete("/deleteInterviewer/:id", serverController.deleteInterviewer);
routes.delete("/deleteCriteria/:id", serverController.deleteCriteria);
routes.delete("/deleteCriteriaGroup/:id", serverController.deleteCriteriaGroup);
routes.delete("/deleteCandidate/:id", serverController.deleteCandidate);
routes.put("/updateInterviewer", serverController.updateInterviewer);
routes.put("/updateGroups", serverController.updateGroups);
routes.put("/updateCriterias", serverController.updateCriterias);
routes.put("/updateCandidate", upload.single('file'),serverController.updateCandidate);
routes.get("/candidate/download/:id", serverController.downloadResume)
routes.get("/candidate/interviewer/:id", serverController.getCandidateInterviewerById);
routes.get("/excelDownload", serverController.excelDownload);
routes.post("/workflow/dropped",serverController.dropCandidate)
routes.post("/workflow/onHold",serverController.onHoldCandidate)
routes.post("/workflow/reInitiate",serverController.reInitiateCandidate)
routes.get("/admins",serverController.getAllAdmins)
routes.post("/workflow/skipAction", serverController.skipAction);
// routes.get("/admin/viewcandidate/:id", serverController.getCandidateById);
// routes.get("/interviewer/viewcandidate/:id", serverController.getCandidateById);

module.exports = routes;
