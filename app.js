

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
    let move = document.createElement("div");
    move.innerHTML = "="
    move.classList.add("move");
    title.appendChild(move);
    title.appendChild(document.createTextNode(Mytile));
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
        let move = document.createElement("div");
        move.innerHTML = "=";
        move.classList.add("move");
        title.appendChild(move);
        title.appendChild(document.createTextNode(data[i].title));
        item.appendChild(title);
        right.appendChild(edit)
        right.appendChild(del);
        // title.innerHTML = data[i].title;
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
function removeAnim(id, left = 0){
    let item = document.querySelector(`#${id}`);
    let width = item.offsetWidth;
    let x = (width + 10) - left;
    gsap.to(`#${id}`,{
        x: x,
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
function remove(id,e, dur, left = 0){
        removeAnim(id , left);
        removeItem(id);
        setTimeout(()=>{
            e.remove();
            if(mydata.length == 0){
                first();
            }
        }, dur)
}
document.addEventListener("click" , (e)=>{
    if(e.target.className == "del"){
        let id = e.target.parentElement.parentElement.id;
        let element = e.target.parentElement.parentElement;
        remove(id, element, 300);
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
export function setZ(e){
    e.forEach( (i)=>{
        i.style.zIndex = 1; 
    })
}

export function swap(ele, t){
    let nextEle = t == Math.abs(t) ? ele.nextElementSibling : ele.previousElementSibling;
    let curId = ele.id;
    let nexId;

    let indexC, indexN;
    if(nextEle){
        nexId = nextEle.id;
    for(let i = 0; i < mydata.length;i++){
        if(mydata[i].id == curId){
            indexC = i;
        }
        if(mydata[i].id == nexId){
            indexN = i;
        }
    }
}
    if(indexC || indexN){
        [ mydata[indexC], mydata[indexN] ] = [ mydata[indexN], mydata[indexC] ];
    }
    window.localStorage.data = JSON.stringify(mydata);
    getDataFromStorage(false);
}
function myKey(bool = false){
    document.addEventListener("keydown", (e)=>{
        console.log(e.ctrlKey);
        if(e.key == "Control"){
            bool = true;
        }
    })
    document.addEventListener("keyup", (e)=>{
        bool = false;
    })
    return bool;
}
myKey();
function moving(element, dir, myTarget = 0){
    // console.log("moving up ", dir.y)
    // abs(t)
    let l = `${element.style.transform}`;
    let x = Boolean(l) ? parseInt(l.split("(")[1].split(",")[0]) : dir.x;  
    let y = Boolean(l) ? parseInt(l.split("(")[1].split(",")[1].split(")")[0]) : dir.y;

    function replace(){
    let next = dir.y == Math.abs(dir.y) ? element.nextElementSibling : element.previousElementSibling;
    let h = element.offsetHeight / 2;
    // let length = `${(y-h) - top}`
        // element.style.transform = `translate(${dir.x}px, ${0}px)`;
    if(myTarget){
        element.style.transform = `translate(${0}px, ${dir.y}px)`
    }else{
        element.style.transform = `translate(${dir.x}px, ${0}px)`
    }
    
    // console.log(y)
    if(next){
    if(Math.abs(y) > 10){
        next.style.transition = "all 0.3s linear"
        next.style.backgroundColor = "#adadadd4";
        next.style.scale = "1.024"
    }
    if(Math.abs(y) > 37){
        next.style.backgroundColor = "rgb(98, 184, 93)";
    }
    if(Math.abs(y) < 10){
        next.style.transition = "none";
        next.style.backgroundColor = "white";
        next.style.scale = "1"
    }
}
}
    replace();
}
function ctrl(){
    let bool = false;
    document.addEventListener("keydown", (e)=>{
        console.log(e.ctrlKey);
        if(e.key == "Control"){
            bool = true;
        }
    })
    document.addEventListener("keyup", (e)=>{
        bool = false;
    })
    return bool;
}
console.log(ctrl())
let drag = false;
let initialPointerX, initialPointerY, initialTranslateX, initialTranslateY;
let currentX = 0;
let currentY = 0;
document.addEventListener("pointerdown", (doc)=>{
    doc.preventDefault();
    // let element = doc.target.className == "del" ? null : doc.target.parentElement;
    // let element = doc.target.className == "move" ? doc.target.parentElement.parentElement : (doc.target.className == "del" ? null : doc.target.parentElement);
    let myTarget = {move: doc.target.className == "move" ? true : false, del: doc.target.parentElement.className == "del" ? true : false};
    let element = myTarget.move ? doc.target.parentElement.parentElement : (myTarget.del ? null : doc.target.parentElement);
    console.log("element ", element);
    console.log("myTarget ", myTarget);
    console.log("ele ", doc.target.parentElement.className);
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
            if(drag){
                const deltaX = e.clientX - initialPointerX;
                const deltaY = e.clientY - initialPointerY;
                currentX = initialTranslateX + deltaX;
                currentY = initialTranslateY + deltaY;
                setZ(item);
                element.style.zIndex = 100;
                let t = parseInt(element.style.top);
                let dir = {x:currentX, y:currentY};
                moving(element, dir, myTarget.move);
            }
        })
        element.addEventListener("pointerleave", ()=> {
            drag = false;
        });
        element.addEventListener("pointerup", ()=> {
            console.log("up ",currentX);
            moving(element, {x:currentX, y:currentY});
            if(Math.abs(currentX) > (element.offsetWidth / 2 + 10)){
                //element.remove();
                //removeItem(element.id);
                element.style.left = `${currentX}px`;
                remove(element.id, element, 300, Math.abs(currentX));
            }else{
                element.style.transform = "translate(0,0)"
            }
            item.forEach((e)=>{
                e.style.cursor = "auto";
                //e.style.top = 0
                e.style.transition = "none";
                e.style.backgroundColor = "white";
                e.style.scale = "1"
            });
            element.style.cursor = "auto";
            let t = parseInt(element.style.top);
            if( Math.abs(currentY) > 37) swap(element, currentY);
            if(Math.abs(currentY) > 0 || Math.abs(currentY) < 0) element.style.transform = "translate(0,0)";
    })
    }
})

document.addEventListener("pointerup",()=> {
    currentX = 0;
    currentY = 0;
    drag = false;
    document.querySelectorAll(".item").forEach((e)=>{
        e.style.transform = "translate(0,0)";
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

function popUp(){
    input.blur();
    document.body.style.overflow = "hidden";
    // document.body.style.height = "100vh";
    // document.body.style.width = "100%";
    // document.body.style.position = "fixed";

    let mainDiv = document.createElement("div");
    mainDiv.classList.add("mainDiv");
    mainDiv.style.top = `${window.scrollY}px`;
    let innerDiv = document.createElement("div");
    innerDiv.classList.add("innerDiv");
    mainDiv.appendChild(innerDiv);
    document.body.appendChild(mainDiv);
    
}

document.addEventListener("scroll", (e)=>{
    if(window.scrollY > 80000000){
        popUp();
        console.log("scrolling", window.scrollY);
    }else{
        // document.body.style.overflow = "scroll";
        // document.body.style.height = "auto";
        // document.body.style.width = "auto";
        // document.body.style.position = "relative";
        // document.querySelector(".mainDiv").remove();
    }
})
document.addEventListener("keypress", (e)=>{
    if(e.key == "v"){
        document.addEventListener("scroll", (e)=>{
            e.preventDefault();
        })
        popUp();
    }   
    })  
    document.addEventListener('touchmove', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });      