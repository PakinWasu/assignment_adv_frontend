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

app.get("/", async (req, res) => {
 try {
     const response = await axios.get(`${base_url}/treatment`);
     const treatments = response.data; 
     res.render("treatment", { treatments });
 } catch (err) {
     console.error('Error fetching treatments:', err);
     res.status(500).send('Error fetching treatments');
 }
});


app.get('/treatment-details/:treatmentID', async (req, res) => {
 const treatmentID = req.params.treatmentID;

 try {
   const response = await axios.get(`${base_url}/treatment-details/${treatmentID}`);
   const treatmentDetails = response.data; 

   if (treatmentDetails.length === 0) {
     return res.status(404).send('No treatment details found for the given treatment ID.');
   }

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
     res.redirect("/");
 } catch (err) {
     console.error(err);
     res.status(500).send('Error');
 }
});

app.get("/update-patient/:id", async (req, res) => {
 try {
     const response = await axios.get(`${base_url}/patient/${req.params.id}`);
     res.render("update-patient", { patient: response.data });
 } catch (err) {
     console.error(err);
     res.status(500).send('Error fetching patient data');
 }
});

app.post("/update-patient/:id", async (req, res) => {
 try {
     const patientID = req.params.id; 
     
     const data = {
         name: req.body.name,
         date_of_birth: req.body.date_of_birth,
         blood_type: req.body.blood_type,
         weight: req.body.weight,
         height: req.body.height,
         contact: req.body.contact,
         patient_detail: req.body.patient_detail
     };
    
     await axios.put(`${base_url}/patient/${patientID}`, data);
     res.redirect("/");
 } catch (err) {
     console.error(err);
     res.status(500).send('Error updating patient');
 }
});
app.get("/update-treatment-detail/:id", async (req, res) => {
    try {
        // Fetch the treatment detail data by its ID
        const response = await axios.get(`${base_url}/treatment-detail/${req.params.id}`);
        res.render("update-treatment-detail", { treatmentDetail: response.data });
    } catch (err) {
        console.error('Error fetching treatment detail:', err);
        res.status(500).send('Error fetching treatment detail data');
    }
});

// Route to handle form submission and update treatment detail
app.post("/update-treatment-detail/:id", async (req, res) => {
    try {
        const treatmentDetailID = req.params.id;

        // Collect the data from the form fields
        const data = {
            treatmentID:req.body.treatmentID,
            timestamp: req.body.timestamp,
            next_treatment_date: req.body.next_treatment_date,
            dispensing_medicine: req.body.dispensing_medicine,
            latest_treatment_detail: req.body.latest_treatment_detail
        };

        // Send the update request to the API or database
        await axios.put(`${base_url}/treatment-detail/${treatmentDetailID}`, data);

        // Redirect to the treatment detail or another relevant page after updating
        res.redirect("/");
    } catch (err) {
        console.error('Error updating treatment detail:', err);
        res.status(500).send('Error updating treatment detail');
    }
});
app.get("/update-treatment-detail/:id", async (req, res) => {
    try {
        // Fetch the treatment detail data by its ID
        const response = await axios.get(`${base_url}/treatment-detail/${req.params.id}`);
        res.render("update-treatment-detail", { treatmentDetail: response.data });
    } catch (err) {
        console.error('Error fetching treatment detail:', err);
        res.status(500).send('Error fetching treatment detail data');
    }
});

// Route to handle form submission and update treatment detail
app.post("/update-treatment-detail/:id", async (req, res) => {
    try {
        const treatmentDetailID = req.params.id;

        // Collect the data from the form fields
        const data = {
            treatmentID:req.body.treatmentID,
            timestamp: req.body.timestamp,
            next_treatment_date: req.body.next_treatment_date,
            dispensing_medicine: req.body.dispensing_medicine,
            latest_treatment_detail: req.body.latest_treatment_detail
        };

        // Send the update request to the API or database
        await axios.put(`${base_url}/treatment-detail/${treatmentDetailID}`, data);

        // Redirect to the treatment detail or another relevant page after updating
        res.redirect("/");
    } catch (err) {
        console.error('Error updating treatment detail:', err);
        res.status(500).send('Error updating treatment detail');
    }
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});