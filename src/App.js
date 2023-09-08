
import {useState,useEffect} from 'react'
// import {getMessages} from "@testing-library/jest-dom/dist/utils";
const App = ()=> {
    const [value , setValue] = useState(null)
    const [ message , setMessage] = useState(null)
    const [previousChats, setPreviousChats]= useState([])
    const [currentTitle ,setCurrentTitle]= useState(null)

    const createNewChat = ()=>{
        setMessage(null)
        setValue("")
        setCurrentTitle(null)
    }
    const handleClick=(uniqueTitle)=>{
        setCurrentTitle((uniqueTitle))
        setMessage(null)
        setValue("")
    }
    const getMessages =async ()=>{
        const options ={
            method:"POST",
            body: JSON.stringify({
                message:value
            }),
            headers:{
                "Content-Type":"application/json"
            }
        }
        try {
          const response =   await fetch('http://localhost:8000/completions' , options)
            const data = await response.json()
            setMessage(data.choices[0].message)
        } catch (error){
            console.log("hello 8000")
            console.error(error)
        }
    }

    useEffect(()=>{
        console.log(currentTitle, value , message)
        if(!currentTitle && value && message){
            setCurrentTitle(value)
        }
        if(currentTitle && value && message ){
            setPreviousChats(previousChats => (
                [...previousChats,
                    {
                 title: currentTitle,
                 role:"user",
                 content: value
                },
                    {
                        title: currentTitle,
                    role: message.role,
                        content: message.content
                     }
                ]
            ))
        }
    },[message,currentTitle])
    console.log(previousChats)
    const currentChat= previousChats.filter(previousChats=> previousChats.title === currentTitle)
  const uniqueTitle= Array.from( new Set (previousChats.map(previousChats => previousChats.title)))
    console.log(uniqueTitle)

  return (
      <div className="app">
        <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
            { uniqueTitle?.map((uniqueTitle,index)=><li key={index} onClick={()=>handleClick(uniqueTitle)}>{uniqueTitle}</li>)}

        </ul>
        <nav>
          <p>Made by Prateek</p>
        </nav>
        </section>
        <section className="main">
            {!currentTitle && <h1>PrateekGPT</h1>}
            <ul className="feed">
                {currentChat?.map((charMessage, index) => <li key={index}>
                    <p className="role">{charMessage.role}</p>
                    <p>{charMessage.content}</p>
                </li>)}
            </ul>
            <div className="bottom-section">
                <div className="input-container">
                    <textarea value={value} onChange={(e)=> setValue(e.target.value)}></textarea>
                    <div id="submit" onClick={getMessages}>➢</div>
                </div>
                <p className="info">
                    Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT August 3 Version

                </p>
            </div>
        </section>
      </div>
  )
}

export default App;
