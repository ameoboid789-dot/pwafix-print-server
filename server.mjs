import express from 'express';
import { chromium } from 'playwright';
const app=express();
const origin=process.env.ALLOWED_ORIGIN || 'https://pwafix.pages.dev';
const api=process.env.PWAFIX_API_URL || 'https://pwafix-api.ameoboid789.workers.dev';
app.use(express.json({limit:'35mb'}));
app.use((req,res,next)=>{res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');if(req.method==='OPTIONS')return res.sendStatus(204);next()});
app.post('/render-pdf',async(req,res)=>{
 let browser;
 try {
  if(req.get('origin')!==origin) return res.status(403).json({error:'Origin not allowed'});
  const authorization=req.get('authorization')||'';
  if(!authorization.startsWith('Bearer '))return res.status(401).json({error:'Login required'});
  const auth=await fetch(api+'/me',{headers:{Authorization:authorization}});
  if(!auth.ok)return res.status(401).json({error:'Invalid session'});
  const {html}=req.body||{};
  if(typeof html!=='string'||html.length>30000000)return res.status(400).json({error:'Invalid HTML'});
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:794,height:1123},deviceScaleFactor:1});
  await page.route('**/*',route=>route.abort()); // all assets must be embedded as data URLs
  await page.setContent(html,{waitUntil:'load',timeout:30000});
  await page.evaluate(()=>document.fonts.ready);
  const pdf=await page.pdf({format:'A4',printBackground:true,preferCSSPageSize:true,margin:{top:'0',right:'0',bottom:'0',left:'0'}});
  res.type('application/pdf').send(pdf);
 } catch(e){console.error(e);res.status(500).json({error:'PDF rendering failed'});}
 finally{if(browser)await browser.close()}
});
app.listen(Number(process.env.PORT)||3000,()=>console.log('PDF renderer ready'));
