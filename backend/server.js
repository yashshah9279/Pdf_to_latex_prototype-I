import app from "./app.js"
app.listen(process.env.PORT,()=>{
    console.log(`Server Listening on port ${process.env.PORT}`);
});