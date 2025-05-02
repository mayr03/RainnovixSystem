import sql from "mssql";

const dbSettings={
    user:"danie",
    password:"12345678",
    server:"localhost",
    database:"Rainnovixsystems",
    options:{
        encrypt:true,
        trustServerCertificate:true,
    },
};
async function getConnection() {
    try{
        const pool=await sql.connect(dbSettings);
        return pool;
    }
    catch{
        console.error(error);
    }
}
getConnection();