const appointments=require("../model/appointments")
const doctor=require("../model/doctor")
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const all_appointments = async (req, res) => {
    const id = req.id;
  
    try {

        const all_appointments = await appointments.find({doctor:id}).populate("user");
        console.log(all_appointments)
        if (!all_appointments) {
            return res
                .status(401)
                .json({ message: "no appointments found" });
        } else {
            return res.json({ all_appointments });
        }


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



const get_single_doctor=async(req,res)=>{
    const id=req.id
    console.log(id)
   
    try{
        const data=await doctor.findById(id)
        console.log(data)
        if(!data)
        {
          return res.status(401).json({
            message:"cannot find doctor"
           
          })
        }
        return  res.status(202).json({
          message:"find doctor successfully",
          data:data
  
        })
  
    }
    catch(e){
      return res.status(400).json({message:e.message})
  
  
  
    }
  }


  const update_doctor=async(req,res)=>{
    const id=req.id
    console.log(id)
    const {name, image,contact,email,desc,ammount}=req.body;
    try{
        if(!name | !image | !contact | !email | !desc | !ammount)
        {
            return res.status(202).json({
                message:"incomplete content"
            })
        }
        else{
            const data=await doctor.findById(id)
            console.log(data)
            if(!data)
            {
                return res.status(401).json({
                    message:"cannot find doctor"
                })
            }
            else{
                const update=await doctor.findByIdAndUpdate(id,{name, image,contact,email,desc,ammount})
                return res.status(202).json({
                    message:"update successfully",
                    data:update
                })
            }
        }
    }
    catch(e){
        return res.status(400).json({message:e.message})
    }



}


const change_date = async (req, res) => {

    try {
        const {_id, date} = req.body;
        console.log(_id, date);
        const new_date = await appointments.findByIdAndUpdate({ _id }, { date });

        
        // console.log(req.body);
        console.log(new_date);
        return res.status(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }



}


const update_medicine = async (req, res) => {
    const { _id, medicine, about } = req.body;
        console.log(_id, medicine, about);
    try {
        
        // const { id, medicine, about } = req.body;
        // console.log(id, medicine, about);
        if (!_id | !medicine | !about) {
            return res.status(202).json({ message: "incomplete-content" });
        } else {
            const appointment = await appointments.findOne({_id});
            console.log(appointment)
            if (!appointment) {
                return res.status(401).json({ message: "no appointment exist" });
            } else {
                await appointments.findByIdAndUpdate({ _id }, { medicine, about });
                return res.status(200).json({ message: "appointment updated" });
            }

        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

const getpatient = async (req, res) => {
    try {
        const doctor_id = req.user._id;
        const appointment = await appointments.find({ doctor: doctor_id }).populate("user").populate("doctor");
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await doctor.findOne({ email });
        if (!result) {
            return res.status(404).json({ message: "Email not found" });
        }

        //passwod
        const isMatch = await bcryptjs.compare(password, result.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        //token generation
        jwt.sign({ id: result._id }, "DOCTOR", { expiresIn: "2h" }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.cookie("doctortoken", token, { httpOnly: true });
            res.status(200).json({
                name: result.name,
                is_doctor: result.is_doctor,
                token
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logout = (req, res) => {
    res.clearCookie("doctortoken");
    res.status(200).json({ message: "Logout successful" });
};

// Add new controller methods for appointment approvals
const approveAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const { isApproved, approvedDate, status } = req.body;
        
        const updatedAppointment = await appointments.findByIdAndUpdate(
            appointmentId,
            { 
                isApproved, 
                approvedDate, 
                status
            },
            { new: true }
        ).populate("user").populate("doctor");
        
        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        
        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const rejectAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const { isApproved, status } = req.body;
        
        const updatedAppointment = await appointments.findByIdAndUpdate(
            appointmentId,
            { 
                isApproved, 
                status
            },
            { new: true }
        ).populate("user").populate("doctor");
        
        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        
        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const { name, expertise, contact, desc, date, ammount } = req.body;
        
        const updatedProfile = await doctor.findByIdAndUpdate(
            doctorId,
            { 
                name, 
                expertise, 
                contact,
                desc,
                date,
                ammount
            },
            { new: true }
        );
        
        if (!updatedProfile) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }
        
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const doctorProfile = await doctor.findById(doctorId);
        
        if (!doctorProfile) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }
        
        res.status(200).json(doctorProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports={all_appointments,get_single_doctor,update_doctor,change_date,update_medicine,getpatient,login,logout,approveAppointment,rejectAppointment,updateDoctorProfile,getDoctorProfile}
