import logger from './logger';

const axios = require('axios')
const fetch = require('node-fetch')
const {getCookie} = require("./utils")

export const serviceReq = async(reqObject,reqUrl,reqMethod,reqPayload,reqHeaders,enableAuthCookie=true,filehandle) =>{
    let options = {
        method:reqMethod || 'GET',
        url:reqUrl || '',
        data:reqPayload || {},
        headers:reqHeaders || {}
    }
    if(enableAuthCookie){
        options['headers']['token'] = getCookie("token",reqObject["headers"]['cookie'])
        options['headers']['mstoken'] = getCookie("mstoken",reqObject["headers"]['cookie'])
    }
    if(filehandle){
        options['responseType']= 'stream'
    }
    if(reqMethod == 'GET' || reqMethod == 'get'){
        delete options['data']
    }
    try{
        let resp = await axios(options).then(res=>{
            return res
        }).catch(err=>{
            logger.error(err.response && err.response.data && err.response.data.error)
            return err?.response
        })
        if(resp && resp.status !== 200){
            return resp;
        }
        if(filehandle){
            return resp
        }
        return resp
    } catch(e){
        logger.info(e);
    }
}

export const loginToken = async(reqUrl,reqMethod,reqPayload,reqHeaders) =>{
    let options = {
        method:"POST",
        body:reqPayload || {},
        headers:reqHeaders || {}
    }
    try{
        let resp = await fetch(reqUrl,options)
        let data = await resp.json();
        return data;
        } catch(e){
        console.log(e);
    }
}
