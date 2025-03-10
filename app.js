

let add = document.querySelector(".add");
let input = document.getElementById("input");
let tasks = document.querySelector(".tasks"); 

let mydata =  [];

function generteId(){
    let n1 = Math.round(Math.random() * 9);
    let n2 = Math.round(Math.random()*9);
    let n3 = Math.round(Math.random()*9);
    let n4 = Math.round(Math.random()*9);
    let n5 = Math.round(Math.random()*9);
    let myId = `it${n1}${n2}${n3}${n4}${n5}`;
    return myId;
}

function addItem(Mytile){
    let item = document.createElement("div");
    item.classList.add("item");
    let id = generteId()
    item.setAttribute("id" , id);
    let title = document.createElement("div");
    let del = document.createElement("span");
    del.classList.add("del");
    del.innerHTML = "delete";
    let right = document.createElement("div");
    right.classList.add("rightSide");
    let edit = document.createElement("span");
    edit.innerHTML = "edit";
    edit.classList.add("edit");
    right.appendChild(edit)
    right.appendChild(del);
    title.innerHTML = Mytile;
    item.appendChild(title);
    item.appendChild(right);
    tasks.appendChild(item);
    return id;
}
function setDataToSotrage(id, title){
    mydata.push( {id: id, title: title} );
    window.localStorage.setItem("data", JSON.stringify(mydata));

}

function getDataFromStorage(check = true){
    let data = check == true ? JSON.parse(localStorage.data) : mydata;
    let n = data.length;
    if(!check){
        tasks.innerHTML = "";
    }
    for(let i = 0; i < n; i++){
        let item = document.createElement("div");
        item.classList.add("item");
        item.setAttribute("id" , data[i].id);
        let title = document.createElement("div");
        let del = document.createElement("span");
        del.classList.add("del");
        del.innerHTML = "delete";
        let right = document.createElement("div");
        right.classList.add("rightSide");
        let edit = document.createElement("span");
        edit.innerHTML = "edit";
        edit.classList.add("edit");
        right.appendChild(edit)
        right.appendChild(del);
        title.innerHTML = data[i].title;
        item.appendChild(title);
        item.appendChild(right);
        tasks.appendChild(item);
    }
}
function removeItem(id){
    let n = mydata.length;
    let index = -1;
    for(let i = 0; i < n; i++){
        if(mydata[i].id == id){
            index = i;
        }
    }
    if(index != -1){
        mydata = mydata.filter( (e, i)=> i != index );
        window.localStorage.setItem("data", JSON.stringify(mydata));
    }
}
function removeAnim(id){
    let item = document.querySelector(`#${id}`);
    let width = item.offsetWidth;
    gsap.to(`#${id}`,{
        x: -(width+10),
        duration: 0.4,
        opacity: 0.5,
        ease: "power1.inOut"
    })
}
function first(){
    let noTask = document.createElement("h3");
    noTask.innerHTML = "no tasks yet! create your first task now.";
    noTask.style.color = "rgb(251, 127, 12)";
    tasks.appendChild(noTask);
}

document.addEventListener("click" , (e)=>{
    if(e.target.className == "del"){
        let id = e.target.parentElement.parentElement.id;
        removeAnim(id);
        removeItem(id);
        setTimeout(()=>{
            e.target.parentElement.parentElement.remove();
            if(mydata.length == 0){
                first();
            }
        }, 300)
    }
    if(e.target.className == "edit"){
        let id = e.target.parentElement.parentElement.id;
        sweet(id)
    }
})
    /**
     * edits the task with the given id with the given text
     * @param {string} text - the new title of the task
     * @param {string} id - the id of the task
     */
function edit(text,id){
    let n = mydata.length;
    mydata.forEach((i)=>{
        if(i.title == input.value) title = true;
    });
    let index = -1;
    for(let i = 0; i < n; i++){
        if(mydata[i].id == id){
            index = i;
        }
    }
    if(index != -1){
        
        mydata[index].title = text;
        window.localStorage.data = JSON.stringify(mydata);
        getDataFromStorage(false);
        
    }
}
function sweet(id){
    
    Swal.fire({
        title: "edit the task",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Save",
    }).then((result) => {
        if (result.isConfirmed) { 

            let title = false;
            mydata.forEach((i)=>{
            if(i.title == result.value) title = true;
        });

        if(!title && result.value.length > 0){
                edit(result.value, id);
                
            }
        else{
            // Swal.fire("this task is aready exists!", "", "error");
            
            Swal.fire(
                {
                    title: "this task is already exists!",
                    confirmButtonText: "OK",
                    icon: "error",
                    
                }
            ).then((r)=>{
                if(r.isConfirmed){
                    sweet(id);
                }
            })
        }
            //Swal.fire(`g-${title}`, "", "success");
        }
    });
    
}


add.addEventListener("click", ()=>{
    let title = false;
    let exists = document.querySelector(".container .form h3");
    mydata.forEach((i)=>{
        if(i.title == input.value) title = true;
    });
    if(input.value.trim().length > 0){
        if(!title){
            exists.classList.add("none");
            let id = addItem(input.value);
            setDataToSotrage(id, input.value);
            input.value = "";
            if(tasks.firstElementChild.tagName == "H3"){
                tasks.firstElementChild.remove();
            }
        }else{
        //Swal.fire("this task is already exists!", "", "error");
        exists.classList.remove("none");
    }
    }
});

// moving
function moving(y, top, element,t){
    let next = t == Math.abs(t) ? element.nextElementSibling : element.previousElementSibling;
    let h = element.offsetHeight / 2;
    let length = `${(y-h) - top}`;
    element.style.top = `${length}px`;
    // console.log("len ", length)
    if(Math.abs(t) > 10){
        next.style.transition = "all 0.3s linear"
        next.style.backgroundColor = "#adadadd4";
        next.style.scale = "1.024"
    }
    if(Math.abs(t) > 37){
        next.style.backgroundColor = "rgb(98, 184, 93)";
    }
    if(Math.abs(t) < 10){
        next.style.transition = "none";
        next.style.backgroundColor = "white";
        next.style.scale = "1"
    }
}

function setZ(e){
    e.forEach( (i)=>{
        i.style.zIndex = 1; 
    })
}

function swap(ele, t){
    let nextEle = t == Math.abs(t) ? ele.nextElementSibling : ele.previousElementSibling;
    let curId = ele.id;
    let nexId = nextEle.id;
    // console.log("cur: ", curId, " nex: ", nexId);
    let indexC, indexN;
    for(let i = 0; i < mydata.length;i++){
        if(mydata[i].id == curId){
            indexC = i;
        }
        if(mydata[i].id == nexId){
            indexN = i;
        }
    }
    if(indexC || indexN){
        [ mydata[indexC], mydata[indexN] ] = [ mydata[indexN], mydata[indexC] ];
    }
    window.localStorage.data = JSON.stringify(mydata);
    getDataFromStorage(false);
}
let drag = false;
document.addEventListener("mousedown", (doc)=>{
    let element = doc.target.className == "del" ? null : doc.target.parentElement;
    // console.log(doc.target)
    if(element.className == "item"){
        let item = document.querySelectorAll(".item");
        
        drag = true;
        element.style.cursor = "move";
        let top = element.offsetTop;
        element.addEventListener("mousemove", (e)=>{
            let y = e.clientY;
            setZ(item);
            element.style.zIndex = 100;
            let t = parseInt(element.style.top);
            if(drag) moving(y, top,element,t);
            // console.log(t);
            // if(t > 10){
            //     element.nextElementSibling.style.transition = "all 0.3s linear"
            //     element.nextElementSibling.style.backgroundColor = "#adadadd4";
            //     element.nextElementSibling.style.scale = "1.024"
            // }
            // if(t < 10){
            //     element.nextElementSibling.style.transition = "none";
            //     element.nextElementSibling.style.backgroundColor = "white";
            //     element.nextElementSibling.style.scale = "1"
            // }
        })
        element.addEventListener("mouseleave", ()=> {
            drag = false;
        });
        element.addEventListener("mouseup", ()=> {
            item.forEach((e)=>{
                e.style.cursor = "auto";
                //e.style.top = 0
                e.style.transition = "none";
                e.style.backgroundColor = "white";
                e.style.scale = "1"
            });
            element.style.cursor = "auto";
            let t = parseInt(element.style.top);
            if( Math.abs(t) > 37) swap(element, t);
            if(t > 0 || t < 0) element.style.top = 0;
    })
    }
})

document.addEventListener("mouseup",()=> {
    drag = false;
    document.querySelectorAll(".item").forEach((e)=>{
        e.style.top = 0;
        e.style.backgroundColor = "white";
        e.style.scale = "1";
        e.style.cursor = "auto"
    })
});

window.onload = ()=>{
    input.focus();
    if(localStorage.data){
        getDataFromStorage();
        mydata = JSON.parse(localStorage.data);
    }
    if(tasks.children.length == 0){
        first();
    }
}
// 67 control  117 u
// let ctrl = false;
// let u = false;
// document.addEventListener("keydown", (e)=>{
//     if(e.key.charCodeAt() == 67){
//         ctrl = true;
//     }
//     if(e.key.charCodeAt() == 117){
//         u = true;
//     }
//     if(ctrl && u){
//         alert("you pressed ctrl + u")
//         e.preventDefault();
//     }
// });
// document.addEventListener("keyup",(e)=>{
//     // ctrl =false;
//     // u = false;
//     if(e.key.charCodeAt() == 67) ctrl = false;
//     if(e.key.charCodeAt() == 117) u = false;
//     console.log(ctrl, u)
// })

let set = new Set([1,1,2,3,4]);

let myMap = new Map([
    [1, 2],
    ['a',4]
]);
let arr = [1,1,1,2,3,4,4,5,6];
arr = [...new Set(arr)];
function arg(){
    return Array.from(arguments);
}
console.log(arg(...set,"a"))

const location = {
    5: "a",
    10: "b",
    15: "c",
    20: "d",
    25: "e"
}
let numLocation = [5,10,15,20,25];
let n1 = [10,30,10,20];
let n2 = [30,20,10]

console.log(new Set([...n1, ...n2]))
// regular expression

let string = "Hello Elzero Web School I Love elzero";
// i >> not case sensitive
// g >> global
let reg = /elzero/ig;
console.log(string.match(reg));

// for scrolling


