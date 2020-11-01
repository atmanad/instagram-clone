import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

const Profile  = ()=>{
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    //const [url,setUrl] = useState("")
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setPics(result.mypost)
        })
     },[])
    useEffect(()=>{
        if(image){
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
            //console.log(data.url)
            //setUrl(data.url)
            //localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
            //dispatch({type:"UPDATEPIC",payload:data.url})
            fetch('updateimage',{
                method:"put",
               headers:{
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify({
                   pic:data.url
               })
           }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
               dispatch({type:"UPDATEPIC",payload:result.pic})
               //window.location.reload()
           })
       
        })
        .catch(err=>{
            console.log(err)
        })
    }
    },[image])
    const updateProfilepic = (file)=>{
        setImage(file)
    }
    return(
        //<h1>Profile</h1>
        <div style ={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
            display:"flex",
            justifyContent:"space-around",
            }}>
                <div>
                <img style={{width:"160px", height:"160px", borderRadius:"80px"}} 
                //src ="https://mobirise.com/bootstrap-template/profile-template/assets/images/timothy-paul-smith-256424-1200x800.jpg"
                src={state?state.pic:"loading"}/>
            </div>
            <div><h4>{state?state.name:"loading"}</h4>
            <h4>{state?state.email:"loading"}</h4>
            <div style ={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                <h5>{mypics.length} posts</h5>
                <h5>{state?state.followers.length:"0"} followers</h5>
                <h5>{state?state.following.length:"0"} following</h5>
            </div>
            </div>
            </div>
            <div className="file-field input-field">
            <div style={{
            margin:"10px",
            borderBottom:"1px solid grey"}}>
                <div className="btn #64b55f6 blue darken-1">
                <span>Update</span>
                <input type="file" onChange={(e)=>updateProfilepic(e.target.files[0])}/>
                </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
            
        </div>
        
    
    )
}


export default Profile