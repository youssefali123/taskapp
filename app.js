

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
document.addEventListener("keypress", (e)=>{
    if(e.key == "Enter") add.click();
})
// moving
function setZ(e){
    e.forEach( (i)=>{
        i.style.zIndex = 1; 
    })
}

export function swap(ele, t){
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
function moving(y, top, element,t, x, y2){
    // abs(t)
    let next = y2 == Math.abs(y2) ? element.nextElementSibling : element.previousElementSibling;
    let h = element.offsetHeight / 2;
    let length = `${(y-h) - top}`;
    // element.style.top = `${length}px`;
    // element.style.top = `${y2}px`
    // element.style.left = `${x}px`

    element.style.transform = `translate(${0}px, ${y2}px)`;
    console.log(y2)

    // console.log("len ", length)
    // y2 >> Math.abs(t)
    if(Math.abs(y2) > 10){
        next.style.transition = "all 0.3s linear"
        next.style.backgroundColor = "#adadadd4";
        next.style.scale = "1.024"
    }
    if(Math.abs(y2) > 37){
        next.style.backgroundColor = "rgb(98, 184, 93)";
    }
    if(Math.abs(y2) < 10){
        next.style.transition = "none";
        next.style.backgroundColor = "white";
        next.style.scale = "1"
    }
}

let drag = false;
let initialPointerX, initialPointerY, initialTranslateX, initialTranslateY;
let currentX = 0;
let currentY = 0;
document.addEventListener("pointerdown", (doc)=>{
    doc.preventDefault();
    let element = doc.target.className == "del" ? null : doc.target.parentElement;
    if(element.className == "item"){
        initialPointerX = doc.clientX;
        initialPointerY = doc.clientY;
        initialTranslateX = currentX;
        initialTranslateY = currentY; 
        let item = document.querySelectorAll(".item");
        drag = true;
        element.style.cursor = "move";
        let top = element.offsetTop;
        element.addEventListener("pointermove", (e)=>{
            
            // if(drag) moving(y, top,element,t);
            if(drag){
                const deltaX = e.clientX - initialPointerX;
                const deltaY = e.clientY - initialPointerY;
                currentX = initialTranslateX + deltaX;
                currentY = initialTranslateY + deltaY;
                let y = e.clientY;
                setZ(item);
                element.style.zIndex = 100;
                let t = parseInt(element.style.top);
                moving(y, top,element,t , currentX, currentY);
            }
        })
        element.addEventListener("pointerleave", ()=> {
            drag = false;
        });
        element.addEventListener("pointerup", ()=> {
            console.log("up ",currentY);
            item.forEach((e)=>{
                e.style.cursor = "auto";
                //e.style.top = 0
                e.style.transition = "none";
                e.style.backgroundColor = "white";
                e.style.scale = "1"
            });
            element.style.cursor = "auto";
            let t = parseInt(element.style.top);
            // myY = currentY;
            // myEle = element;
            if( Math.abs(currentY) > 37) swap(element, currentY);
            if(Math.abs(currentY) > 0 || Math.abs(currentY) < 0) element.style.transform = "translate(0,0)";
    })
    }
})
// let myY;
// let myEle;
document.addEventListener("pointerup",()=> {
    currentX = 0;
    currentY = 0;
    drag = false;
    document.querySelectorAll(".item").forEach((e)=>{
        e.style.transform = translate(0,0);
        e.style.backgroundColor = "white";
        e.style.scale = "1";
        e.style.cursor = "auto"
        e.style.transform = "translate(0,0)"
    })
});
document.addEventListener('pointercancel', () => {
    drag = false;
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

document.addEventListener('touchmove', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });
