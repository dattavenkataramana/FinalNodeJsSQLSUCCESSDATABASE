const express = require("express");
const path = require("path")
const {open} = require("sqlite");
const sqlite3 = require("sqlite3")
const dbPath =  path.join(__dirname,"sqldata.db");
const app = express();
db = null
app.use(express.json());

const initializeDbServer = async ()=>{
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database,

        })
        app.listen(3001,()=>{
            console.log(`server runnint at http://localhost:3001`)
        })
    }catch(e){
        console.log(`Db Error :${e.message}`);
        process.exit(1);
    }
}   


initializeDbServer();


app.get('/employee/', async (request,response) =>{
     
    const getData = `SELECT * FROM employee`
    const respond = await db.get(getData)
    response.send(respond)
});
 app.post('/employee/', async(req,res)=>{
    const getQueryDetails = req.body 
    const {id,name,age,salary}  = getQueryDetails
    const addData = `
    INSERT INTO *  employee (id,name,age,salary)
    VALUES(
        ${id},
       ' ${name}',
        ${age},
        ${salary}
    )`
    const dbresponce = await db.run(addData);
    const  employeeId = dbresponce.lastID
    res.send({employeeId})  
}) 

 

app.put('/employee/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { id, name, age, salary } = req.body;

        const updateData = `
            UPDATE employee
            SET 
                id = ${id},
                name = '${name}',
                age = ${age},
                salary = ${salary}
            WHERE id = ${employeeId}`;

        const update = await db.run(updateData);
        res.send(update);
    } catch (error) {
        console.log(`Error updating employee: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}); 


app.delete('/employee/:employeeId',async (req, res) => {
    const { employeeId } = req.params;
        
        const deleteEmployeeId = `
            DELETE FROM employee
            WHERE id = ${employeeId}`;

        const deleteData = await db.run(deleteEmployeeId);
        res.send(deleteData);

})

