import { Component } from "react";
import { CiSearch } from "react-icons/ci";
import {  FaSortAmountUp } from "react-icons/fa";
import axios from "axios";
import { CiHashtag } from "react-icons/ci";
import "./index.css"


class Home extends Component{
    state = {
        title: "",
        description:"",
        category: "Others",
        searchWord: "",
        notesList: [],
        editedId: null 
     
    }

    onChangeTitle = (event) => {
        this.setState({title: event.target.value})
        
    }

    onChangeDescription = (event) => {
        this.setState({description: event.target.value})
        
    }

    onSearch = (event) => {
        this.setState({searchWord: event.target.value})
    }

    getSearchedDetails = async () => {
        const {searchWord} = this.state 
        if(searchWord !== ""){
        try{
        const response = await axios.get("http://localhost:9000/notes/search/",{
            params: {q: searchWord}
        });

        this.setState({
            notesList: response.data
        })
    }catch(e){
        alert("Error in finding")
    }
}else{
    alert("undefined Search")
}
    }

    fetchUsers = async () => {
        try{
            const response = await axios.get("http://localhost:9000/notes/")
            
            this.setState({notesList: response.data})
        }catch(err){
            alert("Error in Fetching the data")
            
        }
    }

    componentDidMount(){
        this.fetchUsers()
    }

    onDelete = async (id) => {
        try{
            await axios.delete(`http://localhost:9000/notes/${id}`)
            alert("Successfully Deleted Note")
            this.fetchUsers()
        
        }catch(err){
                alert("Not able to delete the note")
        }
    }

    onUpdate = async (id) => {
        const{notesList} = this.state 
        const note = notesList.find((eachItem) => eachItem.id === id)
        
        this.setState({
            title: note.title,
            description: note.description,
            category: note.category,
            editedId: id
        })
    }

    

    

    onSubmitNotes = async (event) => {
        event.preventDefault()
        const {title,description,category,editedId} = this.state 
        if(editedId == null){

        if(title !== "" && description !== ""){

            const newNote = {title,description,category}

        try{
            await axios.post("http://localhost:9000/notes",newNote)
            this.fetchUsers()
            alert("Notes created successfully");
        }catch(err){
            console.log("Error in creating notes",err);
        }
         }
        else{alert("Title and Description are Important")
        }
        }
        else{
            if(title !=="" && description !== ""){
                const updatedNote = {title,description,category}
                try{
                    const response = await axios.put(`http://localhost:9000/notes/${editedId}`,updatedNote)
                    if(response.status === 200){
                        alert("Note updated Successfully")
                       
                        this.setState({editedId: null, title: "", description:"",category:"Others"})
                        this.fetchUsers()
                    }
                } catch(err){
                    alert("Failed to update the note")
                }
            }else{
                alert("Title and description are required for updated")
            }
            
            
           
        }
    }

        
    
    
    onSelectCategory = (event) => {
        this.setState({category: event.target.value})
    }

    onSortTheNotes = () =>{
        
        const {notesList} = this.state 
        const sortednotesList = [...notesList].sort((a,b) => 
            new Date(a.created_at) - new Date(b.created_at)
        )
        this.setState({notesList: sortednotesList})
    }



    render(){
        const {notesList,searchWord,title,description,editedId} = this.state 
        
        return(
            <div className="home-container">
            <div className="header-container">
                <img src="https://res.cloudinary.com/diqwk5cdp/image/upload/v1732376499/Frame_2_vzabte.png" alt="logo" className="logo-img"/>
                <h1 className="main-heading">Personal Notes Manager</h1>
                
            </div>
            <form className="form-container" onSubmit={this.onSubmitNotes}>
                <div className="input-container">
                    <p className="title">Title : </p>
                    <input placeholder="Title" className="titleInput" onChange={this.onChangeTitle} value={title}/>
                    
                    <p className="description">Description</p>
                    <textarea className="description-container" placeholder="description" rows={5} cols={50} onChange={this.onChangeDescription} value={description}/>
                   
                    <div className="submit-container">
                    <div className="category-container">
                        <p className="title">Category</p>
                        <select className="select-container" onChange={this.onSelectCategory}>
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                            <option value="others">Others</option>
                        </select>
                    </div>
                    <div>
                        <button className="addButton" type="submit">{ editedId ? "Update" : "Add" }</button>
                    </div>
                    </div>
                    </div>
                    
            </form>
            <h1 className="notes-heading">Notes:</h1>
            <div className="search-and-sort-container">
            <div className="search-flex-container">
                <input type="search" className="search-container" onChange={this.onSearch} value={searchWord}/>
                <CiSearch size={30} onClick={this.getSearchedDetails} className="icon"/>
            </div>
            <FaSortAmountUp size={30} className="icon" onClick={this.onSortTheNotes}/>
            </div>

            <div>
                {notesList.length === 0 ? (
                    <div className="empty-data-container">
                        <img src="https://res.cloudinary.com/diqwk5cdp/image/upload/v1732070791/Empty_Box_Illustration_1_dfkrvg.png" alt="empty" className="empty-data"/>
                        <p className="no-data-found">No Data found</p>
                    </div>
                ) : (
                    <ul>
                    {notesList.map((eachNotes) => (
                        <li key={eachNotes.id} className="card-container">
                        <div className="category-icon-container">
                            <CiHashtag />
                            <p className="category-box">{eachNotes.category}</p>
                            </div>
                            <div className="title-div-container">
                            <p className="eachNote-title"><span className="text-con">Title:</span> {eachNotes.title} </p>
                            <p className="eachNote-created-date">Created At: {eachNotes.created_at}</p>
                            </div>
                            <p className="eachNote-description"><span className="text-con">Description:</span> {eachNotes.description}</p>
                            <div className="eachNote-update-and-buttons-container">
                                <div>
                                    <button type="button" onClick={ () => this.onUpdate(eachNotes.id)} className="list-button edit-button">Edit</button>
                                    <button type="button" onClick={() => this.onDelete(eachNotes.id)} className="list-button delete-button">Delete</button>
                                </div>
                                <div>
                                    <p className="updated-date">Updated At: {eachNotes.updated_at}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                    </ul>
                )}
            </div>
            
            </div>



            
        )
    }
}

export default Home 
