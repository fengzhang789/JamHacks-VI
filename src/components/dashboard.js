import React from 'react' 
import { useState } from 'react'
import { addDoc } from 'firebase/firestore'
import {getFirestore, collection, getDocs, onSnapshot, doc} from 'firebase/firestore'


async function getData() {
    const db = getFirestore()

    const docRef = doc(db, "messsages", "SF");
    const docSnap = await getDocs(docRef);

    if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    }
}

getData()

function Dashboard() {
    const db = getFirestore()

    //collection ref
    const colRef = collection(db, 'messages')
    const [renderList, setRenderList] = useState();

    var msgs = []
    var texts = []


    // real time collection data
    onSnapshot(colRef, (snapshot) => {
        console.log("A")
        snapshot.docs.forEach((doc) => {
            msgs.push({ ...doc.data(), id: doc.id })
        })

    
        for (let i=0; i < msgs.length; i++) {
            texts.push(msgs[i].text.messages)
        }

        
        const lst = texts.map((item) => {
            
            return <div>{item}</div>         
        })
        console.log('B')
        setRenderList(lst)
        texts = []
    })
    



    const [messages, setMessage] = useState('')
    
    //ADDS A MESSAGE TO THE DATABASE
    const HandleSubmit = (e) => {
        e.preventDefault()
        addDoc(colRef, {
            text: {messages}
        })
            .then(() => {
                console.log('Message added to database')
                const element = <div>{messages}</div>
                setRenderList(renderList.append(element))
            })
            .catch((e) => {
                console.log(e)
            })
    }


    return (
    <div>
        <div id="MessageOut">
            <ul>
                {renderList}
            </ul>
            
        </div>
        <form className= "form" onSubmit={HandleSubmit}>
                <h1> Text Message </h1>
                <div className = "form-inputs">
                  <label htmlFor = "message"
                  className="form-label">
                    Message 
                  </label>
                    <input
                      id = 'message' 
                      type = 'message'
                      name='message'
                      className='form-input'
                      placeholder="Text appears here"
                      onChange={(e) => {setMessage(e.target.value)}}
                    />
                    <button>Send</button>
                </div>
             </form>
    </div>
    )
}



export default Dashboard