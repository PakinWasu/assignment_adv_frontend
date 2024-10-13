const express = require ('express');
const axios = require ('axios');
const app = express();
var bodyParser = require('body-parser');
const path = require('path')


const base_url = "http://localhost:3000";

app.set('views',path.join(__dirname,"/public/views"))
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));

// Route สำหรับการแสดงข้อมูลการรักษา
app.get("/", async (req, res) => {
 try {
     const response = await axios.get(`${base_url}/treatment`);
     const treatments = response.data; // เก็บข้อมูลการรักษา
     res.render("treatment", { treatments });
 } catch (err) {
     console.error('Error fetching treatments:', err);
     res.status(500).send('Error fetching treatments');
 }
});


app.get('/treatment-details/:treatmentID', async (req, res) => {
 const treatmentID = req.params.treatmentID;

 try {
   // ส่ง request เพื่อดึงข้อมูลรายละเอียดการรักษา
   const response = await axios.get(`${base_url}/treatment-details/${treatmentID}`);
   const treatmentDetails = response.data; // เก็บข้อมูลที่ได้รับจาก API

   if (treatmentDetails.length === 0) {
     return res.status(404).send('No treatment details found for the given treatment ID.');
   }

   // ส่งข้อมูลไปที่หน้าต่างๆ ผ่านการ render EJS
   res.render('treatment-details', { treatmentDetails });
 } catch (err) {
   console.error('Error fetching treatment details:', err);
   res.status(500).send('Error fetching treatment details');
 }
});
app.get("/update-doctor/:id", async (req, res) => {
 try {
     const response = await axios.get(base_url + '/doctor/' + req.params.id);
     res.render("update-doctor", { doctor: response.data });
 } catch (err) {
     console.error(err);
     res.status(500).send('Error');
 }
});
app.post("/update-doctor/:id", async (req, res) => {
 try {
     const doctorID = req.params.id;
     const data = {
         name: req.body.name,
         department: req.body.department,
         contact: req.body.contact,
         date_of_birth: req.body.date_of_birth,
         doctor_detail: req.body.doctor_detail,
         medical_practice_license_number: req.body.medical_practice_license_number
     };
     await axios.put(base_url + '/doctor/' + doctorID, data);
     res.redirect("/doctors");
 } catch (err) {
     console.error(err);
     res.status(500).send('Error');
 }
});




const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});