import React,{useState,useEffect} from 'react'
import M from "materialize-css"
import { useHistory} from 'react-router-dom'

const CreatePost = () =>{
    const history = useHistory("")
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    //to wait for upload to cloudinary and then to node js
    useEffect(() => {
        //on node js 
        if(url){
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html: "Created post", classes:"#2e7d32 green darken-1"})
                history.push('/')
            }
            //console.log(data)
        }).catch(err=>{
            console.log(err)
        })
    }
    }, [url])

    const postDetails =()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","amisha64")
        //first request to cloudinary, takes some time
        fetch("https://api.cloudinary.com/v1_1/amisha64/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            //console.log(data)
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className= "card input-field"style={{
            margin:"30px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}>
            <input type="text" placeholder="title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}/>
            <input type="text" placeholder="body"
            value={body}
            onChange={(e)=>setBody(e.target.value)}/>
            <div className="file-field input-field">
                <div className="btn #64b55f6 blue darken-1">
                <span>Upload Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>
            <button class="btn waves-effect waves-light #64b55f6 blue darken-1"
            onClick={()=>postDetails()}>Submit Post
        </button>
        </div>
    )
}

export default CreatePost