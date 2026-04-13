const ApplicationForm = require("../Models/applicationModel");

// Home route
const home = async (req, res) => {
  try {
    res.status(200).send("Welcome");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST: Create new applications
const createApplication = async (req, res) => {
  try {
    let { applications } = req.body;

    if (!Array.isArray(applications) || applications.length === 0) {
      return res.status(400).json({ error: "Applications array is required." });
    }

    // Add isPaid to each application
    applications = applications.map((app) => ({ ...app, isPaid: "Unpaid" }));
    console.log(applications)
    const newEntry = new ApplicationForm({ applications });
    await newEntry.save();

    res
      .status(201)
      .json({ message: "Applications submitted successfully", data: newEntry });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ error: "Failed to create applications" });
  }
};

const updateApplication = async (req, res) => {
    try {
      const { parentId, applicationId, updatedData } = req.body;
  
      if (!parentId || !applicationId || !updatedData) {
        return res.status(400).json({ error: "parentId, applicationId, and updatedData are required." });
      }
  
      const updated = await ApplicationForm.findOneAndUpdate(
        { _id: parentId, "applications._id": applicationId },
        {
          $set: Object.entries(updatedData).reduce((acc, [key, val]) => {
            acc[`applications.$.${key}`] = val;
            return acc;
          }, {})
        },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ error: "Application not found." });
      }
  
      res.status(200).json({ message: "Application updated successfully", data: updated });
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ error: "Failed to update application" });
    }
  };
  

const deleteApplication = async (req, res) => {
    try {
      const { parentId, applicationId } = req.body;
  
      if (!parentId || !applicationId) {
        return res.status(400).json({ error: "Both parentId and applicationId are required." });
      }
  
      const updated = await ApplicationForm.findByIdAndUpdate(
        parentId,
        {
          $pull: {
            applications: { _id: applicationId }
          }
        },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ error: "Application or nested record not found." });
      }
  
      res.status(200).json({ message: "Application entry deleted successfully", data: updated });
    } catch (error) {
      console.error("Error deleting application entry:", error);
      res.status(500).json({ error: "Failed to delete application entry" });
    }
  };
  

// GET: Fetch all applications
const getApplication = async (req, res) => {
  try {
        console.log("User making request:", req.user); // e.g., { userId, role }

    const allApplications = await ApplicationForm.find();
    res
      .status(200)
      .json({ total: allApplications.length, data: allApplications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

module.exports = {
  home,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
};
