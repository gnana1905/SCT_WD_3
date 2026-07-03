const questions=[
{q:'HTML stands for?',o:['Hyper Text Markup Language','High Text','Hyper Tool','None'],a:0},
{q:'CSS is used for?',o:['Database','Styling','Server','OS'],a:1},
{q:'JavaScript is?',o:['Programming Language','Database','Browser','Compiler'],a:0},
{q:'Which tag creates a link?',o:['<a>','<p>','<img>','<h1>'],a:0},
{q:'Which company developed JavaScript?',o:['Netscape','Google','Apple','IBM'],a:0},
{q:'Which property changes text color?',o:['font','color','text','bg'],a:1},
{q:'DOM means?',o:['Document Object Model','Data Object','Desktop','None'],a:0},
{q:'CSS framework?',o:['React','Bootstrap','Node','Flask'],a:1},
{q:'JS file extension?',o:['.js','.java','.py','.css'],a:0},
{q:'Responsive design uses?',o:['Media Queries','SQL','Java','PHP'],a:0}
];

let index=0,score=0,time=15,interval;

const startBtn=document.getElementById('startBtn');
const quiz=document.getElementById('quizBox');
const start=document.getElementById('startScreen');
const q=document.getElementById('question');
const ans=document.getElementById('answers');
const next=document.getElementById('nextBtn');
const timer=document.getElementById('timer');
const progress=document.getElementById('progress');

startBtn.onclick=()=>{start.classList.add('hidden');quiz.classList.remove('hidden');load();};

function load(){
clearInterval(interval);time=15;timer.textContent=time;
interval=setInterval(()=>{time--;timer.textContent=time;if(time==0){clearInterval(interval);lock();}},1000);
progress.textContent=`Question ${index+1}/${questions.length}`;
q.textContent=questions[index].q;
ans.innerHTML='';
questions[index].o.forEach((op,i)=>{
let b=document.createElement('button');
b.textContent=op;
b.onclick=()=>select(b,i);
ans.appendChild(b);
});
next.classList.add('hidden');
}
function select(btn,i){
clearInterval(interval);
[...ans.children].forEach(b=>b.disabled=true);
if(i===questions[index].a){btn.classList.add('correct');score++;}
else{btn.classList.add('wrong');ans.children[questions[index].a].classList.add('correct');}
next.classList.remove('hidden');
}
function lock(){
[...ans.children].forEach(b=>b.disabled=true);
ans.children[questions[index].a].classList.add('correct');
next.classList.remove('hidden');
}
next.onclick=()=>{
index++;
if(index<questions.length)load();
else finish();
}
function finish(){
quiz.classList.add('hidden');
document.getElementById('result').classList.remove('hidden');
document.getElementById('score').textContent=`${score}/${questions.length}`;
let best=Math.max(score,Number(localStorage.bestQuiz||0));
localStorage.bestQuiz=best;
document.getElementById('best').textContent=best;
if(score>=8)alert('🎉 Excellent Score!');
}
