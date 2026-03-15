const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/notesDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Note = mongoose.model("Note", NoteSchema);

app.get("/notes", async(req,res)=>{
  const notes = await Note.find();
  res.json(notes);
});

app.post("/notes", async(req,res)=>{

 const {title,content} = req.body;

 if(!title || !content){
   return res.status(400).json({message:"Title and content required"});
 }

 const note = new Note({title,content});
 await note.save();

 res.json(note);
});

app.put("/notes/:id", async(req,res)=>{
  const {title, content} = req.body;

  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    {title, content},
    {new:true}
  );

  res.json(updatedNote);
});

app.delete("/notes/:id", async(req,res)=>{
  await Note.findByIdAndDelete(req.params.id);
  res.send("Note deleted");
});

app.listen(5000,()=>{
  console.log("Server running on port 5000");
});