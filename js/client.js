
const socket=io('http://localhost:8000');

const form=document.getElementById('send-container');
const messageinput=document.getElementById('messageInp');
const messageContainer=document.querySelector('.chat-box');
const live=document.getElementsByClassName('live')
const LiveBox=document.getElementById('live-person')

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageinput.value;
    append(`you: ${message}`,'right');
    socket.emit('send',message);
    messageinput.value='';
    
})
var audio = new Audio('tune.mp3');

const append=(message,position)=>{
    const messageelement=document.createElement('div');
    messageelement.innerText=message;
    messageelement.classList.add('message')
    messageelement.classList.add(position);
    messageContainer.append(messageelement)
    if(position=='left'){
        audio.play();
    }
}

const appendLive=(name)=>{
    const liveperson=document.createElement('div');
    liveperson.classList.add('person');
    const para=document.createElement('p');
    liveperson.innerHTML='<i class="bi bi-emoji-sunglasses emoji"></i>';
    para.innerText=name;
    liveperson.append(para);
    LiveBox.append(liveperson);
}

let naam='';

let key='name';

do{
    // if(localStorage.getItem(key)){
    //     naam=localStorage.getItem(value)
    // }
    // else{
        naam= prompt("enter your name");
    //     localStorage.setItem(key,naam);
    // }
}while(naam.length <=0)
 
let namelist=[];

function refresh(){
    LiveBox.innerHTML='';
  namelist.map((item)=>{
     console.log(item);
     appendLive(`${item}`);
  })
 }
 const plive=document.getElementById('showlive');
 function listshow(){
    console.log('hii')
    plive.classList.toggle('live-hide')
    plive.classList.toggle('live-show')
   }

socket.emit('new-user-joined',naam)

// socket.on('new-user-joined',(naam)=>{
//     appendLive(`${naam}`);
// })
socket.on('user-joined',(naam)=>{
    append(`${naam} joined the chat`,'center');
})

socket.on('receive',(data)=>{
    append(`${data.name}:- ${data.message}`,'left');
})
socket.on('left',(name)=>{
    append(`${name} left the chat`,'center');
    namelist=namelist.filter(function(naam){
        return naam !==name;
      });
    //   localStorage.removeItem(key,name);
})
socket.on('new',(namearray)=>{
    namelist=[];
    namearray.map((naam)=>{
        namelist.push(naam);
    })
})

