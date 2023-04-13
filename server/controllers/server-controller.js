const endpoints = require("../endpoints");
const { serviceReq, loginToken } = require("../axios-calls");
const FormData = require('form-data')
const logger = require("../logger");

let reactAppUrl = process && process.env && process.env.REACT_APP_BASE_URL;

module.exports = {
  loginService: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.login}`;
    let response = await serviceReq(req,finalUrl, "POST", req.body,req.headers,false);
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  interviewerService: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllInterviewer}`;
    let response = await serviceReq(req,finalUrl, "GET");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  getAllSelectors: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllSelectors}`;
    let response = await serviceReq(req,finalUrl, "GET");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  getAllCandidates: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints}`;
    let response = await serviceReq(req,finalUrl, "GET");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  getCriteriaGroupById: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getCriteriaGroup}/${req.params.id}`;
    let response = await serviceReq(req,finalUrl, "GET");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  getCriterias: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getCriteria}`;
    let response = await serviceReq(req,finalUrl, "GET");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  getCriteriaById: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getCriteria}/${req.params.id}`;
    let response = await serviceReq(req,finalUrl, "GET");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  getCriteriaGroups: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getCriteriaGroup}`;
    let response = await serviceReq(req,finalUrl, "GET");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  validateCandidate: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllCandidates}/${req.params.id}`;
    let response = await serviceReq(req,finalUrl, "POST", {});
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  createCandidate: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllCandidates}`;
    let parseToNumber = ["expectedCtc","currentCtc"]
    let body = {}
    req.body['pointOfContactIds'] = typeof req.body['pointOfContactIds'] == "string"?req.body['pointOfContactIds'].split(",") : []
    let keys = Object.keys(req.body)
    keys.map(key=>{
      if(parseToNumber.includes(key)){
        body[key] = parseFloat(req.body[key]) || 0
      }
      else{
        body[key] = req.body[key]
      }
    })
    
    let response = await serviceReq(req,finalUrl, "POST", body, {isExternalUser:req.headers['isexternaluser'] || false });
    if (req.file && response && response.data && response.data.id) {
      let id = response.data['id']
      let form = new FormData()
      form.append('file', req.file.buffer, {
        contentType: req.file.mimetype,
        filename: req.file.originalname,
      })
      let finalResumeUrl = `${reactAppUrl}${endpoints.uploadCandidateResume}${id}`;
      let fileresponse = await serviceReq(req,finalResumeUrl, "POST", form, { ...req.headers, ...form.getHeaders(),isExternalUser: req.headers['isexternaluser'] || false })
      let statusCode = fileresponse.status || 400
      res.status(statusCode).send(fileresponse.data)
    }
    else {
      let statusCode = response.status || 400
      res.status(statusCode).send(response.data);
    }
  },
  createInterviewer: async (req, res, next) => {
    debugger
    let finalUrl = `${reactAppUrl}${endpoints.getAllInterviewer}`;
    let response = await serviceReq(req,finalUrl, "POST", req.body);
    console.log(response,"keysssss")
    debugger
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  createFeedbackCriteria: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getCriteria}`;
    debugger
    let response = await serviceReq(req,finalUrl, "POST", req.body);
    debugger
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  createFeedbackGroups: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getCriteriaGroup}`;
    let response = await serviceReq(req,finalUrl, "POST", req.body);
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  getCandidateById: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllCandidates}/${req.params.id}`;
    debugger
    let response = await serviceReq(req,finalUrl, "GET");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  loginWithToken: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.loginWithToken}`;
    let response = await loginToken(finalUrl, "POST", req.body.body, req.headers,false);
    res.send(response);
  },
  workflow: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.workflow}`;
    debugger
    let response = await serviceReq(req,finalUrl, "POST", req.body);
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  cancelWorkflow: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.workflow}${endpoints.cancelWorkflow}`;
    let response = await serviceReq(req,finalUrl, "POST", req.body);
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  getAllHrs: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllInterviewer}/hrs`;
    let response = await serviceReq(req,finalUrl, "GET");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  deleteInterviewer: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllInterviewer}/${req.params.id}`;
    let response = await serviceReq(req,finalUrl, "DELETE");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  deleteCriteria: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getCriteria}/${req.params.id}`;
    let response = await serviceReq(req,finalUrl, "DELETE");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  deleteCriteriaGroup: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getCriteriaGroup}/${req.params.id}`;
    let response = await serviceReq(req,finalUrl, "DELETE");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  deleteCandidate: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllCandidates}/${req.params.id}`;
    let response = await serviceReq(req,finalUrl, "DELETE");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  getInterviewerById: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllInterviewer}/${req.params.id}`;
    let response = await serviceReq(req,finalUrl, "GET");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  updateInterviewer: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllInterviewer}`;
    let response = await serviceReq(req,finalUrl, "PUT", req.body);
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  updateGroups: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getCriteriaGroup}`;
    let response = await serviceReq(req,finalUrl, "PUT", req.body);
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  updateCriterias: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getCriteria}`;
    let response = await serviceReq(req,finalUrl, "PUT", req.body);
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  updateCandidate: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllCandidates}`;
    req.body['pointOfContactIds'] = typeof req.body['pointOfContactIds'] == "string"?req.body['pointOfContactIds'].split(",") : []
    let response = await serviceReq(req,finalUrl, "PUT", req.body, { isExternalUser: req.headers['isexternaluser'] || false });
    if (req.file && response && response.data && response.data.id) {
      let id = response.data['id']
      let form = new FormData()
      form.append('file', req.file.buffer, {
        contentType: req.file.mimetype,
        filename: req.file.originalname,
      })
      let finalResumeUrl = `${reactAppUrl}${endpoints.uploadCandidateResume}${id}`;
      let fileresponse = await serviceReq(req,finalResumeUrl, "POST", form, { ...req.headers, ...form.getHeaders(),isExternalUser: req.headers['isexternaluser'] || false })
      let statusCode = fileresponse.status || 400
      res.status(statusCode).send(fileresponse.data)
    }
    else {
      let statusCode = response.status || 400
      res.status(statusCode).send(response.data);
    }
  },
  downloadResume: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllCandidates}/download/${req.params.id}`;
    let response = await serviceReq(req,finalUrl, "GET", req.body, req.headers,true,true); 
      response && response.data && response.data.pipe(res) // #2
    },
  getCandidateInterviewerById: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllCandidates}${endpoints.getAllInterviewer}/${req.params.id}`;
    let response = await serviceReq(req,finalUrl, "GET");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  getAllCandidatesByPage: async (req, res, next) => {
    let record = req.body.records || 10
    let page = req.body.page || 1
    let finalUrl = `${reactAppUrl}${endpoints.getAllCandidates}/${page}/${record}`;
    let response = await serviceReq(req,finalUrl, "GET");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  excelDownload:  async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllCandidates}/export/excel?`;
    Object.keys(req.query || {}).map((key)=>{
      finalUrl+=`${key}=${req.query[key]}&`
    })
    let response = await serviceReq(req,finalUrl, "GET", req.body, req.headers,true,true); 
    response && response.data && response.data.pipe(res) 
  },
  dropCandidate:async(req,res,next)=>{
    let finalUrl = `${reactAppUrl}${endpoints.workflow}${endpoints.dropped}`;
    let response = await serviceReq(req,finalUrl, "POST", req.body);
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  onHoldCandidate:async(req,res,next)=>{
    let finalUrl = `${reactAppUrl}${endpoints.workflow}${endpoints.onHold}`;
    let response = await serviceReq(req,finalUrl, "POST", req.body);
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  reInitiateCandidate:async(req,res,next)=>{
    let finalUrl = `${reactAppUrl}${endpoints.workflow}${endpoints.reInitiate}`;
    let response = await serviceReq(req,finalUrl, "POST", req.body);
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  getAllAdmins: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.getAllInterviewer}${endpoints.getAllAdmins}`;
    let response = await serviceReq(req,finalUrl, "GET");
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
  skipAction: async (req, res, next) => {
    let finalUrl = `${reactAppUrl}${endpoints.workflow}${endpoints.skipAction}`;
    let response = await serviceReq(req,finalUrl, "POST", req.body);
    let statusCode = response.status || 400
    res.status(statusCode).send(response.data);
  },
};
