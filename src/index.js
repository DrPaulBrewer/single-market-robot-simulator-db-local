/* Copyright 2017 Paul Brewer, Economic and Financial Technology Consulting LLC */
/* This file is open source software.  The MIT License applies to this software. */

/*
 * store should be set to window.localStorage or window.sessionStorage with init(_)
 *
 */

let store = null;  

import deepEqual from "deep-equal";

export function init(obj){
    store = obj;
}

export function openList(name, defaultValue=[]){
    if ( (defaultValue) && (!(store.getItem(name))) ){
        store.setItem(name, JSON.stringify(defaultValue));
    }
    return name;        
}

export function promiseUpload(){
    throw new Error("upload unavailable when using local storage");
}

export function promiseList(list){
    return new Promise(function(resolve, reject){
        const S = store;
        const data = S.getItem(list);
        setTimeout(()=>{
            if (data)
                return resolve(JSON.parse(data));
            reject("storage for  "+list+" does not exist locally");
        },0);
    });
}

export function promiseListRange(list, iFrom, iTo){
    return promiseList(list).then((data)=>data.slice(iFrom,iTo));
}

export function promiseSaveItem(item, list){
    return (promiseList(list)
            .then(
                (data)=>{
                    data.unshift(item);
                    store.setItem(list, JSON.stringify(data));
                })
           );
}

export function promiseRemoveItem(item, list){
    return (promiseList(list)
            .then(
                (data)=>{
                    const newData = data.filter( (x)=>(!deepEqual(x,item,true)) );
                    store.setItem(list, JSON.stringify(newData));
                })
           );
}                        

export function promiseMoveItem(item,list1,list2){
    return Promise.all(
        [promiseSaveItem(item,list2),
         promiseRemoveItem(item,list1)
        ]
    );  
}

