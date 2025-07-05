const { initializeDatabase } = require("./db/db.connect")
const fs = require("fs");
const jobSchema = require("./jobSchema");


initializeDatabase()



async function seedData() {
    try{


    const jobJson = fs.readFileSync("./jobs.json", "utf-8");
    

    const jobs = JSON.parse(jobJson)
    

    await jobSchema.deleteMany({});
    

    await jobSchema.insertMany(jobs);
    

    console.log("Job data seeded successfully");
        
    } catch (error) {
        console.log("Error seeding the data", error)
    }
}

seedData()