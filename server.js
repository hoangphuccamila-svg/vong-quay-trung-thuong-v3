const http=require('http'),fs=require('fs'),path=require('path'),url=require('url');
const PORT=process.env.PORT||3000;
const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD||'CAMILA-ADMIN-2026';
const DATA=path.join(__dirname,'data.json');
const prizes=[
 {name:'Bao cơm trưa',weight:0.5},{name:'Cà phê',weight:0.5},
 {name:'10.000 VND',weight:15},{name:'20.000 VND',weight:20},
 {name:'50.000 VND',weight:10},{name:'100.000 VND',weight:4},
 {name:'200.000 VND',weight:2},{name:'Trúng Gió',weight:5}
];
if(!fs.existsSync(DATA))fs.writeFileSync(DATA,JSON.stringify({players:{},history:[]},null,2));
const read=()=>JSON.parse(fs.readFileSync(DATA,'utf8'));
const write=x=>fs.writeFileSync(DATA,JSON.stringify(x,null,2));
const json=(res,code,obj)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*'});res.end(JSON.stringify(obj))};
const body=req=>new Promise((resolve,reject)=>{let b='';req.on('data',c=>b+=c);req.on('end',()=>{try{resolve(b?JSON.parse(b):{})}catch(e){reject(e)}})});
function pick(){let total=prizes.reduce((s,p)=>s+p.weight,0),r=Math.random()*total;for(const p of prizes){r-=p.weight;if(r<0)return p.name}return prizes.at(-1).name}
const server=http.createServer(async(req,res)=>{
 const u=url.parse(req.url,true);
 if(req.method==='GET'&&u.pathname==='/api/prizes')return json(res,200,{prizes});
 if(req.method==='POST'&&u.pathname==='/api/login'){const b=await body(req);return json(res,b.password===ADMIN_PASSWORD?200:401,b.password===ADMIN_PASSWORD?{ok:true}:{ok:false})}
 if(req.method==='POST'&&u.pathname==='/api/player'){const b=await body(req),d=read(),code=String(b.code||'').trim().toUpperCase();if(!code)return json(res,400,{error:'Thiếu mã người chơi'});d.players[code]??={turns:0,createdAt:new Date().toISOString()};write(d);const history=d.history.filter(h=>h.code===code).reverse();const used=history.length,total=d.players[code].turns+used;return json(res,200,{code,turns:d.players[code].turns,total,used,history})}
 if(req.method==='POST'&&u.pathname==='/api/grant'){const b=await body(req);if(b.password!==ADMIN_PASSWORD)return json(res,401,{error:'Sai mật khẩu'});const d=read(),code=String(b.code||'').trim().toUpperCase(),turns=Math.max(0,parseInt(b.turns||0));if(!code||!turns)return json(res,400,{error:'Mã và số lượt không hợp lệ'});d.players[code]??={turns:0,createdAt:new Date().toISOString()};d.players[code].turns+=turns;write(d);return json(res,200,{code,turns:d.players[code].turns})}
 if(req.method==='GET'&&u.pathname==='/api/admin/players'){if(u.query.password!==ADMIN_PASSWORD)return json(res,401,{error:'Sai mật khẩu'});const d=read();return json(res,200,{players:d.players,history:d.history.slice(-100).reverse()})}
 if(req.method==='POST'&&u.pathname==='/api/spin'){const b=await body(req),d=read(),code=String(b.code||'').trim().toUpperCase();if(!code||!d.players[code])return json(res,404,{error:'Mã người chơi chưa được cấp'});if(d.players[code].turns<=0)return json(res,403,{error:'Bạn đã hết lượt quay'});const prize=pick();d.players[code].turns--;d.history.push({code,prize,time:new Date().toISOString()});write(d);const used=d.history.filter(h=>h.code===code).length,total=d.players[code].turns+used;return json(res,200,{prize,turns:d.players[code].turns,total,used})}
 let file=u.pathname==='/'?'/index.html':u.pathname;const p=path.join(__dirname,'public',file);
 if(fs.existsSync(p)){const ext=path.extname(p),types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};res.writeHead(200,{'Content-Type':types[ext]||'text/plain'});return res.end(fs.readFileSync(p))}
 res.writeHead(404);res.end('Not found');
});
server.listen(PORT,'0.0.0.0',()=>console.log('V3.2 running on port '+PORT));
