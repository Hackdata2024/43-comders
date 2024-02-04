import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 3000;

import bodyParser from 'body-parser';
let ejsprompt;
let tbd ="";
// import axios from 'axios';
// import pg from 'pg';
// const { GoogleGenerativeAI } = require("@google/generative-ai");
app.use(cors());
// Access your API key as an environment variable (see "Set up your API key" above)
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
  
const MODEL_NAME = "gemini-pro";
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static)
const API_KEY = 'AIzaSyCNDmkpECQr4AgyGwHinpzqFoFOeyknNSU';
function encodeHTML(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
}
function decodeHTML(str) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
    });
}
app.post("/prompt",(req,res)=>{
    let prompt = `${req.body.prompting}. Make your answer to the point and short and crisp`;
    // console.log(prompt);
    // console.log(req);
    let isreceived  = false;
    let response;
    async function run() {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };
    
        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];
    // My tummy is hurting and i am experiencing vomitting. Suggest some what type of doctor i should visit?. Only suggest me one doctor type so i can match this type of doctor with my database and find such near doctors
        const parts = [
            {text: prompt},
        ];
    
        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            safetySettings,
        });
    
        response = result.response;
        isreceived = true;
        
        console.log(response.text());
        tbd =" " + response.text();
        console.log(tbd);
        // tbd = encodeHTML(tbd);
        tbd = decodeHTML(tbd);
        tbd = tbd.replace(/&#39;|&apos;/g, ' ');
        res.redirect("/yes");
    }
    run();
    if(isreceived!=false){
        res.send("There has been error in fetching your request");
    }
})


// app.get("/yes",(req,res)=>{
//   res.send("Hurray you have cleared round one of this project");
// })
app.get('/yes',(req,res)=>{
  res.render('sample.ejs',{
    ejsprompt: tbd
  });
})
app.get("/",(req,res)=>{
  res.render('index.ejs');
})
app.listen(PORT,()=>{
  console.log("Server is working at port number : "+PORT);
})