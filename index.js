const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
const port = 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

/*---------------connecting mongodb----------------------------------------*/
const url = `mongodb+srv://digbj:digbj@crud.7q2v2oa.mongodb.net/event`;
mongoose
  .connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("connected to db sucessfully"))
  .catch((err) => console.log(err.message));

/* -------------------Creating Schema-------------------------------------*/
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, required: true },
});

const task = mongoose.model("Task", taskSchema);

/*---------------APIs---------------*/
// POST /v1/tasks

app.post("/v1/task", async (req, res) => {
  const newTask = new task({
    title: req.body.title,
    completed: req.body.completed,
  });
  if (!newTask.title) {
    res.status(400).send("Field can't be empty");
  } else {
    try {
      const saveTask = await newTask.save();
      res.status(201).json(saveTask);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
});

// Api for getting all the task

app.get("/v1/tasks", async (req, res) => {
  try {
    const tasks = await task.find();
    res.status(201).send(tasks);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//getting specfifed task

app.get("/v1/task/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const taskById = await task.findById(id);
    if(taskById){
        res.status(201).send(taskById);
    }else{
        res.status(404).send("Task Not Found");
    }
    
  } catch (err) {
    res.status(404).json("Task Not Found");
  }
});


//deleting a task by id

app.delete("/v1/task/:id",async(req,res)=>{
    const { id } = req.params;

    try{
const deleteTask= await task.findByIdAndDelete(id);
if(deleteTask){
    res.status(200).json(deleteTask)
}else{
    res.status(200).send("No such task exist")
}

    }catch(err){
        res.status(204).json("None");
    }
})

/*--------------updating the task-------------*/

app.put("/v1/task/:id", async(req,res)=>{
    const {id}=req.params;
    const updateTask=req.body;

    try{
const updatedTask=await task.findByIdAndUpdate(id,updateTask,{new:true});
if(updateTask){
    res.status(201).json(updatedTask);
}else{
    res.status(404).send("Id not found");
}

    }catch(err){
        res.status(204).json(err);
    }

})




/*------------------Getting the id in bulk (not working)------------------*/
app.get("/v1/taskk/:id", async (req, res) => {
    const {id} = req.params;
    // let idarr=[];
const idarr=id.split(',')
    console.log(idarr)
    try {
        for(let i=0;i<idarr.length;i++){
            const taskById = await task.findById(id[i]);
            // if(taskById){
                res.status(201).send(taskById);
                console.log(taskById)
            // }else{
            //     res.status(404).send("Task Not Found");
            // }
        }
     
      
    } catch (err) {
      res.status(404).json("Task Not Found");
    }
  });







// app.get("/", (req, res) => {
//   res.status(200).send("hello");
// });
app.listen(port, () => {
  console.log("server is live on 8080");
});
